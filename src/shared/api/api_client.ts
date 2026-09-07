import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import { API_BASE_URL, API_TIMEOUT_MS } from "./config/api_config";
import {
  ApiClientError,
  isApiErrorResponse,
} from "./lib/api_client_error";
import type { ApiResponse } from "./model/api_response";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiResponse<TData>(value: unknown): value is ApiResponse<TData> {
  return (
    isRecord(value) &&
    typeof value.code === "number" &&
    Number.isInteger(value.code) &&
    typeof value.message === "string" &&
    value.message.length > 0 &&
    "data" in value
  );
}

function getRequestId(response?: AxiosResponse<unknown>) {
  const value = response?.headers["x-request-id"];

  return typeof value === "string" ? value : undefined;
}

function normalizeApiError(error: unknown) {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    return new ApiClientError({
      code: null,
      message: "예상하지 못한 오류가 발생했습니다.",
      data: { reason: "UNEXPECTED_CLIENT_ERROR" },
    });
  }

  const axiosError: AxiosError<unknown> = error;
  const responseData = axiosError.response?.data;

  if (isApiErrorResponse(responseData)) {
    return new ApiClientError({
      code: responseData.code,
      message: responseData.message,
      data: responseData.data,
      requestId: getRequestId(axiosError.response),
    });
  }

  const isTimeout =
    axiosError.code === AxiosError.ETIMEDOUT ||
    axiosError.code === AxiosError.ECONNABORTED;

  if (axiosError.response) {
    return new ApiClientError({
      code: axiosError.response.status,
      message: "서버 응답 형식이 올바르지 않습니다.",
      data: { reason: "INVALID_API_RESPONSE" },
      requestId: getRequestId(axiosError.response),
    });
  }

  return new ApiClientError({
    code: null,
    message: isTimeout
      ? "요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요."
      : "서버와 통신하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    data: { reason: isTimeout ? "REQUEST_TIMEOUT" : "NETWORK_ERROR" },
  });
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);

export async function requestApi<TData, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
): Promise<ApiResponse<TData>> {
  const response = await apiClient.request<unknown, AxiosResponse<unknown>, TBody>(
    config,
  );

  if (!isApiResponse<TData>(response.data) || response.data.code !== response.status) {
    throw new ApiClientError({
      code: response.status,
      message: "서버 응답 형식이 올바르지 않습니다.",
      data: { reason: "INVALID_API_RESPONSE" },
      requestId: getRequestId(response),
    });
  }

  return response.data;
}
