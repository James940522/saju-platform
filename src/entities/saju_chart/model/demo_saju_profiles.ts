import { ApiClientError } from "@/shared/api";
import { readDemoStorage, writeDemoStorage } from "@/shared/api";
import type { CreateSajuProfileRequestDto, SajuProfileSummaryDto, UpdateSajuProfileRequestDto } from "../api/saju_chart_dto";
import { DEMO_CHART_SNAPSHOT } from "./demo_chart_snapshot";

const CREATED_AT = "2026-09-15T00:00:00.000Z";
const STORAGE_KEY = "profiles";

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProfile(value: unknown): value is SajuProfileSummaryDto {
  if (!record(value) || !record(value.birth)) return false;
  const { birth } = value;
  return typeof value.id === "string" && typeof value.displayName === "string" &&
    ["self", "partner", "family", "friend", "other"].includes(String(value.relationType)) &&
    typeof value.isPrimary === "boolean" && typeof value.currentChartId === "string" &&
    typeof value.createdAt === "string" && typeof value.updatedAt === "string" &&
    (birth.calendarType === "solar" || birth.calendarType === "lunar") &&
    typeof birth.isLeapMonth === "boolean" &&
    (birth.luckCycleGender === "male" || birth.luckCycleGender === "female") &&
    record(birth.date) && typeof birth.date.year === "number" &&
    typeof birth.date.month === "number" && typeof birth.date.day === "number" &&
    record(birth.time) && (birth.time.precision === "unknown" ||
      (birth.time.precision === "exact" && typeof birth.time.hour === "number" &&
        typeof birth.time.minute === "number"));
}

function initialProfiles(): SajuProfileSummaryDto[] {
  return [
    { displayName: "김하늘", relationType: "self" as const },
    { displayName: "이서연", relationType: "partner" as const },
    { displayName: "박지우", relationType: "friend" as const },
  ].map((person, index) => ({
    ...person,
    id: `de000000-0000-4000-a000-00000000000${index + 1}`,
    currentChartId: `de100000-0000-4000-a000-00000000000${index + 1}`,
    isPrimary: index === 0,
    birth: {
      calendarType: "solar",
      isLeapMonth: false,
      date: { year: 1992, month: 10, day: 24 },
      time: { precision: "exact", hour: 5, minute: 30 },
      luckCycleGender: index === 1 ? "female" : "male",
    },
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  }));
}

export function getDemoSajuProfiles() {
  const saved = readDemoStorage(STORAGE_KEY);
  const profiles = Array.isArray(saved) && saved.every(isProfile) ? saved : initialProfiles();
  return { profiles };
}

export function getDemoChartSnapshot() {
  const snapshot = structuredClone(DEMO_CHART_SNAPSHOT);
  snapshot.calculation.policyVersion = "demo-preview-v1";
  return snapshot;
}

export function getDemoSajuProfile(profileId: string) {
  const profile = getDemoSajuProfiles().profiles.find((item) => item.id === profileId);
  if (!profile) throw new ApiClientError({
    code: 404, message: "예시 사주를 찾을 수 없어요. 사주 목록에서 선택해주세요.",
    data: { reason: "SAJU_PROFILE_NOT_FOUND" },
  });
  return {
    profile,
    chart: { id: profile.currentChartId ?? profile.id, profileId: profile.id, snapshot: getDemoChartSnapshot() },
  };
}

export function createDemoSajuProfile(request: CreateSajuProfileRequestDto, key?: string) {
  const { profiles } = getDemoSajuProfiles();
  const previousId = key ? readDemoStorage(`profile-request:${key}`) : null;
  if (typeof previousId === "string" && profiles.some((item) => item.id === previousId))
    return getDemoSajuProfile(previousId);
  const profile: SajuProfileSummaryDto = {
    ...structuredClone(request),
    id: crypto.randomUUID(),
    currentChartId: crypto.randomUUID(),
    isPrimary: profiles.length === 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  writeDemoStorage(STORAGE_KEY, [...profiles, profile]);
  if (key) writeDemoStorage(`profile-request:${key}`, profile.id);
  return getDemoSajuProfile(profile.id);
}

export function updateDemoSajuProfile(profileId: string, request: UpdateSajuProfileRequestDto) {
  getDemoSajuProfile(profileId);
  const { profiles } = getDemoSajuProfiles();
  writeDemoStorage(STORAGE_KEY, profiles.map((profile) => profile.id === profileId ? {
    ...profile, ...request,
    currentChartId: request.birth ? crypto.randomUUID() : profile.currentChartId,
    updatedAt: new Date().toISOString(),
  } : profile));
  return getDemoSajuProfile(profileId);
}

export function deleteDemoSajuProfile(profileId: string) {
  getDemoSajuProfile(profileId);
  const profiles = getDemoSajuProfiles().profiles.filter((profile) => profile.id !== profileId);
  if (profiles.length && !profiles.some((profile) => profile.isPrimary)) profiles[0].isPrimary = true;
  writeDemoStorage(STORAGE_KEY, profiles);
  return { deletedProfileId: profileId, primarySajuProfileId: profiles.find((profile) => profile.isPrimary)?.id ?? null };
}
