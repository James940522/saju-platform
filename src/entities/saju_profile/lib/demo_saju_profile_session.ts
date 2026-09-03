import type {
  SajuBirthDate,
  SajuBirthTime,
  SajuProfileDraft,
  SajuProfileSlot,
} from "../model/saju_profile";

const DEMO_PROFILE_STORAGE_KEY_PREFIX = "saju-profile:demo-profile:v1";
const LEGACY_PROFILE_READY_STORAGE_KEY_PREFIX = "saju-profile:mock-ready";
const DEMO_PROFILE_CHANGE_EVENT = "saju-profile:demo-profile-change";

function getStorageKey(slot: SajuProfileSlot) {
  return `${DEMO_PROFILE_STORAGE_KEY_PREFIX}:${slot}`;
}

function getLegacyStorageKey(slot: SajuProfileSlot) {
  return `${LEGACY_PROFILE_READY_STORAGE_KEY_PREFIX}:${slot}`;
}

function isDemoProfileStorageKey(key: string | null) {
  return (
    key === getStorageKey("default") || key === getStorageKey("partner")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIntegerInRange(
  value: unknown,
  minimum: number,
  maximum: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= minimum &&
    value <= maximum
  );
}

function parseBirthDate(
  value: unknown,
  calendarType: SajuProfileDraft["calendarType"],
): SajuBirthDate | null {
  if (
    !isRecord(value) ||
    !isIntegerInRange(value.year, 1900, new Date().getFullYear()) ||
    !isIntegerInRange(value.month, 1, 12)
  ) {
    return null;
  }

  const maximumDay = calendarType === "lunar" ? 30 : 31;

  if (!isIntegerInRange(value.day, 1, maximumDay)) {
    return null;
  }

  const birthDate = {
    year: value.year,
    month: value.month,
    day: value.day,
  };

  if (calendarType === "lunar") {
    return birthDate;
  }

  const date = new Date(
    Date.UTC(birthDate.year, birthDate.month - 1, birthDate.day),
  );
  const today = new Date();
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  if (
    date.getUTCFullYear() !== birthDate.year ||
    date.getUTCMonth() !== birthDate.month - 1 ||
    date.getUTCDate() !== birthDate.day ||
    date.getTime() > todayUtc
  ) {
    return null;
  }

  return birthDate;
}

function parseBirthTime(value: unknown): SajuBirthTime | null {
  if (!isRecord(value)) {
    return null;
  }

  if (value.type === "unknown") {
    return { type: "unknown" };
  }

  if (
    value.type !== "known" ||
    !isIntegerInRange(value.hour, 0, 23) ||
    !isIntegerInRange(value.minute, 0, 59)
  ) {
    return null;
  }

  return {
    type: "known",
    hour: value.hour,
    minute: value.minute,
  };
}

function parseProfile(value: unknown): SajuProfileDraft | null {
  if (
    !isRecord(value) ||
    typeof value.displayName !== "string" ||
    !value.displayName.trim() ||
    value.displayName.length > 30 ||
    (value.gender !== "male" && value.gender !== "female") ||
    (value.calendarType !== "solar" && value.calendarType !== "lunar") ||
    typeof value.isLeapMonth !== "boolean" ||
    (value.calendarType === "solar" && value.isLeapMonth)
  ) {
    return null;
  }

  const birthDate = parseBirthDate(value.birthDate, value.calendarType);
  const birthTime = parseBirthTime(value.birthTime);

  if (!birthDate || !birthTime) {
    return null;
  }

  if (
    value.birthRegion !== undefined &&
    (typeof value.birthRegion !== "string" || !value.birthRegion.trim())
  ) {
    return null;
  }

  return {
    displayName: value.displayName,
    gender: value.gender,
    calendarType: value.calendarType,
    isLeapMonth: value.isLeapMonth,
    birthDate,
    birthTime,
    ...(typeof value.birthRegion === "string"
      ? { birthRegion: value.birthRegion }
      : {}),
  };
}

function dispatchDemoProfileChange() {
  window.dispatchEvent(new Event(DEMO_PROFILE_CHANGE_EVENT));
}

export function parseDemoSajuProfileSnapshot(snapshot: string) {
  try {
    const parsedSnapshot: unknown = JSON.parse(snapshot);

    return parseProfile(parsedSnapshot);
  } catch {
    return null;
  }
}

export function getDemoSajuProfileSnapshot(slot: SajuProfileSlot) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage.getItem(getStorageKey(slot));
  } catch {
    return null;
  }
}

export function getDemoSajuProfile(slot: SajuProfileSlot) {
  const snapshot = getDemoSajuProfileSnapshot(slot);

  return snapshot ? parseDemoSajuProfileSnapshot(snapshot) : null;
}

export function saveDemoSajuProfile(
  slot: SajuProfileSlot,
  profile: SajuProfileDraft,
) {
  if (typeof window === "undefined" || !parseProfile(profile)) {
    return false;
  }

  try {
    window.sessionStorage.setItem(getStorageKey(slot), JSON.stringify(profile));
    window.sessionStorage.removeItem(getLegacyStorageKey(slot));
    dispatchDemoProfileChange();
    return true;
  } catch {
    return false;
  }
}

export function subscribeToDemoSajuProfiles(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleProfileChange = () => listener();
  const handleStorage = (event: StorageEvent) => {
    if (isDemoProfileStorageKey(event.key)) {
      listener();
    }
  };

  window.addEventListener(DEMO_PROFILE_CHANGE_EVENT, handleProfileChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(DEMO_PROFILE_CHANGE_EVENT, handleProfileChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function clearDemoSajuProfiles() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.sessionStorage.removeItem(getStorageKey("default"));
    window.sessionStorage.removeItem(getStorageKey("partner"));
    window.sessionStorage.removeItem(getLegacyStorageKey("default"));
    window.sessionStorage.removeItem(getLegacyStorageKey("partner"));
    dispatchDemoProfileChange();
    return true;
  } catch {
    return false;
  }
}
