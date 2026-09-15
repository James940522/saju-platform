import { getBrowserSupabaseClient } from "@/shared/supabase/browser_client";
import {
  DEMO_FALLBACK_ENABLED,
  DEMO_USER_ID,
  isDemoActive,
  requestApi,
  subscribeToDemo,
} from "@/shared/api";

export type AuthUserSnapshot = string | null | undefined;

let authUserSnapshot: AuthUserSnapshot;
let isAuthStarted = false;
const listeners = new Set<() => void>();

function updateAuthUserSnapshot(nextSnapshot: string | null) {
  if (isDemoActive()) nextSnapshot = DEMO_USER_ID;
  if (authUserSnapshot === nextSnapshot) {
    return;
  }

  authUserSnapshot = nextSnapshot;
  listeners.forEach((listener) => listener());
}

function startAuthSession() {
  if (isAuthStarted) {
    return;
  }

  isAuthStarted = true;

  subscribeToDemo(() => updateAuthUserSnapshot(DEMO_USER_ID));
  void initializeAuthSession();
}

async function initializeAuthSession() {
  // Resolve API availability before redirecting guests away from protected UI.
  if (DEMO_FALLBACK_ENABLED && !isDemoActive()) {
    try {
      await requestApi({ method: "GET", url: "/v1/reading-products" }, () => null);
    } catch {
      // A real authentication/validation failure must keep the normal auth flow.
    }
  }
  if (isDemoActive()) {
    updateAuthUserSnapshot(DEMO_USER_ID);
    return;
  }

  try {
    const supabase = getBrowserSupabaseClient();

    void supabase.auth.getSession().then(({ data, error }) => {
      updateAuthUserSnapshot(error ? null : (data.session?.user.id ?? null));
    }).catch(() => updateAuthUserSnapshot(null));

    supabase.auth.onAuthStateChange((_event, session) => {
      updateAuthUserSnapshot(session?.user.id ?? null);
    });
  } catch {
    updateAuthUserSnapshot(null);
  }
}

export function subscribeToAuth(listener: () => void) {
  listeners.add(listener);
  startAuthSession();

  return () => listeners.delete(listener);
}

export function getAuthenticatedUserId(): AuthUserSnapshot {
  return authUserSnapshot;
}

export function getAuthServerSnapshot(): undefined {
  return undefined;
}

export async function signOutAuthenticatedUser() {
  if (isDemoActive()) return;
  const supabase = getBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

// Auth may already be deleted. The installed SDK clears local storage even
// when its remote sign-out returns an error; always clear our snapshot too.
export async function clearWithdrawnSession() {
  if (isDemoActive()) return;
  updateAuthUserSnapshot(null);
  try {
    const supabase = getBrowserSupabaseClient();
    await supabase.auth.stopAutoRefresh();
    await supabase.auth.signOut({ scope: "local" });
  } finally {
    updateAuthUserSnapshot(null);
  }
}
