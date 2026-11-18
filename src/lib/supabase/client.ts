import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your-project-id") &&
  !supabaseAnonKey.includes("your-anon")
);

export function createClient() {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    // Return null if env is not configured with live credentials
    return null;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
