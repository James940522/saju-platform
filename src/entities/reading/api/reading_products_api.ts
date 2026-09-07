import { requestApi, type ApiResponse } from "@/shared/api";

import type { ReadingContent } from "../model/reading_content";
import type {
  GetReadingProductDataDto,
  GetReadingProductsDataDto,
  ReadingProductDto,
} from "./reading_product_dto";

export type GetReadingProductsData = {
  products: ReadingContent[];
};

export type GetReadingProductData = {
  product: ReadingContent;
};

function toReadingContent(product: ReadingProductDto): ReadingContent {
  return {
    id: product.id,
    code: product.code,
    title: product.title,
    description: product.description,
    theme: product.theme,
    subjectRequirement: product.subjectRequirement,
    availability: product.availability,
    pricing: product.pricing,
    resultType: product.resultType,
    highlights: [...product.highlights],
  };
}

export async function getReadingProducts(): Promise<
  ApiResponse<GetReadingProductsData>
> {
  const response = await requestApi<GetReadingProductsDataDto>({
    method: "GET",
    url: "/v1/reading-products",
  });

  return {
    ...response,
    data: {
      products: response.data.products.map(toReadingContent),
    },
  };
}

export async function getReadingProduct(
  productCode: string,
): Promise<ApiResponse<GetReadingProductData>> {
  const response = await requestApi<GetReadingProductDataDto>({
    method: "GET",
    url: `/v1/reading-products/${encodeURIComponent(productCode)}`,
  });

  return {
    ...response,
    data: {
      product: toReadingContent(response.data.product),
    },
  };
}
