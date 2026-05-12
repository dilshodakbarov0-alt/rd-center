import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function makeClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // Return a minimal stub so server pages don't crash at build time
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      from: (_table: string) => ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        select: (_cols: string) => ({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          eq: (_col: string, _val: unknown) =>
            Promise.resolve({ data: null as null, error: null }),
        }),
      }),
    };
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseServer = makeClient() as any;
