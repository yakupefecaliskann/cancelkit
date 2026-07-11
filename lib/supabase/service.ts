import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for widget-facing /api/v1/* routes. Bypasses RLS —
 * every query here MUST be manually scoped to a project_id resolved from
 * the request's pk_ key (see lib/widget-auth.ts). Never expose this client
 * or its key to the browser.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
