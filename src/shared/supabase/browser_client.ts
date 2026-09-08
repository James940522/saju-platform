import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";

let browserClient: SupabaseClient | undefined;

export function getBrowserSupabaseClient() {
  if (browserClient) {
    return browserClient;
  }

  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error("Supabase public configuration is missing.");
  }

  browserClient = createBrowserClient(config.url, config.publishableKey);
  return browserClient;
}
