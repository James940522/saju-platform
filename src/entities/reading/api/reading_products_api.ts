import { requestApi } from "@/shared/api";
import { readingCatalog } from "../model/reading_catalog";

import type {
  ReadingContent,
  ReadingProductSummary,
} from "../model/reading_content";
import type {
  GetReadingProductDataDto,
  GetReadingProductsDataDto,
  ReadingProductDto,
  ReadingProductSummaryDto,
} from "./reading_product_dto";

export type GetReadingProductsData = {
  products: ReadingProductSummary[];
};

export type GetReadingProductData = {
  product: ReadingContent;
};

type ReadingProductRequestOptions = {
  signal?: AbortSignal;
};

function getDemoProducts(): ReadingProductDto[] {
  return readingCatalog.filter((product) => product.availability !== "hidden")
    .map((product) => ({
      ...product,
      availability: product.code === "wealth-ranking" ? "active" : product.availability,
      highlights: [...product.highlights],
    }));
}

function toReadingProductSummary(
  product: ReadingProductSummaryDto,
): ReadingProductSummary {
  return {
    id: product.id,
    code: product.code,
    title: product.title,
    description: product.description,
    theme: product.theme,
    availability: product.availability,
    pricing: product.pricing,
  };
}

function toReadingContent(product: ReadingProductDto): ReadingContent {
  return {
    ...toReadingProductSummary(product),
    subjectRequirement: product.subjectRequirement,
    resultType: product.resultType,
    highlights: [...product.highlights],
  };
}

export async function getReadingProducts(
  options: ReadingProductRequestOptions = {},
): Promise<GetReadingProductsData> {
  const response = await requestApi<GetReadingProductsDataDto>({
    method: "GET",
    url: "/v1/reading-products",
    signal: options.signal,
  }, () => ({ products: getDemoProducts() }));

  return {
    products: response.data.products.map(toReadingProductSummary),
  };
}

export async function getReadingProduct(
  productCode: string,
  options: ReadingProductRequestOptions = {},
): Promise<GetReadingProductData> {
  const response = await requestApi<GetReadingProductDataDto>({
    method: "GET",
    url: `/v1/reading-products/${encodeURIComponent(productCode)}`,
    signal: options.signal,
  }, () => {
    const product = getDemoProducts().find((item) => item.code === productCode);
    if (!product) throw new Error("Unknown preview product");
    return { product };
  });

  return {
    product: toReadingContent(response.data.product),
  };
}
