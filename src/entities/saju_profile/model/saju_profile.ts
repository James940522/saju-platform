export type SajuGender = "male" | "female";

export type SajuCalendarType = "solar" | "lunar";

export type SajuRelationType =
  | "self"
  | "family"
  | "friend"
  | "partner"
  | "other";

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
  relationType: SajuRelationType;
  gender: SajuGender;
  calendarType: SajuCalendarType;
  isLeapMonth: boolean;
  birthDate: SajuBirthDate;
  birthTime: SajuBirthTime;
};

export type SajuProfileSlot = "default" | "partner";
