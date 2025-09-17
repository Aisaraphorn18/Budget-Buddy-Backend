/* eslint-disable no-unused-vars */

/**
 * Simple Supabase Mock
 * Minimal mock implementation for testing purposes
 */

export interface MockResponse {
  data: any;
  error: any;
}

export class SimpleSupabaseMock {
  private mockResponses: Map<string, MockResponse> = new Map();

  // Mock table operations
  from(table: string) {
    return {
      select: (_columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () =>
            this.getMockResponse(`${table}_select_single`, {
              data: this.getDefaultSingleData(table, value),
              error: null,
            }),
          then: (resolve: any) =>
            resolve(
              this.getMockResponse(`${table}_select_eq`, {
                data: this.getDefaultListData(table),
                error: null,
              })
            ),
        }),
        order: (_column: string, _options: any) => ({
          then: (resolve: any) =>
            resolve(
              this.getMockResponse(`${table}_select_all`, {
                data: this.getDefaultListData(table),
                error: null,
              })
            ),
        }),
        then: (resolve: any) =>
          resolve(
            this.getMockResponse(`${table}_select_all`, {
              data: this.getDefaultListData(table),
              error: null,
            })
          ),
      }),

      insert: (data: any[]) => ({
        select: () => ({
          single: () => ({
            then: (resolve: any) =>
              resolve(
                this.getMockResponse(`${table}_insert`, {
                  data: { ...data[0], id: 1 },
                  error: null,
                })
              ),
          }),
        }),
      }),

      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => ({
              then: (resolve: any) =>
                resolve(
                  this.getMockResponse(`${table}_update`, {
                    data: { ...data, id: value },
                    error: null,
                  })
                ),
            }),
          }),
        }),
      }),

      delete: () => ({
        eq: (_column: string, _value: any) => ({
          then: (resolve: any) =>
            resolve(
              this.getMockResponse(`${table}_delete`, {
                data: null,
                error: null,
              })
            ),
        }),
      }),
    };
  }

  private getMockResponse(key: string, defaultResponse: MockResponse): MockResponse {
    return this.mockResponses.get(key) || defaultResponse;
  }

  private getDefaultSingleData(table: string, id?: any) {
    switch (table) {
      case 'Category':
        return {
          category_id: id || 1,
          category_name: 'Test Category',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        };
      default:
        return null;
    }
  }

  private getDefaultListData(table: string) {
    switch (table) {
      case 'Category':
        return [
          {
            category_id: 1,
            category_name: 'Food',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          {
            category_id: 2,
            category_name: 'Transport',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ];
      case 'Transaction':
        return [];
      case 'Budget':
        return [];
      default:
        return [];
    }
  }

  // Helper methods for testing
  setMockResponse(key: string, response: MockResponse) {
    this.mockResponses.set(key, response);
  }

  clearMockResponses() {
    this.mockResponses.clear();
  }
}

export const mockSupabase = new SimpleSupabaseMock();
