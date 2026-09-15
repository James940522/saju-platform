import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabasePublicConfig } from "@/shared/supabase/config";

export async function proxy(request: NextRequest) {
  const isForcedPreview = process.env.NEXT_PUBLIC_DEMO_FALLBACK !== "false" && (
    process.env.NEXT_PUBLIC_DEMO_FALLBACK === "always" ||
    (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_API_BASE_URL?.trim())
  );
  if (isForcedPreview) return NextResponse.next({ request });
  const config = getSupabasePublicConfig();

  if (!config) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
