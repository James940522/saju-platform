import { queryOptions } from "@tanstack/react-query";

import {
  getReadingProduct,
  getReadingProducts,
} from "./reading_products_api";

const PRODUCT_STALE_TIME_MS = 5 * 60 * 1_000;
const PRODUCT_GC_TIME_MS = 30 * 60 * 1_000;

export const readingProductKeys = {
  all: ["reading-products"] as const,
  list: () => ["reading-products", "list"] as const,
  detail: (productCode: string) =>
    ["reading-products", "detail", productCode] as const,
};

export const readingProductQueries = {
  list: () =>
    queryOptions({
      queryKey: readingProductKeys.list(),
      queryFn: ({ signal }) => getReadingProducts({ signal }),
      staleTime: PRODUCT_STALE_TIME_MS,
      gcTime: PRODUCT_GC_TIME_MS,
    }),
  detail: (productCode: string) =>
    queryOptions({
      queryKey: readingProductKeys.detail(productCode),
      queryFn: ({ signal }) => getReadingProduct(productCode, { signal }),
      staleTime: PRODUCT_STALE_TIME_MS,
      gcTime: PRODUCT_GC_TIME_MS,
    }),
};
