import crypto from "crypto";
import { Profile } from "@/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string; // Salted cryptographic hash
  full_name: string;
  dob: string;
  avatar_url?: string;
  phone_number?: string;
  role: "visitor" | "admin" | "staff";
  created_at: string;
}

export type SafeUser = Omit<StoredUser, "passwordHash">;

// Designated Directorate Administrator Credentials
export const ADMIN_EMAIL = "abhisingh940927@gmail.com";
export const ADMIN_PHONE = "9905359191";
export const ADMIN_PASSWORD_PLAIN = "Abhinav@990535";
export const ADMIN_NAME = "Abhinav Singh";
export const ADMIN_DOB = "1998-05-14";

const PASSWORD_SALT = "heritage_guard_secure_salt_2026_v1";

export function hashPassword(plainText: string): string {
  return crypto
    .createHash("sha256")
    .update(plainText + PASSWORD_SALT)
    .digest("hex");
}

export function verifyPassword(plainText: string, storedHash: string): boolean {
  const computed = hashPassword(plainText);
  return (
    computed.length === storedHash.length &&
    crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(storedHash))
  );
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

  // ENFORCE ONLY ONE ADMIN ACCOUNT - NO DEMO ACCOUNTS
  globalThis.__HERITAGE_USERS__.set(ADMIN_EMAIL, {
    id: "usr-admin-directorate",
    email: ADMIN_EMAIL,
    passwordHash: hashPassword(ADMIN_PASSWORD_PLAIN),
    full_name: ADMIN_NAME,
    dob: ADMIN_DOB,
    phone_number: ADMIN_PHONE,
    role: "admin",
    created_at: "2026-01-01T00:00:00.000Z",
  });
}

const usersStore = globalThis.__HERITAGE_USERS__!;

export function toSafeUser(user: StoredUser): SafeUser {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    dob: user.dob,
    phone_number: user.phone_number,
    role: user.role,
    created_at: user.created_at,
  };
}

export async function registerNewUser(data: {
  email: string;
  password: string;
  full_name: string;
  dob: string;
  phone_number?: string;
}): Promise<{ success: boolean; user?: SafeUser; error?: string }> {
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

  // Prevent overwriting the single authorized admin account
  if (cleanEmail === ADMIN_EMAIL) {
    return {
      success: false,
      error: "This email is registered as the Directorate Administrator. Please sign in instead.",
    };
  }

  if (usersStore.has(cleanEmail)) {
    return {
      success: false,
      error: "An account with this email already exists. Please sign in.",
    };
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
            role: "visitor", // Strict RBAC: All public registrations are visitors
          },
        },
      });

      if (authErr && !authErr.message.includes("already registered")) {
        console.warn("Supabase auth signUp warning:", authErr.message);
      } else if (authData?.user) {
        supabaseUserId = authData.user.id;
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

  // 3. Persist in runtime store with salted password hash
  const userId = supabaseUserId || `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newUser: StoredUser = {
    id: userId,
    email: cleanEmail,
    passwordHash: hashPassword(data.password),
    full_name: cleanName,
    dob: cleanDob,
    phone_number: cleanPhone,
    role: "visitor",
    created_at: new Date().toISOString(),
  };

  usersStore.set(cleanEmail, newUser);
  globalThis.__CURRENT_USER_SESSION__ = newUser;

  return { success: true, user: toSafeUser(newUser) };
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: SafeUser; error?: string }> {
  const cleanEmail = data.email.trim().toLowerCase();

  if (!cleanEmail || !data.password) {
    return { success: false, error: "Email and password are required." };
  }
  if (data.password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long." };
  }

  // Special Handler for Single Authorized Admin
  if (cleanEmail === ADMIN_EMAIL) {
    const adminRecord = usersStore.get(ADMIN_EMAIL);
    const valid = adminRecord && verifyPassword(data.password, adminRecord.passwordHash);
    if (valid) {
      const adminSafe = toSafeUser(adminRecord);
      globalThis.__CURRENT_USER_SESSION__ = adminRecord;
      return { success: true, user: adminSafe };
    } else {
      return { success: false, error: "Incorrect administrator password." };
    }
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
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        const user: StoredUser = {
          id: authData.user.id,
          email: cleanEmail,
          passwordHash: hashPassword(data.password),
          full_name: profileData?.full_name || authData.user.user_metadata?.full_name || "Explorer",
          dob: profileData?.dob || authData.user.user_metadata?.dob || "",
          phone_number: profileData?.phone_number || authData.user.user_metadata?.phone_number || "",
          role: "visitor", // Public accounts are visitors
          created_at: authData.user.created_at,
        };

        usersStore.set(cleanEmail, user);
        globalThis.__CURRENT_USER_SESSION__ = user;
        return { success: true, user: toSafeUser(user) };
      }
    }
  } catch (err) {
    console.warn("Supabase auth login check:", err);
  }

  // 2. Check runtime store
  const storedUser = usersStore.get(cleanEmail);
  if (storedUser) {
    if (verifyPassword(data.password, storedUser.passwordHash)) {
      globalThis.__CURRENT_USER_SESSION__ = storedUser;
      return { success: true, user: toSafeUser(storedUser) };
    } else {
      return { success: false, error: "Incorrect password. Please verify your credentials." };
    }
  }

  return {
    success: false,
    error: "No account found with this email. Please register first to explore India's heritage sites.",
  };
}

export async function getCurrentActiveUser(): Promise<SafeUser | null> {
  // 1. Try Supabase Server Client
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data?.user && data.user.email) {
        const isUserAdmin = data.user.email.toLowerCase() === ADMIN_EMAIL;
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        return {
          id: data.user.id,
          email: data.user.email,
          full_name: profile?.full_name || data.user.user_metadata?.full_name || (isUserAdmin ? ADMIN_NAME : "Explorer"),
          avatar_url: profile?.avatar_url || data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || "",
          dob: profile?.dob || data.user.user_metadata?.dob || (isUserAdmin ? ADMIN_DOB : ""),
          phone_number: profile?.phone_number || data.user.user_metadata?.phone_number || (isUserAdmin ? ADMIN_PHONE : ""),
          role: isUserAdmin ? "admin" : (profile?.role || "visitor"),
          created_at: data.user.created_at,
        };
      }
    }
  } catch {
    // Ignore and fallback
  }

  // 2. Check cookie hg_user_email from next/headers
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const emailCookie = cookieStore.get("hg_user_email")?.value?.toLowerCase();
    if (emailCookie) {
      if (emailCookie === ADMIN_EMAIL) {
        return {
          id: "usr-admin-directorate",
          email: ADMIN_EMAIL,
          full_name: ADMIN_NAME,
          dob: ADMIN_DOB,
          phone_number: ADMIN_PHONE,
          role: "admin",
          created_at: "2026-01-01T00:00:00.000Z",
        };
      }
      if (usersStore.has(emailCookie)) {
        return toSafeUser(usersStore.get(emailCookie)!);
      }
    }
  } catch {
    // Ignore when cookies() cannot be evaluated in this scope
  }

  // 3. Check active global session
  if (globalThis.__CURRENT_USER_SESSION__) {
    return toSafeUser(globalThis.__CURRENT_USER_SESSION__);
  }

  return null;
}

export async function logoutUser(): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch {
    // Ignore
  }
  globalThis.__CURRENT_USER_SESSION__ = null;
}
