import {
  environmentManager,
  QueryClient,
} from "@tanstack/react-query";

const DEFAULT_STALE_TIME_MS = 60 * 1_000;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: DEFAULT_STALE_TIME_MS,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    return createQueryClient();
  }

  browserQueryClient ??= createQueryClient();

  return browserQueryClient;
}
