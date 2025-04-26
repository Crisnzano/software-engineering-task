import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"; // Required to pass cookies

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookieStore).getAll(),
      },
    }
  );
}
