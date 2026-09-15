import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { webcrypto } from "node:crypto";
import axios from "axios";
import ts from "typescript";

const require = createRequire(import.meta.url);
const sourceRoot = new URL("../src/", import.meta.url).pathname;
const plain = (value) => JSON.parse(JSON.stringify(value));

function setup({ mode = "true", storage = new Map(), apiUrl = "https://api.example.test", brokenStorage = false } = {}) {
  const modules = new Map();
  const window = { sessionStorage: {
    getItem(key) { if (brokenStorage) throw new Error("Blocked"); return storage.get(key) ?? null; },
    setItem(key, value) { if (brokenStorage) throw new Error("Blocked"); storage.set(key, value); },
  } };
  function load(path) {
    const filename = resolve(sourceRoot, path + (path.endsWith(".ts") ? "" : ".ts"));
    if (modules.has(filename)) return modules.get(filename);
    const exports = {};
    modules.set(filename, exports);
    const code = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    runInNewContext(code, {
      exports, window, crypto: webcrypto, structuredClone, DOMException,
      process: { env: { NODE_ENV: "production", NEXT_PUBLIC_DEMO_FALLBACK: mode, NEXT_PUBLIC_API_BASE_URL: apiUrl } },
      require(name) {
        // Replace only browser auth and UI barrels; domain/API code stays real.
        if (name === "@/shared/supabase/browser_client") return { getBrowserSupabaseClient() { throw new Error("No auth configured"); } };
        if (name === "@/entities/saju_chart") return load("entities/saju_chart/model/demo_saju_profiles");
        if (name === "@/entities/wealth_ranking") return load("entities/wealth_ranking/model/demo_wealth_ranking");
        if (name === "@/shared/api") return load("shared/api/index");
        if (name.startsWith("@/")) return load(name.slice(2));
        if (name.startsWith(".")) return load(resolve(dirname(filename), name));
        return require(name);
      },
    });
    return exports;
  }
  const api = load("shared/api/index");
  let requests = 0;
  api.apiClient.defaults.adapter = async () => {
    requests += 1;
    throw new axios.AxiosError("Offline", "ERR_NETWORK");
  };
  return { load, api, storage, requests: () => requests };
}

test("an unavailable backend opens catalog, auth, profiles, chart, ranking and history without further requests", async () => {
  const app = setup();
  const products = app.load("entities/reading/api/reading_products_api");
  const catalog = await products.getReadingProducts();
  assert.equal(catalog.products.length, 6);
  assert.equal(catalog.products.find((item) => item.code === "wealth-ranking").availability, "active");
  assert.equal(app.api.isDemoActive(), true);
  assert.equal((await products.getReadingProduct("wealth-ranking")).product.subjectRequirement.max, 5);
  const auth = app.load("entities/auth/lib/auth_session");
  auth.subscribeToAuth(() => {});
  assert.equal(auth.getAuthenticatedUserId(), app.api.DEMO_USER_ID);
  const user = await app.load("entities/user/api/users_api").getCurrentUser();
  assert.equal(user.user.status, "active");
  const profilesApi = app.load("entities/saju_chart/api/saju_profiles_api");
  const { profiles } = await profilesApi.getSajuProfiles();
  assert.equal(profiles.length, 3);
  const detail = await profilesApi.getSajuProfile(profiles[0].id);
  const chartMapper = app.load("entities/saju_chart/lib/to_manseoryeok_view_model");
  const chart = chartMapper.toManseoryeokViewModel(detail.chart.snapshot);
  assert.equal(chart.pillars.length, 4);
  assert.equal(chart.elementDistribution.items.reduce((total, item) => total + item.count, 0), 8);
  const preview = await app.load("entities/saju_chart/api/saju_chart_preview_api").previewSajuChart({ birth: profiles[0].birth });
  assert.equal(preview.status, "calculated");
  assert.equal(preview.snapshot.calculation.policyVersion, "demo-preview-v1");
  const jobsApi = app.load("entities/reading_job/api/reading_jobs_api");
  assert.equal((await jobsApi.getReadingJobs()).jobs.length, 2);
  const ids = profiles.map((profile) => profile.currentChartId);
  const job = await jobsApi.createReadingJob(ids, "ranking-replay");
  const result = await jobsApi.getReadingResult(job.id);
  const mapper = app.load("entities/wealth_ranking/lib/to_wealth_ranking_result");
  assert.equal(mapper.toPublicWealthRankingResult(result.result).ranking.length, 3);
  assert.equal((await jobsApi.createReadingJob(ids, "ranking-replay")).id, job.id);
  assert.equal((await jobsApi.getReadingJobs()).jobs.length, 3);
  assert.equal(app.requests(), 1);
  await assert.rejects(app.load("entities/user/api/users_api").withdrawCurrentUser(), /실제 계정을 변경/);
  assert.equal(app.requests(), 1);
  // A new page load in the same tab restores the created result without a POST.
  const reload = setup({ storage: app.storage });
  assert.equal((await reload.load("entities/reading_job/api/reading_jobs_api").getReadingResult(job.id)).status, "succeeded");
  assert.equal(reload.requests(), 0);
});

test("profile create, rename, birth edit and delete survive reload; five selected names appear in ranking", async () => {
  const app = setup({ mode: "always" });
  const profilesApi = app.load("entities/saju_chart/api/saju_profiles_api");
  const original = (await profilesApi.getSajuProfiles()).profiles[0];
  const request = { displayName: "새 참여자", relationType: "other", birth: original.birth };
  const added = await profilesApi.createSajuProfile(request, "save-once");
  assert.equal((await profilesApi.createSajuProfile(request, "save-once")).profile.id, added.profile.id);
  const renamed = await profilesApi.updateSajuProfile(added.profile.id, { displayName: "수정한 이름" });
  assert.equal(renamed.chart.id, added.chart.id);
  const changed = await profilesApi.updateSajuProfile(added.profile.id, { birth: { ...request.birth, time: { precision: "unknown" } } });
  assert.notEqual(changed.chart.id, renamed.chart.id);
  await profilesApi.createSajuProfile({ ...request, displayName: "다섯째" }, "fifth");
  const profiles = (await profilesApi.getSajuProfiles()).profiles;
  const ranking = await app.load("entities/wealth_ranking/api/wealth_ranking_api").createWealthRanking(profiles.map((profile) => profile.currentChartId));
  assert.equal(ranking.ranking.length, 5);
  assert.equal(ranking.ranking[3].displayName, "수정한 이름");
  const reload = setup({ storage: app.storage });
  const reloadedApi = reload.load("entities/saju_chart/api/saju_profiles_api");
  assert.equal((await reloadedApi.getSajuProfile(added.profile.id)).profile.displayName, "수정한 이름");
  const deletion = await reloadedApi.deleteSajuProfile(original.id);
  assert.ok(deletion.primarySajuProfileId);
  await assert.rejects(reloadedApi.getSajuProfile(original.id));
  assert.equal(app.requests(), 0);
});

for (const code of [400, 401, 403, 404, 429]) {
  test(`valid API ${code} errors preserve the real error and do not enable preview`, async () => {
    const app = setup();
    app.api.apiClient.defaults.adapter = async (config) => {
      throw new axios.AxiosError("API error", "ERR_BAD_REQUEST", config, null, {
        status: code, headers: {}, config, statusText: "Error",
        data: { code, message: "Real error", data: { reason: "REAL_ERROR" } },
      });
    };
    await assert.rejects(app.api.requestApi({ method: "GET", url: "/v1/example" }, () => "demo"), (error) => error.code === code);
    assert.equal(app.api.isDemoActive(), false);
  });
}

test("healthy APIs return actual data and use a bounded preview probe timeout", async () => {
  const app = setup();
  app.api.apiClient.defaults.adapter = async (config) => {
    assert.equal(config.timeout, 3000);
    return { status: 200, statusText: "OK", headers: {}, config, data: { code: 200, message: "OK", data: "live" } };
  };
  assert.equal((await app.api.requestApi({ method: "GET", url: "/v1/example" }, () => "demo")).data, "live");
  assert.equal(app.api.isDemoActive(), false);
});

test("disabled fallback and cancelled requests never fabricate success", async () => {
  const disabled = setup({ mode: "false" });
  await assert.rejects(disabled.load("entities/reading/api/reading_products_api").getReadingProducts());
  assert.equal(disabled.api.isDemoActive(), false);
  const app = setup();
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(app.api.requestApi({ signal: controller.signal }, () => "demo"), { name: "AbortError" });
  assert.equal(app.api.isDemoActive(), false);
  assert.equal(app.requests(), 0);
});

test("production without API configuration and blocked storage still show preview", async () => {
  const app = setup({ apiUrl: "", brokenStorage: true });
  const profilesApi = app.load("entities/saju_chart/api/saju_profiles_api");
  const original = (await profilesApi.getSajuProfiles()).profiles[0];
  const added = await profilesApi.createSajuProfile({ displayName: "예시", relationType: "friend", birth: original.birth });
  assert.equal((await profilesApi.getSajuProfile(added.profile.id)).profile.displayName, "예시");
  assert.equal(app.requests(), 0);
  assert.deepEqual(plain((await profilesApi.getSajuProfiles()).profiles).length, 4);
});

test("protected-page entry resolves preview auth before any login redirect", async () => {
  const app = setup();
  const auth = app.load("entities/auth/lib/auth_session");
  await new Promise((resolve) => {
    auth.subscribeToAuth(() => {
      if (auth.getAuthenticatedUserId() !== undefined) resolve();
    });
  });
  assert.equal(auth.getAuthenticatedUserId(), app.api.DEMO_USER_ID);
  assert.equal(app.requests(), 1);
});

for (const kind of ["timeout", "server-error", "hosting-html"]) {
  test(`${kind} enables preview`, async () => {
    const app = setup();
    app.api.apiClient.defaults.adapter = async (config) => {
      if (kind === "timeout") throw new axios.AxiosError("Timeout", "ECONNABORTED", config);
      const status = kind === "server-error" ? 503 : 404;
      throw new axios.AxiosError("Unavailable", "ERR_BAD_RESPONSE", config, null, {
        status, statusText: "Unavailable", headers: {}, config,
        data: kind === "server-error" ? { code: 503, message: "Unavailable", data: null } : "<html>Not deployed</html>",
      });
    };
    assert.equal((await app.api.requestApi({ method: "GET" }, () => "preview")).data, "preview");
    assert.equal(app.api.isDemoActive(), true);
  });
}

test("aborting an in-flight read preserves cancellation and the live session", async () => {
  const app = setup();
  const controller = new AbortController();
  app.api.apiClient.defaults.adapter = async () => {
    controller.abort();
    throw new axios.AxiosError("Offline", "ERR_NETWORK");
  };
  await assert.rejects(app.api.requestApi({ signal: controller.signal }, () => "preview"), { name: "AbortError" });
  assert.equal(app.api.isDemoActive(), false);
});
