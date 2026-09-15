// The only result that currently uses browser storage is the static demo.
// Real reading jobs are already persisted by the server.
const STORAGE_PREFIX = "saved-result:demo:v1:";
const CHANGED_EVENT = "saved-result:demo-changed";

export function getSavedDemoResult(userId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const savedAt = window.sessionStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    return savedAt && Number.isFinite(Date.parse(savedAt)) ? savedAt : null;
  } catch {
    return null;
  }
}

export function setDemoResultSaved(userId: string, isSaved: boolean): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = `${STORAGE_PREFIX}${userId}`;
    if (isSaved) {
      window.sessionStorage.setItem(key, getSavedDemoResult(userId) ?? new Date().toISOString());
    } else {
      window.sessionStorage.removeItem(key);
    }
    window.dispatchEvent(new Event(CHANGED_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function subscribeToSavedDemoResult(listener: () => void) {
  window.addEventListener(CHANGED_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(CHANGED_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
