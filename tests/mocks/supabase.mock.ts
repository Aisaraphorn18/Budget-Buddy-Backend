/**
 * Supabase Mock Client
 * 
 * Mock implementation of Supabase client for testing purposes.
 * Prevents actual database operations during tests and allows
 * controlled responses for different test scenarios.
 */

export interface MockSupabaseResponse<T = any> {
  data: T | null;
  error: any;
}

export class MockSupabaseQueryBuilder {
  private mockData: any = null;
  private mockError: any = null;
  private shouldThrow: boolean = false;

  constructor(data?: any, error?: any, shouldThrow?: boolean) {
    this.mockData = data;
    this.mockError = error;
    this.shouldThrow = shouldThrow || false;
  }

  select(columns: string = '*') {
    return this;
  }

  eq(column: string, value: any) {
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    return this;
  }

  single() {
    return this;
  }

  insert(data: any) {
    return this;
  }

  update(data: any) {
    return this;
  }

  delete() {
    return this;
  }

  // Simulate async operations
  async then(): Promise<MockSupabaseResponse> {
    if (this.shouldThrow) {
      throw new Error('Mock error');
    }
    
    return {
      data: this.mockData,
      error: this.mockError
    };
  }
}

export class MockSupabaseClient {
  private responses: Map<string, { data: any; error: any; shouldThrow?: boolean }> = new Map();

  from(table: string) {
    const response = this.responses.get(table) || { data: null, error: null };
    return new MockSupabaseQueryBuilder(response.data, response.error, response.shouldThrow);
  }

  // Helper methods to set up mock responses
  mockSelect(table: string, data: any, error: any = null) {
    this.responses.set(table, { data, error });
  }

  mockInsert(table: string, data: any, error: any = null) {
    this.responses.set(table, { data, error });
  }

  mockUpdate(table: string, data: any, error: any = null) {
    this.responses.set(table, { data, error });
  }

  mockDelete(table: string, error: any = null) {
    this.responses.set(table, { data: null, error });
  }

  mockError(table: string, error: any) {
    this.responses.set(table, { data: null, error, shouldThrow: true });
  }

  reset() {
    this.responses.clear();
  }
}

// Global mock instance
export const mockSupabase = new MockSupabaseClient();

// Mock data templates
export const mockCategoryData = {
  category_id: 1,
  category_name: "Test Category"
};

export const mockCategoriesData = [
  { category_id: 1, category_name: "Food & Dining" },
  { category_id: 2, category_name: "Transportation" },
  { category_id: 3, category_name: "Entertainment" }
];

export const mockTransactionData = {
  transaction_id: 1,
  user_id: 1,
  category_id: 1,
  type: "expense",
  amount: 25.50,
  note: "Test transaction",
  created_at: "2024-01-15T10:30:00Z"
};

export const mockBudgetData = {
  budget_id: 1,
  user_id: 1,
  category_id: 1,
  budget_amount: 500.00,
  cycle_month: "2024-01",
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-15T10:30:00Z"
};

export const mockUserData = {
  user_id: 1,
  username: "testuser",
  first_name: "Test",
  last_name: "User",
  created_date: "2024-01-01T00:00:00Z"
};