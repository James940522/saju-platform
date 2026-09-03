import type {
  DemoPaymentMethod,
  DemoReadingPurchase,
} from "../model/reading_purchase";

const DEMO_PURCHASE_STORAGE_KEY_PREFIX = "reading-purchase:demo";
const DEMO_PURCHASE_CHANGED_EVENT = "reading-purchase:demo-changed";

function getStorageKey(readingCode: string) {
  return `${DEMO_PURCHASE_STORAGE_KEY_PREFIX}:${readingCode}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDemoPaymentMethod(value: unknown): value is DemoPaymentMethod {
  return (
    value === "kakao-pay" || value === "naver-pay" || value === "toss-pay"
  );
}

function notifyPurchaseChanged() {
  window.dispatchEvent(new Event(DEMO_PURCHASE_CHANGED_EVENT));
}

export function parseDemoReadingPurchaseSnapshot(
  snapshot: string | null,
): DemoReadingPurchase | null {
  if (!snapshot) {
    return null;
  }

  try {
    const value: unknown = JSON.parse(snapshot);

    if (
      !isRecord(value) ||
      typeof value.readingCode !== "string" ||
      !isDemoPaymentMethod(value.method) ||
      typeof value.amount !== "number" ||
      !Number.isFinite(value.amount) ||
      value.amount < 0 ||
      typeof value.paidAt !== "string" ||
      Number.isNaN(Date.parse(value.paidAt))
    ) {
      return null;
    }

    return {
      readingCode: value.readingCode,
      method: value.method,
      amount: value.amount,
      paidAt: value.paidAt,
    };
  } catch {
    return null;
  }
}

export function getDemoReadingPurchaseSnapshot(readingCode: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage.getItem(getStorageKey(readingCode));
  } catch {
    return null;
  }
}

export function getDemoReadingPurchase(readingCode: string) {
  const purchase = parseDemoReadingPurchaseSnapshot(
    getDemoReadingPurchaseSnapshot(readingCode),
  );

  return purchase?.readingCode === readingCode ? purchase : null;
}

export function saveDemoReadingPurchase(purchase: DemoReadingPurchase) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.sessionStorage.setItem(
      getStorageKey(purchase.readingCode),
      JSON.stringify(purchase),
    );
    notifyPurchaseChanged();
    return true;
  } catch {
    return false;
  }
}

export function subscribeToDemoReadingPurchases(
  handleStoreChange: () => void,
) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(DEMO_PURCHASE_CHANGED_EVENT, handleStoreChange);
  window.addEventListener("focus", handleStoreChange);
  window.addEventListener("storage", handleStoreChange);

  return () => {
    window.removeEventListener(DEMO_PURCHASE_CHANGED_EVENT, handleStoreChange);
    window.removeEventListener("focus", handleStoreChange);
    window.removeEventListener("storage", handleStoreChange);
  };
}

export function clearDemoReadingPurchases() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const keysToRemove: string[] = [];

    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);

      if (key?.startsWith(`${DEMO_PURCHASE_STORAGE_KEY_PREFIX}:`)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => window.sessionStorage.removeItem(key));
    notifyPurchaseChanged();
    return true;
  } catch {
    return false;
  }
}
