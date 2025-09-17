/**
 * Elysia Framework Types
 * Type definitions for ElysiaJS context and request/response objects
 */

// Base context that matches ElysiaJS actual context structure
export interface ElysiaContext {
  body: unknown;
  query: Record<string, string | string[]>;
  params: Record<string, string>;
  headers: Record<string, string | undefined>;
  cookie?: Record<string, unknown>;
  server?: unknown;
  /* eslint-disable no-unused-vars */
  redirect?: (url: string, status?: 301 | 302 | 303 | 307 | 308) => Response;
  /* eslint-enable no-unused-vars */
  path?: string;
  request?: Request;
  store?: Record<string, unknown>;
  set: {
    status?: number | string;
    headers?: unknown;
    cookie?: unknown;
  };
  // JWT and Bearer token properties (from plugins)
  bearer?: string;
  /* eslint-disable no-unused-vars */
  jwt?: {
    sign: (payload: Record<string, unknown>) => Promise<string>;
    verify: (token: string) => Promise<Record<string, unknown> | false>;
  };
  /* eslint-enable no-unused-vars */
  // Allow additional properties for extensibility
  [key: string]: unknown;
}

export interface AuthContext extends ElysiaContext {
  user: {
    user_id: number;
    username: string;
    email?: string;
    role?: string;
  };
}

// Type-safe helper functions
export function isAuthContext(context: unknown): context is AuthContext {
  return (
    context !== null &&
    typeof context === 'object' &&
    'user' in context &&
    (context as Record<string, unknown>).user != null
  );
}

export function withAuth(context: unknown): AuthContext {
  if (isAuthContext(context)) {
    return context;
  }
  // In authenticated routes, user should be added by middleware
  // This is a fallback that should not happen in production
  return {
    ...(context as Record<string, unknown>),
    user: {
      user_id: 0,
      username: 'unknown',
    },
  } as AuthContext;
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
