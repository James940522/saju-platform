"use client";

import { Bookmark, Check } from "lucide-react";
import { useState } from "react";

export function SaveResultButton() {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <button
      className="flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground"
      onClick={() => setIsSaved((currentValue) => !currentValue)}
      type="button"
      aria-pressed={isSaved}
    >
      {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
      {isSaved ? "저장됨" : "결과 저장하기"}
    </button>
  );
}
