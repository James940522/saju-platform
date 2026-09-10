import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/shared/api/config/api_config";
import { getSafeReturnPath } from "@/shared/lib";
import { getSupabasePublicConfig } from "@/shared/supabase/config";
import { createServerSupabaseClient } from "@/shared/supabase/server_client";

function createLoginErrorRedirect(
  requestUrl: URL,
  reason: string,
  nextPath: string,
) {
  const loginUrl = new URL("/login", requestUrl.origin);
  loginUrl.searchParams.set("authError", reason);

  if (nextPath !== "/") {
    loginUrl.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(loginUrl);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath =
    getSafeReturnPath(requestUrl.searchParams.get("next")) ?? "/";

  if (!code || !getSupabasePublicConfig()) {
    return createLoginErrorRedirect(
      requestUrl,
      "oauth_callback_failed",
      nextPath,
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return createLoginErrorRedirect(
      requestUrl,
      "oauth_callback_failed",
      nextPath,
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${data.session.access_token}`,
      },
      cache: "no-store",
    });

    if (!response.ok && response.status !== 404) {
      throw new Error("User lookup failed.");
    }
  } catch {
    await supabase.auth.signOut();
    return createLoginErrorRedirect(
      requestUrl,
      "user_provisioning_failed",
      nextPath,
    );
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
