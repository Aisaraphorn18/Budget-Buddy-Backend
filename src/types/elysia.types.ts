/**
 * Elysia Framework Types
 * Type definitions for ElysiaJS context and request/response objects
 */

export interface ElysiaContext {
  body: unknown;
  query: Record<string, string | string[]>;
  params: Record<string, string>;
  headers: Record<string, string | string[]>;
  set: {
    status?: number;
    headers?: Record<string, string>;
  };
  bearer?: string;
  /* eslint-disable no-unused-vars */
  jwt?: {
    sign: (payload: Record<string, unknown>) => Promise<string>;
    verify: (token: string) => Promise<Record<string, unknown> | false>;
  };
  /* eslint-enable no-unused-vars */
  user?: {
    user_id: number;
    username: string;
    email?: string;
    role?: string;
  };
}

export interface AuthContext extends ElysiaContext {
  user: {
    user_id: number;
    username: string;
    email?: string;
    role?: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export interface FilterQuery extends PaginationQuery {
  sort?: string;
  order?: 'asc' | 'desc';
}
