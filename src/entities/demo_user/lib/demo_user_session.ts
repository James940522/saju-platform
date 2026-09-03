import type {
  DemoUserIdentifier,
  DemoUserSnapshot,
} from "../model/demo_user";

const DEMO_USER_IDENTIFIER_STORAGE_KEY = "saju-platform:demo-user-identifier";
const DEMO_USER_CHANGE_EVENT = "saju-platform:demo-user-change";

function notifyDemoUserChange() {
  window.dispatchEvent(new Event(DEMO_USER_CHANGE_EVENT));
}

export function getDemoUserIdentifier(): DemoUserSnapshot {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const identifier = window.sessionStorage
      .getItem(DEMO_USER_IDENTIFIER_STORAGE_KEY)
      ?.trim();

    return identifier || null;
  } catch {
    return null;
  }
}

export function getDemoUserServerSnapshot(): undefined {
  return undefined;
}

export function signInDemoUser(identifier: string) {
  if (typeof window === "undefined") {
    return false;
  }

  const normalizedIdentifier: DemoUserIdentifier = identifier.trim();

  if (!normalizedIdentifier) {
    return false;
  }

  try {
    window.sessionStorage.setItem(
      DEMO_USER_IDENTIFIER_STORAGE_KEY,
      normalizedIdentifier,
    );
    notifyDemoUserChange();
    return true;
  } catch {
    return false;
  }
}

export function signOutDemoUser() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.sessionStorage.removeItem(DEMO_USER_IDENTIFIER_STORAGE_KEY);
    notifyDemoUserChange();
    return true;
  } catch {
    return false;
  }
}

export function subscribeToDemoUser(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  function handleStorage(event: StorageEvent) {
    if (
      event.key === null ||
      event.key === DEMO_USER_IDENTIFIER_STORAGE_KEY
    ) {
      listener();
    }
  }

  window.addEventListener(DEMO_USER_CHANGE_EVENT, listener);
  window.addEventListener("focus", listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(DEMO_USER_CHANGE_EVENT, listener);
    window.removeEventListener("focus", listener);
    window.removeEventListener("storage", handleStorage);
  };
}
