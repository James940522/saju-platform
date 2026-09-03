type SajuProfileRouteOptions = {
  intent?: string;
  role?: "default" | "partner";
};

type LoginRouteOptions = SajuProfileRouteOptions & {
  target?: "profile";
};

function createLoginRoute(options: LoginRouteOptions = {}) {
  const searchParams = new URLSearchParams();

  if (options.target) {
    searchParams.set("target", options.target);
  }

  if (options.intent) {
    searchParams.set("intent", options.intent);
  }

  if (options.role) {
    searchParams.set("role", options.role);
  }

  const query = searchParams.toString();

  return query ? `/login?${query}` : "/login";
}

function createSajuProfileRoute(options: SajuProfileRouteOptions = {}) {
  const searchParams = new URLSearchParams();

  if (options.intent) {
    searchParams.set("intent", options.intent);
  }

  if (options.role) {
    searchParams.set("role", options.role);
  }

  const query = searchParams.toString();

  return query ? `/profiles/new?${query}` : "/profiles/new";
}

export const routes = {
  home: "/",
  readings: "/readings",
  fortune: "/fortune",
  mySaju: "/my-saju",
  login: createLoginRoute,
  reading: (readingCode: string) => `/readings/${readingCode}`,
  readingStart: (readingCode: string) => `/readings/${readingCode}/start`,
  readingCheckout: (readingCode: string) =>
    `/readings/${readingCode}/checkout`,
  profileNew: createSajuProfileRoute,
  result: (resultId: string) => `/results/${resultId}`,
} as const;
