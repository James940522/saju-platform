"use client";

import {
  CalendarDays,
  CircleHelp,
  LockKeyhole,
  Sparkles,
  X,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import type {
  SajuBirthDate,
  SajuGender,
  SajuProfileDraft,
} from "@/entities/saju_profile";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 101 }, (_, index) => currentYear - index);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const days = Array.from({ length: 31 }, (_, index) => index + 1);
const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = Array.from({ length: 12 }, (_, index) => index * 5);

const selectClassName =
  "h-12 min-w-0 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft disabled:bg-paper disabled:text-muted";

type ChoiceCardProps = {
  checked?: boolean;
  description?: string;
  icon?: React.ReactNode;
  label: string;
  name: string;
  onChange?: () => void;
  value: string;
};

function ChoiceCard({
  checked,
  description,
  icon,
  label,
  name,
  onChange,
  value,
}: ChoiceCardProps) {
  return (
    <label className="relative min-w-0 cursor-pointer">
      <input
        className="peer sr-only"
        checked={checked}
        name={name}
        onChange={onChange}
        required
        type="radio"
        value={value}
      />
      <span className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground peer-checked:border-accent peer-checked:bg-accent-soft/35 peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
        {icon}
        <span className="min-w-0">
          <span className="block">{label}</span>
          {description ? (
            <span className="mt-0.5 block text-[10px] font-normal text-muted">
              {description}
            </span>
          ) : null}
        </span>
      </span>
    </label>
  );
}

function FieldGroup({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <fieldset className="rounded-2xl border border-border bg-surface/45 p-3.5">
      <legend className="px-1 font-display text-[17px] font-bold text-foreground">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

type SajuProfileFormProps = {
  onSubmit: (profile: SajuProfileDraft) => void;
  submitLabel?: string;
};

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getFormInteger(formData: FormData, key: string) {
  const value = getFormString(formData, key);
  const parsedValue = Number(value);

  return value && Number.isInteger(parsedValue) ? parsedValue : undefined;
}

function isValidSolarBirthDate({ year, month, day }: SajuBirthDate) {
  const date = new Date(Date.UTC(year, month - 1, day));
  const today = new Date();
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getTime() <= todayUtc
  );
}

function isValidLunarBirthDate({ month, day }: SajuBirthDate) {
  return month >= 1 && month <= 12 && day >= 1 && day <= 30;
}

export function SajuProfileForm({
  onSubmit,
  submitLabel = "입력 완료",
}: SajuProfileFormProps) {
  const [name, setName] = useState("");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">(
    "solar",
  );
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [isUnknownBirthTime, setIsUnknownBirthTime] = useState(false);
  const [formError, setFormError] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const genderValue = getFormString(formData, "gender");
    const birthYear = getFormInteger(formData, "birthYear");
    const birthMonth = getFormInteger(formData, "birthMonth");
    const birthDay = getFormInteger(formData, "birthDay");

    if (!name.trim()) {
      setFormError("이름 또는 별명을 입력해주세요.");
      return;
    }

    if (
      (genderValue !== "male" && genderValue !== "female") ||
      birthYear === undefined ||
      birthMonth === undefined ||
      birthDay === undefined
    ) {
      setFormError("필수 정보를 모두 확인해주세요.");
      return;
    }

    const birthDate = {
      year: birthYear,
      month: birthMonth,
      day: birthDay,
    };

    const isValidDate =
      calendarType === "solar"
        ? isValidSolarBirthDate(birthDate)
        : isValidLunarBirthDate(birthDate);

    if (!isValidDate) {
      setFormError("실제로 존재하는 생년월일을 선택해주세요.");
      return;
    }

    const birthHour = getFormInteger(formData, "birthHour");
    const birthMinute = getFormInteger(formData, "birthMinute");

    if (
      !isUnknownBirthTime &&
      (birthHour === undefined || birthMinute === undefined)
    ) {
      setFormError("출생 시간을 선택하거나 모름에 체크해주세요.");
      return;
    }

    const gender: SajuGender = genderValue;
    const birthRegion = getFormString(formData, "birthRegion");
    const birthTime = isUnknownBirthTime
      ? { type: "unknown" as const }
      : birthHour !== undefined && birthMinute !== undefined
        ? { type: "known" as const, hour: birthHour, minute: birthMinute }
        : undefined;

    if (!birthTime) {
      setFormError("출생 시간을 선택하거나 모름에 체크해주세요.");
      return;
    }

    const profile: SajuProfileDraft = {
      displayName: name.trim(),
      gender,
      calendarType,
      isLeapMonth: calendarType === "lunar" && isLeapMonth,
      birthDate,
      birthTime,
      ...(birthRegion ? { birthRegion } : {}),
    };

    setFormError(undefined);
    onSubmit(profile);
  }

  return (
    <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
      <FieldGroup title="이름">
        <div className="relative">
          <input
            className="h-13 w-full rounded-xl border border-border bg-surface px-4 pr-11 text-sm text-foreground outline-none placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent-soft"
            name="name"
            maxLength={30}
            onChange={(event) => setName(event.target.value)}
            placeholder="이름 또는 별명을 입력해주세요"
            required
            type="text"
            value={name}
          />
          {name ? (
            <button
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted"
              onClick={() => setName("")}
              type="button"
              aria-label="이름 지우기"
            >
              <X size={17} />
            </button>
          ) : null}
        </div>
      </FieldGroup>

      <FieldGroup title="성별">
        <div className="grid grid-cols-2 gap-2.5">
          <ChoiceCard
            icon={<span className="text-lg text-[#315b91]">♂</span>}
            label="남성"
            name="gender"
            value="male"
          />
          <ChoiceCard
            icon={<span className="text-lg text-[#c25178]">♀</span>}
            label="여성"
            name="gender"
            value="female"
          />
        </div>
      </FieldGroup>

      <FieldGroup title="달력 선택">
        <div className="grid grid-cols-2 gap-2.5">
          <ChoiceCard
            checked={calendarType === "solar"}
            description="그레고리력"
            icon={<CalendarDays className="text-primary" size={20} />}
            label="양력"
            name="calendar"
            onChange={() => {
              setCalendarType("solar");
              setIsLeapMonth(false);
            }}
            value="solar"
          />
          <ChoiceCard
            checked={calendarType === "lunar"}
            description="음력 · 윤달 포함"
            icon={<CircleHelp className="text-[#9a7c42]" size={20} />}
            label="음력"
            name="calendar"
            onChange={() => setCalendarType("lunar")}
            value="lunar"
          />
        </div>
        <label
          className={`mt-3 flex items-center gap-2 text-xs ${
            calendarType === "lunar"
              ? "cursor-pointer text-foreground"
              : "cursor-not-allowed text-muted/60"
          }`}
        >
          <input
            checked={isLeapMonth}
            className="size-4 accent-[#1c385e]"
            disabled={calendarType !== "lunar"}
            name="isLeapMonth"
            onChange={(event) => setIsLeapMonth(event.target.checked)}
            type="checkbox"
          />
          윤달 생일이에요
        </label>
      </FieldGroup>

      <FieldGroup title="생년월일">
        <div className="grid grid-cols-3 gap-2">
          <select
            aria-label="출생 연도"
            className={selectClassName}
            defaultValue=""
            name="birthYear"
            required
          >
            <option disabled value="">
              연도
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
          <select
            aria-label="출생 월"
            className={selectClassName}
            defaultValue=""
            name="birthMonth"
            required
          >
            <option disabled value="">
              월
            </option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}월
              </option>
            ))}
          </select>
          <select
            aria-label="출생 일"
            className={selectClassName}
            defaultValue=""
            name="birthDay"
            required
          >
            <option disabled value="">
              일
            </option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}일
              </option>
            ))}
          </select>
        </div>
      </FieldGroup>

      <FieldGroup title="출생 시간">
        <div className="grid grid-cols-2 gap-2">
          <select
            aria-label="출생 시"
            className={selectClassName}
            defaultValue=""
            disabled={isUnknownBirthTime}
            name="birthHour"
            required={!isUnknownBirthTime}
          >
            <option disabled value="">
              시 선택
            </option>
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour.toString().padStart(2, "0")}시
              </option>
            ))}
          </select>
          <select
            aria-label="출생 분"
            className={selectClassName}
            defaultValue=""
            disabled={isUnknownBirthTime}
            name="birthMinute"
            required={!isUnknownBirthTime}
          >
            <option disabled value="">
              분 선택
            </option>
            {minutes.map((minute) => (
              <option key={minute} value={minute}>
                {minute.toString().padStart(2, "0")}분
              </option>
            ))}
          </select>
        </div>
        <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-foreground">
          <input
            checked={isUnknownBirthTime}
            className="mt-0.5 size-4 accent-[#1c385e]"
            name="isUnknownBirthTime"
            onChange={(event) => setIsUnknownBirthTime(event.target.checked)}
            type="checkbox"
          />
          <span>
            <span className="font-semibold">출생 시간을 모르겠어요</span>
            <span className="mt-1 block text-[10px] text-muted">
              모를 경우 비워두고 진행할 수 있어요
            </span>
          </span>
        </label>
      </FieldGroup>

      <FieldGroup title="출생 지역 (선택)">
        <select
          aria-label="출생 지역"
          className={selectClassName}
          defaultValue=""
          name="birthRegion"
        >
          <option value="">도시 또는 지역을 선택해주세요</option>
          {["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "제주", "기타"].map(
            (region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ),
          )}
        </select>
        <p className="mt-2 text-[10px] leading-4 text-muted">
          보다 정확한 표준시 계산을 위해 선택을 권장해요.
        </p>
      </FieldGroup>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-paper text-[#8f7137]">
          <LockKeyhole size={19} strokeWidth={1.7} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-foreground">
            현재 탭에만 임시 저장해요
          </p>
          <p className="mt-1 text-[10px] leading-4 text-muted">
            입력 정보는 서버로 전송하지 않고 현재 탭의 데모 세션에만 저장해요.
          </p>
        </div>
      </div>

      <button
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-accent bg-primary font-display text-[19px] font-bold text-[#f1cf78]"
        type="submit"
      >
        <Sparkles size={19} />
        {submitLabel}
      </button>
      {formError ? (
        <p className="text-center text-xs font-semibold text-[#a24646]" role="alert">
          {formError}
        </p>
      ) : null}
    </form>
  );
}
