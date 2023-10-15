// interfaces.ts

export interface Movie {
  id: number;
  name: string;
  category: string;
  duration: number; 
  price: number; 
}

export interface NewMovie {
  name: string;
  category: string;
  duration: number;
  price: number;
}

export interface ApiError {
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface QueryParams {
  page?: number;
  perPage?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}
