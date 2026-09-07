import type {
  ApiErrorData,
  ApiErrorResponse,
  ApiFieldErrors,
} from "../model/api_response";

type ApiClientErrorOptions = {
  code: number | null;
  message: string;
  data: ApiErrorData | null;
  requestId?: string;
};

export class ApiClientError extends Error {
  readonly code: number | null;
  readonly data: ApiErrorData | null;
  readonly requestId?: string;

  constructor({ code, message, data, requestId }: ApiClientErrorOptions) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.data = data;
    this.requestId = requestId;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiFieldErrors(value: unknown): value is ApiFieldErrors {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(
    (messages) =>
      Array.isArray(messages) &&
      messages.every((message) => typeof message === "string"),
  );
}

function isApiErrorData(value: unknown): value is ApiErrorData {
  if (!isRecord(value) || typeof value.reason !== "string") {
    return false;
  }

  return (
    value.fieldErrors === undefined || isApiFieldErrors(value.fieldErrors)
  );
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.code === "number" &&
    Number.isInteger(value.code) &&
    value.code >= 400 &&
    value.code <= 599 &&
    typeof value.message === "string" &&
    value.message.length > 0 &&
    (value.data === null || isApiErrorData(value.data))
  );
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}
