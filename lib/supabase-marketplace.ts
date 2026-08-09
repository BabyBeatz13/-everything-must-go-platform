import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseMarketplace = createClient(
  supabaseUrl ?? "https://example-project.supabase.co",
  supabaseAnonKey ?? "public-anon-placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
) as any;

export function isMarketplaceSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
