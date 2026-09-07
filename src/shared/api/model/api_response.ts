export type ApiResponse<TData> = {
  code: number;
  message: string;
  data: TData;
};

export type ApiFieldErrors = Record<string, string[]>;

export type ApiErrorData = {
  reason: string;
  fieldErrors?: ApiFieldErrors;
};

export type ApiErrorResponse = {
  code: number;
  message: string;
  data: ApiErrorData | null;
};
