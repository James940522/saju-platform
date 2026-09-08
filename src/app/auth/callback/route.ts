import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/shared/api/config/api_config";
import { getSupabasePublicConfig } from "@/shared/supabase/config";
import { createServerSupabaseClient } from "@/shared/supabase/server_client";

function getSafeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function createLoginErrorRedirect(requestUrl: URL, reason: string) {
  const loginUrl = new URL("/login", requestUrl.origin);
  loginUrl.searchParams.set("authError", reason);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (!code || !getSupabasePublicConfig()) {
    return createLoginErrorRedirect(requestUrl, "oauth_callback_failed");
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return createLoginErrorRedirect(requestUrl, "oauth_callback_failed");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/users/me`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${data.session.access_token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("User provisioning failed.");
    }
  } catch {
    await supabase.auth.signOut();
    return createLoginErrorRedirect(requestUrl, "user_provisioning_failed");
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
