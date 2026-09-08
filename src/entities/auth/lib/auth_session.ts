import { getBrowserSupabaseClient } from "@/shared/supabase/browser_client";

export type AuthUserSnapshot = string | null | undefined;

let authUserSnapshot: AuthUserSnapshot;
let isAuthStarted = false;
const listeners = new Set<() => void>();

function updateAuthUserSnapshot(nextSnapshot: string | null) {
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

  try {
    const supabase = getBrowserSupabaseClient();

    void supabase.auth.getSession().then(({ data, error }) => {
      updateAuthUserSnapshot(error ? null : (data.session?.user.id ?? null));
    });

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
  const supabase = getBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
