"use client";

import { useState } from "react";

import {
  getReadingProducts,
  type ReadingProductSummary,
} from "@/entities/reading";
import {
  API_BASE_URL,
  isApiClientError,
} from "@/shared/api";

const readingThemes = new Set([
  "self",
  "relationship",
  "fortune",
  "wealth",
  "career",
  "question",
]);
const readingAvailability = new Set(["active", "coming_soon", "hidden"]);
const readingPricingTypes = new Set(["free", "paid", "pending"]);
type TestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; productCount: number }
  | { status: "contract-error" }
  | { status: "request-error"; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPricing(value: unknown): boolean {
  if (!isRecord(value) || !readingPricingTypes.has(String(value.type))) {
    return false;
  }

  if (value.type === "paid") {
    return (
      typeof value.amount === "number" &&
      Number.isInteger(value.amount) &&
      value.amount >= 0 &&
      value.currency === "KRW" &&
      Object.keys(value).length === 3
    );
  }

  if (value.type === "free") {
    return Object.keys(value).length === 1;
  }

  const allowedKeys = new Set(["type", "expectedAmount", "currency"]);

  return (
    Object.keys(value).every((key) => allowedKeys.has(key)) &&
    (!("expectedAmount" in value) ||
      (typeof value.expectedAmount === "number" &&
        Number.isInteger(value.expectedAmount) &&
        value.expectedAmount >= 0)) &&
    (!("currency" in value) || value.currency === "KRW")
  );
}

function isReadingProductSummary(
  value: unknown,
): value is ReadingProductSummary {
  return (
    isRecord(value) &&
    Object.keys(value).length === 7 &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.code === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.code) &&
    typeof value.title === "string" &&
    value.title.length > 0 &&
    typeof value.description === "string" &&
    value.description.length > 0 &&
    readingThemes.has(String(value.theme)) &&
    readingAvailability.has(String(value.availability)) &&
    isPricing(value.pricing)
  );
}

function isReadingProductsData(
  value: unknown,
): value is { products: ReadingProductSummary[] } {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Object.keys(value).length === 1 &&
    Array.isArray(value.products) &&
    value.products.every(isReadingProductSummary)
  );
}

export function ReadingProductsApiDebug() {
  const [testState, setTestState] = useState<TestState>({ status: "idle" });

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const runTest = async () => {
    setTestState({ status: "loading" });
    console.groupCollapsed("[API 통신 테스트] GET /v1/reading-products");
    console.info("요청", {
      method: "GET",
      url: `${API_BASE_URL}/v1/reading-products`,
    });

    try {
      const data = await getReadingProducts();
      const contractMatched = isReadingProductsData(data);

      console.info("변환된 도메인 데이터", data);
      console.info("계약 검사", {
        contractMatched,
        expectedType: "{ products: ReadingProductSummary[] }",
        productCount: data.products.length,
      });

      setTestState(
        contractMatched
          ? {
              status: "success",
              productCount: data.products.length,
            }
          : { status: "contract-error" },
      );
    } catch (error) {
      const message = isApiClientError(error)
        ? `${error.code} ${error.message}`
        : error instanceof Error
          ? error.message
          : "알 수 없는 오류";

      console.error("요청 실패", error);
      setTestState({ status: "request-error", message });
    } finally {
      console.groupEnd();
    }
  };

  const resultMessage = (() => {
    switch (testState.status) {
      case "loading":
        return "요청 중...";
      case "success":
        return `통신 성공 · ${testState.productCount}개 상품 · 계약 일치`;
      case "contract-error":
        return "통신은 성공했지만 응답 계약이 일치하지 않습니다.";
      case "request-error":
        return `요청 실패 · ${testState.message}`;
      default:
        return "아래 목록은 자동 호출됩니다. 이 버튼은 응답 계약을 수동으로 다시 점검합니다.";
    }
  })();

  return (
    <aside className="mt-6 rounded-2xl border border-dashed border-border bg-surface px-4 py-4 text-sm text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">API 통신 점검</p>
          <p className="mt-1">{resultMessage}</p>
        </div>
        <button
          type="button"
          onClick={runTest}
          disabled={testState.status === "loading"}
          className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-wait disabled:opacity-60"
        >
          {testState.status === "loading" ? "테스트 중" : "API 수동 재호출"}
        </button>
      </div>
    </aside>
  );
}
