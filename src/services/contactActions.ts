import { ContactMessage } from "@/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

let localContactMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Dr. Ananya Sen",
    email: "ananya.sen@univ-heritage.org",
    subject: "Academic Research Access for Taj Mahal Inscriptions",
    message:
      "Requesting information regarding off-peak research hours for epigraphical photography in the Taj Mahal eastern arcade.",
    status: "read",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "msg-2",
    name: "Vikram Malhotra",
    email: "vikram.m@travelagency.in",
    subject: "Bulk Heritage Tour Slots for International Delegations",
    message:
      "We are organizing a 40-member architectural symposium delegation to Amer Fort and Red Fort next month. Would like to inquire about group slot reservation protocols.",
    status: "unread",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.name || !data.email || !data.message) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: data.name,
      email: data.email,
      subject: data.subject || "General Inquiry",
      message: data.message,
      status: "unread",
      created_at: new Date().toISOString(),
    };

    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        await supabase.from("contact_messages").insert({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          status: "unread",
        });
      }
    } catch (dbErr) {
      console.warn("Supabase contact insert fallback:", dbErr);
    }

    localContactMessages.unshift(newMessage);
    return { success: true };
  } catch (err) {
    console.error("Error submitting contact form:", err);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}

export async function getContactMessagesAdmin(): Promise<ContactMessage[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as ContactMessage[];
      }
    }
  } catch (err) {
    console.warn("Supabase contact list query fallback:", err);
  }

  return localContactMessages;
}
