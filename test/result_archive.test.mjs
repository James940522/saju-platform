import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(path, dependencies = {}, globals = {}) {
  const code = ts.transpileModule(readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2021, esModuleInterop: true },
  }).outputText;
  const exports = {};
  runInNewContext(code, {
    URLSearchParams, ...globals, exports,
    require(name) {
      if (name in dependencies) return dependencies[name];
      if (name.startsWith("@/") || name.startsWith(".")) throw new Error(`Unmocked dependency: ${name}`);
      return require(name);
    },
  });
  return exports;
}
const catalog = load("entities/reading/model/reading_catalog.ts");
const jobs = load("entities/reading_job/model/reading_job.ts");
const config = load("shared/config/routes.ts");
const model = load("domains/result_archive/model/result_archive.ts", {
  "@/entities/reading": catalog,
  "@/entities/reading_job": jobs,
  "@/shared/config": config,
});
const job = (id, createdAt = "2026-09-14T00:00:00Z") => ({
  id, createdAt, productCode: "wealth-ranking", participantNames: ["가", "나"],
  status: "succeeded", stage: "finished",
});

test("archive deduplicates overlapping pages using fresh state and sorts by request date", () => {
  const results = model.toArchivedResults([
    job("latest"), job("older", "2026-09-12T00:00:00Z"),
    { ...job("latest"), status: "running", stage: "interpreting" },
  ], "2026-09-13T00:00:00Z");
  assert.equal(results.length, 3);
  assert.equal(results[0].id, "latest");
  assert.equal(results[0].status, "succeeded");
  assert.equal(results[1].isDemo, true);
  assert.equal(results[2].id, "older");
  assert.equal(results[0].href, "/readings/jobs/latest");
});
test("product filters separate real and demo results and retain historical products", () => {
  const results = model.toArchivedResults([job("id")], "2026-09-13T00:00:00Z");
  assert.equal(model.filterArchivedResults(results, "all").length, 2);
  assert.equal(model.filterArchivedResults(results, "wealth-ranking")[0].isDemo, false);
  assert.equal(model.filterArchivedResults(results, "past-life-relationship")[0].isDemo, true);
  assert.equal(model.filterArchivedResults(results, "daily-fortune").length, 0);
  assert.ok(model.getArchiveProducts([{ ...results[0], productCode: "couple-compatibility" }]).some((item) => item.code === "couple-compatibility"));
});
test("dates use the Korean calendar date at UTC midnight boundaries", () => {
  assert.equal(model.formatArchiveDate("2026-09-13T16:00:00Z"), "2026.09.14");
});

test("demo save survives reload, stays per account and can be removed", () => {
  const storage = new Map();
  const events = [];
  const globals = {
    window: {
      sessionStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
      dispatchEvent: (event) => events.push(event.type),
    },
    Event: class { constructor(type) { this.type = type; } },
  };
  const createStore = () => load("entities/saved_result/model/demo_saved_result.ts", {}, globals);
  const store = createStore();
  assert.equal(store.getSavedDemoResult("first"), null);
  assert.equal(store.setDemoResultSaved("first", true), true);
  const savedAt = store.getSavedDemoResult("first");
  assert.ok(savedAt);
  assert.equal(createStore().getSavedDemoResult("first"), savedAt);
  assert.equal(store.getSavedDemoResult("second"), null);
  store.setDemoResultSaved("first", true);
  assert.equal(store.getSavedDemoResult("first"), savedAt);
  assert.equal(store.setDemoResultSaved("first", false), true);
  assert.equal(createStore().getSavedDemoResult("first"), null);
  assert.equal(events.length, 3);
});
test("blocked or corrupt browser storage never reports a successful save", () => {
  const store = load("entities/saved_result/model/demo_saved_result.ts", {}, {
    window: { sessionStorage: { getItem: () => "invalid", setItem: () => { throw new Error("blocked"); }, removeItem: () => { throw new Error("blocked"); } } },
  });
  assert.equal(store.getSavedDemoResult("id"), null);
  assert.equal(store.setDemoResultSaved("id", true), false);
  assert.equal(store.setDemoResultSaved("id", false), false);
});

const { ArchiveView } = load("domains/result_archive/ui/result_archive_list.tsx", {
  "next/link": { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) },
  "@/entities/auth": {}, "@/entities/reading_job": {}, "@/entities/saved_result": {},
  "@/shared/config": config, "../model/result_archive": model,
});
const render = (props) => renderToStaticMarkup(React.createElement(ArchiveView, { results: [], ...props }));
test("archive distinguishes auth, loading, empty and failed states with retry and older-page access", () => {
  assert.match(render({ isGuest: true }), /login\?next=%2Fresults/);
  assert.doesNotMatch(render({ isLoading: true }), /아직 보관한 결과가 없어요/);
  assert.match(render({}), /아직 보관한 결과가 없어요/);
  assert.match(render({ hasError: true }), /다시 불러오기/);
  assert.doesNotMatch(render({ hasError: true }), /아직 보관한 결과가 없어요/);
  assert.match(render({ hasNextPage: true }), /이전 결과 더 보기/);
  assert.match(render({ hasNextPage: true }), /불러온 내역에 해당 결과가 없어요/);
});
test("cards retain completed, pending and failed jobs with accessible result links", () => {
  const results = model.toArchivedResults([
    job("done"),
    { ...job("pending"), status: "running", stage: "interpreting" },
    { ...job("failed"), status: "failed" },
  ], null);
  const html = render({ results });
  assert.match(html, /3개/);
  assert.match(html, /최근 결과/);
  assert.match(html, /재물운을 풀이하고 있어요/);
  assert.match(html, /풀이를 완료하지 못했어요/);
  for (const id of ["done", "pending", "failed"]) assert.ok(html.includes(`/readings/jobs/${id}`));
});
