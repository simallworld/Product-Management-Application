// Export all types from a single location
export * from './auth';
export * from './todo';
export * from './product';

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  error?: string;
}

// Generic loading state
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}