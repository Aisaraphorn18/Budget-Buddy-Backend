/**
 * Test Utilities
 *
 * Common utilities and helpers for testing.
 * Includes JWT token generation, test contexts, and common assertions.
 */

import { expect } from 'bun:test';

// Test JWT secret (different from production)
export const TEST_JWT_SECRET = 'test-jwt-secret-key';

// Generate test JWT token
export function generateTestToken(payload: any = { user_id: 1, username: 'testuser' }) {
  // Simple mock token for testing (not real JWT)
  return `mock-token-${JSON.stringify(payload)}`;
}

// Mock Elysia context for testing
export function createMockContext(
  options: {
    body?: any;
    params?: any;
    query?: any;
    headers?: any;
    bearer?: string;
  } = {}
) {
  return {
    body: options.body || {},
    params: options.params || {},
    query: options.query || {},
    headers: options.headers || {},
    bearer: options.bearer || null,
    set: {
      status: 200,
      headers: {},
    },
    jwt: {
      verify: async (token: string) => {
        try {
          // Mock JWT verification for testing
          if (token.startsWith('mock-token-')) {
            const payload = JSON.parse(token.replace('mock-token-', ''));
            return payload;
          }
          throw new Error('Invalid token format');
        } catch {
          throw new Error('Invalid token');
        }
      },
    },
  };
}

// Assert response structure
export function assertApiResponse(response: any) {
  expect(response).toBeDefined();
  expect(typeof response).toBe('object');
  expect(response).toHaveProperty('success');
  expect(response).toHaveProperty('message');
  expect(response).toHaveProperty('data');
  expect(typeof response.success).toBe('boolean');
  expect(typeof response.message).toBe('string');
}

// Assert success response
export function assertSuccessResponse(response: any, expectedData?: any) {
  assertApiResponse(response);
  expect(response.success).toBe(true);
  if (expectedData !== undefined) {
    expect(response.data).toEqual(expectedData);
  }
}

// Assert error response
export function assertErrorResponse(response: any, expectedMessage?: string) {
  assertApiResponse(response);
  expect(response.success).toBe(false);
  expect(response.data).toBeNull();
  if (expectedMessage) {
    expect(response.message).toContain(expectedMessage);
  }
}

// Test data factories
export const TestDataFactory = {
  createCategory: (overrides: Partial<any> = {}) => ({
    category_id: 1,
    category_name: 'Test Category',
    ...overrides,
  }),

  createTransaction: (overrides: Partial<any> = {}) => ({
    transaction_id: 1,
    user_id: 1,
    category_id: 1,
    type: 'expense',
    amount: 25.5,
    note: 'Test transaction',
    created_at: '2024-01-15T10:30:00Z',
    ...overrides,
  }),

  createBudget: (overrides: Partial<any> = {}) => ({
    budget_id: 1,
    user_id: 1,
    category_id: 1,
    budget_amount: 500.0,
    cycle_month: '2024-01',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    ...overrides,
  }),

  createUser: (overrides: Partial<any> = {}) => ({
    user_id: 1,
    username: 'testuser',
    first_name: 'Test',
    last_name: 'User',
    created_date: '2024-01-01T00:00:00Z',
    ...overrides,
  }),
};

// Database error scenarios
export const DatabaseErrors = {
  NETWORK_ERROR: new Error('Network error'),
  TIMEOUT_ERROR: new Error('Database timeout'),
  CONSTRAINT_ERROR: new Error('duplicate key value violates unique constraint'),
  NOT_FOUND_ERROR: new Error('No rows returned'),
  FOREIGN_KEY_ERROR: new Error('violates foreign key constraint'),
};
