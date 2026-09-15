export { apiClient, requestApi } from "./api_client";
export { API_BASE_URL } from "./config/api_config";
export {
  activateDemo,
  DEMO_FALLBACK_ENABLED,
  DEMO_USER_ID,
  isDemoActive,
  readDemoStorage,
  subscribeToDemo,
  writeDemoStorage,
} from "./lib/demo_fallback";
export {
  ApiClientError,
  isApiClientError,
  isApiErrorResponse,
} from "./lib/api_client_error";
export type {
  ApiErrorData,
  ApiErrorResponse,
  ApiFieldErrors,
  ApiResponse,
} from "./model/api_response";
