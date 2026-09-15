import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
// Render real components with network/auth/navigation boundaries replaced.
// No application mock route, live account, browser secret or AI call is needed.
function load(relativePath, dependencies = {}) {
  const code = ts.transpileModule(
    readFileSync(new URL(`../src/${relativePath}`, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    },
  ).outputText;
  const exports = {};
  runInNewContext(code, {
    exports,
    require: (name) => {
      if (name in dependencies) return dependencies[name];
      if (name.startsWith("@/") || name.startsWith("."))
        throw new Error(`Unmocked dependency: ${name}`);
      return require(name);
    },
  });
  return exports;
}
const model = load("entities/reading_job/model/reading_job.ts");
const wealthModel = load("entities/wealth_ranking/model/wealth_ranking.ts");
const wealthMapper = load(
  "entities/wealth_ranking/lib/to_wealth_ranking_result.ts",
  { "../model/wealth_ranking": wealthModel },
);
const { WealthRankingResult } = load(
  "widgets/wealth_ranking_result/ui/wealth_ranking_result.tsx",
  {
    "@/features/share_reading_result": load(
      "features/share_reading_result/ui/share_reading_result_button.tsx",
      {
        "@/shared/config": load("shared/config/routes.ts"),
        "@/shared/api": { isDemoActive: () => false, subscribeToDemo: () => () => {} },
      },
    ),
  },
);
const job = {
  id: "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa",
  productCode: "wealth-ranking",
  status: "running",
  stage: "interpreting",
};
const result = {
  ranking: [1, 2].map((rank) => ({
    rank,
    displayName: `참여자${rank}`,
    fortune: "소비 계획을 세우면 재물 관리에 도움이 돼요.",
  })),
  comparisonTitle: "기회를 넓히는 감각과 돈을 지키는 습관",
  rationale:
    "참여자1님은 기회를 활용하고 참여자2님은 지출을 차분히 관리하면 좋아요.",
  notice: "참고용 풀이예요.",
};
const routes = {
  readingJob: (id) => `/readings/jobs/${id}`,
  readingStart: (code) => `/readings/${code}/start`,
  readings: "/readings",
};
let user = "signed-in-user";
let query;
const boundaries = {
  "@tanstack/react-query": { useQuery: () => query },
  "next/link": {
    __esModule: true,
    default: ({ children, ...props }) =>
      React.createElement("a", props, children),
  },
  "@/shared/config": { routes },
  "@/entities/reading_job": {
    ...model,
    getReadingJobs: () => {},
    getReadingResult: () => {},
    readingJobKeys: {
      active: (id) => [id, "active"],
      result: (id) => ["public", id],
    },
  },
};
const { ReadingStartGate } = load(
  "widgets/reading_jobs/ui/reading_start_gate.tsx",
  {
    ...boundaries,
    "@/entities/auth": {
      getAuthenticatedUserId: () => user,
      getAuthServerSnapshot: () => user,
      subscribeToAuth: () => () => {},
    },
  },
);
const { ReadingJobPage } = load("domains/reading_job/ui/reading_job_page.tsx", {
  ...boundaries,
  "next/navigation": { useRouter: () => ({ push: () => {} }) },
  "@/entities/wealth_ranking": wealthMapper,
  "@/widgets/wealth_ranking_result": { WealthRankingResult },
  "@/shared/api": { isApiClientError: () => false },
});
const renderGate = () =>
  renderToStaticMarkup(
    React.createElement(
      ReadingStartGate,
      null,
      React.createElement("button", null, "풀이 시작하기"),
    ),
  );

test("revisit hides new start until fresh server state arrives, even with an empty cache", () => {
  user = "signed-in-user";
  query = { data: { jobs: [] }, isFetchedAfterMount: false, isPending: false };
  assert.match(renderGate(), /진행 중인 풀이를 확인하고 있어요/);
  assert.doesNotMatch(renderGate(), /풀이 시작하기/);
  query = { ...query, isFetchedAfterMount: true };
  assert.match(renderGate(), /풀이 시작하기/);
});
test("queued/running revisit resumes the existing UUID and completion restores start", () => {
  for (const status of ["queued", "running"]) {
    query = {
      data: {
        jobs: [
          {
            ...job,
            status,
            stage: status === "queued" ? "queued" : "interpreting",
          },
        ],
      },
      isFetchedAfterMount: true,
    };
    const html = renderGate();
    assert.match(html, /재물운 풀이가 진행 중이에요/);
    assert.ok(html.includes(routes.readingJob(job.id)));
    assert.doesNotMatch(html, /풀이 시작하기/);
  }
  query = {
    data: { jobs: [{ ...job, status: "succeeded", stage: "finished" }] },
    isFetchedAfterMount: true,
  };
  assert.match(renderGate(), /풀이 시작하기/);
});
test("lookup failures cannot silently offer a new request", () => {
  query = { isError: true, isFetchedAfterMount: true, refetch: () => {} };
  assert.match(renderGate(), /진행 중인 풀이를 확인하지 못했어요/);
  assert.doesNotMatch(renderGate(), /풀이 시작하기/);
});
test("auth resolution shows checking; guests can proceed to the authenticated start flow", () => {
  user = undefined;
  assert.doesNotMatch(renderGate(), /풀이 시작하기/);
  user = null;
  assert.match(renderGate(), /풀이 시작하기/);
});
test("public result page renders without auth dependencies, raw chart data or restart action", () => {
  query = {
    data: {
      ...job,
      status: "succeeded",
      stage: "finished",
      result,
      error: null,
    },
  };
  const html = renderToStaticMarkup(
    React.createElement(ReadingJobPage, { jobId: job.id }),
  );
  assert.match(html, /풀이가 완료되었어요/);
  assert.match(html, /참여자1/);
  assert.match(html, /기회를 넓히는 감각과 돈을 지키는 습관/);
  assert.match(html, /참여자1님은/);
  assert.match(html, /참여자2님은/);
  assert.doesNotMatch(html, /랭킹 산출 근거|이렇게 비교했어요|1위 참여자/);
  assert.doesNotMatch(
    html,
    /다시 해보기|로그인이 필요|출생시간|생년월일|요청 번호/,
  );
  assert.match(html, /참여자 변경/);
  assert.match(html, /결과 링크 공유/);
});
test("result widget ignores legacy per-person calculation details", () => {
  const value = {
    ...result,
    ranking: result.ranking.map((entry) => ({
      ...entry,
      isPartial: true,
      chartId: "private-id",
      calculationNotes: ["1992년 10월 24일 05:30"],
    })),
  };
  const html = renderToStaticMarkup(
    React.createElement(WealthRankingResult, {
      result: value,
      onEdit: () => {},
    }),
  );
  assert.doesNotMatch(html, /private-id|1992|05:30|출생시간|다시 해보기/);
});

test("participant text is rendered literally, never interpreted as HTML", () => {
  const html = renderToStaticMarkup(
    React.createElement(WealthRankingResult, {
      result: {
        ...result,
        rationale: "<b>정재민</b>님은 꾸준한 습관을 길러보세요.",
      },
      onEdit: () => {},
    }),
  );
  assert.ok(html.includes("&lt;b&gt;정재민&lt;/b&gt;님은"));
  assert.ok(!html.includes("<b>정재민</b>"));
});
