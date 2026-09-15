import { ApiClientError } from "./api_client_error";

// Temporary presentation fallback. Set false when the live service launches.
export const DEMO_FALLBACK_ENABLED =
  process.env.NEXT_PUBLIC_DEMO_FALLBACK !== "false";
export const DEMO_USER_ID = "demo-preview-user";
export const DEMO_REQUEST_TIMEOUT_MS = 3_000;
const SESSION_KEY = "sunny-saju:preview:v1:";
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

export function readDemoStorage(key: string): unknown {
  try {
    const value = typeof window === "undefined"
      ? memory.get(key)
      : window.sessionStorage.getItem(SESSION_KEY + key) ?? memory.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    const value = memory.get(key);
    return value ? JSON.parse(value) : null;
  }
}

export function writeDemoStorage(key: string, value: unknown) {
  const serialized = JSON.stringify(value);
  memory.set(key, serialized);
  try {
    if (typeof window !== "undefined")
      window.sessionStorage.setItem(SESSION_KEY + key, serialized);
  } catch {
    // Keep this visit usable when browser storage is unavailable.
  }
}

export function isDemoActive() {
  return DEMO_FALLBACK_ENABLED && (
    process.env.NEXT_PUBLIC_DEMO_FALLBACK === "always" ||
    (process.env.NODE_ENV === "production" &&
      !process.env.NEXT_PUBLIC_API_BASE_URL?.trim()) ||
    readDemoStorage("active") === true
  );
}

export function activateDemo() {
  if (!DEMO_FALLBACK_ENABLED) return;
  writeDemoStorage("active", true);
  listeners.forEach((listener) => listener());
}

export function subscribeToDemo(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function canUseDemoFallback(error: unknown) {
  return DEMO_FALLBACK_ENABLED && error instanceof ApiClientError && (
    error.data?.reason === "NETWORK_ERROR" ||
    error.data?.reason === "REQUEST_TIMEOUT" ||
    (error.code !== null && error.code >= 500) ||
    // An undeployed API origin may return an HTML hosting/404 page.
    (error.data?.reason === "INVALID_API_RESPONSE" &&
      error.code !== 401 && error.code !== 403 && error.code !== 429)
  );
}

export async function withDemoFallback<T>(
  request: () => Promise<T>,
  demo: (() => T) | undefined,
  isAborted: () => boolean = () => false,
): Promise<T> {
  const assertActive = () => {
    if (isAborted()) throw new DOMException("Request aborted", "AbortError");
  };
  const fallback = () => {
    assertActive();
    if (!demo) {
      throw new ApiClientError({
        code: null,
        message: "화면 미리보기에서는 실제 계정을 변경할 수 없어요.",
        data: { reason: "DEMO_ACTION_UNAVAILABLE" },
      });
    }
    return demo();
  };
  assertActive();
  if (isDemoActive()) return fallback();
  try {
    const result = await request();
    assertActive();
    // A concurrent request may have switched the entire tab to preview data.
    return isDemoActive() ? fallback() : result;
  } catch (error) {
    assertActive();
    if (!demo || !canUseDemoFallback(error)) throw error;
    activateDemo();
    return fallback();
  }
}
