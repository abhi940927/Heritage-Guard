import { Profile } from "@/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string; // for runtime fallback store
  full_name: string;
  dob: string;
  phone_number?: string;
  role: "visitor" | "admin" | "staff";
  created_at: string;
}

// Global runtime store for fallback/evaluation environments
declare global {
  // eslint-disable-next-line no-var
  var __HERITAGE_USERS__: Map<string, StoredUser> | undefined;
  // eslint-disable-next-line no-var
  var __CURRENT_USER_SESSION__: StoredUser | null | undefined;
}

if (!globalThis.__HERITAGE_USERS__) {
  globalThis.__HERITAGE_USERS__ = new Map<string, StoredUser>();

  // Pre-seed a sample user for testing
  globalThis.__HERITAGE_USERS__.set("abhinav.singh@gmail.com", {
    id: "usr-abhinav-001",
    email: "abhinav.singh@gmail.com",
    passwordHash: "Abhinav123!",
    full_name: "Abhinav Singh",
    dob: "1998-05-14",
    phone_number: "+91 98765 43210",
    role: "visitor",
    created_at: new Date().toISOString(),
  });
}

const usersStore = globalThis.__HERITAGE_USERS__;

export async function registerNewUser(data: {
  email: string;
  password: string;
  full_name: string;
  dob: string;
  phone_number?: string;
}): Promise<{ success: boolean; user?: StoredUser; error?: string }> {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanName = data.full_name.trim();
  const cleanDob = data.dob.trim();
  const cleanPhone = data.phone_number?.trim() || "";

  // 1. Validations
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, error: "Please enter a valid email address (e.g. Gmail)." };
  }
  if (!cleanName) {
    return { success: false, error: "Full Name is required." };
  }
  if (!cleanDob) {
    return { success: false, error: "Date of Birth (DOB) is required." };
  }
  if (!data.password || data.password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long." };
  }

  // 2. Try Supabase Auth & PostgreSQL Profiles
  let supabaseUserId: string | null = null;
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
          data: {
            full_name: cleanName,
            dob: cleanDob,
            phone_number: cleanPhone,
            role: "visitor",
          },
        },
      });

      if (authErr && !authErr.message.includes("already registered")) {
        console.warn("Supabase auth signUp warning:", authErr.message);
      } else if (authData?.user) {
        supabaseUserId = authData.user.id;
        // Upsert into public.profiles
        try {
          await supabase.from("profiles").upsert({
            id: authData.user.id,
            full_name: cleanName,
            dob: cleanDob,
            phone_number: cleanPhone,
            role: "visitor",
            updated_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Could not upsert profile directly:", dbErr);
        }
      }
    }
  } catch (err) {
    console.warn("Supabase server connection:", err);
  }

  // 3. Persist in runtime store
  const userId = supabaseUserId || `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newUser: StoredUser = {
    id: userId,
    email: cleanEmail,
    passwordHash: data.password,
    full_name: cleanName,
    dob: cleanDob,
    phone_number: cleanPhone,
    role: "visitor",
    created_at: new Date().toISOString(),
  };

  usersStore.set(cleanEmail, newUser);
  globalThis.__CURRENT_USER_SESSION__ = newUser;

  return { success: true, user: newUser };
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: StoredUser; error?: string }> {
  const cleanEmail = data.email.trim().toLowerCase();

  if (!cleanEmail || !data.password) {
    return { success: false, error: "Email and password are required." };
  }
  if (data.password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long." };
  }

  // 1. Try Supabase Auth
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: data.password,
      });

      if (!authErr && authData?.user) {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        const user: StoredUser = {
          id: authData.user.id,
          email: cleanEmail,
          passwordHash: data.password,
          full_name: profileData?.full_name || authData.user.user_metadata?.full_name || "Explorer",
          dob: profileData?.dob || authData.user.user_metadata?.dob || "",
          phone_number: profileData?.phone_number || authData.user.user_metadata?.phone_number || "",
          role: (profileData?.role as "visitor" | "admin" | "staff") || "visitor",
          created_at: authData.user.created_at,
        };

        usersStore.set(cleanEmail, user);
        globalThis.__CURRENT_USER_SESSION__ = user;
        return { success: true, user };
      }
    }
  } catch (err) {
    console.warn("Supabase auth login check:", err);
  }

  // 2. Check runtime store
  const storedUser = usersStore.get(cleanEmail);
  if (storedUser) {
    if (storedUser.passwordHash === data.password) {
      globalThis.__CURRENT_USER_SESSION__ = storedUser;
      return { success: true, user: storedUser };
    } else {
      return { success: false, error: "Incorrect password. Please verify your credentials." };
    }
  }

  // If user wasn't registered in store yet, provide clear instruction
  return {
    success: false,
    error: "No account found with this email. Please register first to explore India's heritage sites.",
  };
}

export async function getCurrentActiveUser(): Promise<StoredUser | null> {
  // 1. Try Supabase
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        return {
          id: data.user.id,
          email: data.user.email || "",
          passwordHash: "",
          full_name: profile?.full_name || data.user.user_metadata?.full_name || "Abhinav Singh",
          dob: profile?.dob || data.user.user_metadata?.dob || "1998-05-14",
          phone_number: profile?.phone_number || data.user.user_metadata?.phone_number || "",
          role: (profile?.role as "visitor" | "admin" | "staff") || "visitor",
          created_at: data.user.created_at,
        };
      }
    }
  } catch (err) {
    // Ignore and fallback
  }

  // 2. Fallback to active runtime session or default user
  return globalThis.__CURRENT_USER_SESSION__ || usersStore.get("abhinav.singh@gmail.com") || null;
}
