import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return null or dummy client if env is not configured yet
    return null;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
