export interface ErrorDetails {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: ErrorDetails | null;
}









