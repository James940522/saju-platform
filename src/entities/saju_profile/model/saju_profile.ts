export type SajuGender = "male" | "female";

export type SajuCalendarType = "solar" | "lunar";

export type SajuBirthDate = {
  year: number;
  month: number;
  day: number;
};

export type SajuBirthTime =
  | {
      type: "known";
      hour: number;
      minute: number;
    }
  | {
      type: "unknown";
    };

export type SajuProfileDraft = {
  displayName: string;
  gender: SajuGender;
  calendarType: SajuCalendarType;
  isLeapMonth: boolean;
  birthDate: SajuBirthDate;
  birthTime: SajuBirthTime;
  birthRegion?: string;
};

export type SajuProfileSlot = "default" | "partner";
