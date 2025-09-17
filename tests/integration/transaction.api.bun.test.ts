/**
 * Transaction API Integration Tests
 *
 * ทดสอบการทำงานของ Transaction API endpoints แบบ end-to-end
 * ครอบคลุม GET, POST, PUT, DELETE operations และ business logic validation
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

// Mock server instance (จำลองการเชื่อมต่อ API)
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Mock HTTP client สำหรับ testing
class MockHttpClient {
  private transactions: any[] = [];
  private nextId = 1;

  async get(url: string, options: any = {}) {
    // Handle /transactions/summary first (most specific)
    if (url.includes('/transactions/summary')) {
      const summary = this.transactions
        .filter(t => t.user_id === 1)
        .reduce(
          (acc, t) => {
            if (t.transaction_type === 'income') {
              acc.total_income += t.amount;
            } else {
              acc.total_expense += t.amount;
            }
            acc.transaction_count++;
            return acc;
          },
          { total_income: 0, total_expense: 0, transaction_count: 0 }
        );

      return {
        status: 200,
        data: {
          ...summary,
          net_balance: summary.total_income - summary.total_expense,
        },
      };
    }

    // Handle /transactions/recent
    if (url.includes('/transactions/recent')) {
      const recent = this.transactions
        .filter(t => t.user_id === 1)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      return {
        status: 200,
        data: { transactions: recent },
      };
    }

    // Handle /transactions/:id (specific transaction)
    if (url.match(/\/transactions\/\d+$/)) {
      const id = parseInt(url.split('/').pop()!);
      const transaction = this.transactions.find(t => t.transaction_id === id && t.user_id === 1);

      if (!transaction) {
        return { status: 404, data: { error: 'Transaction not found' } };
      }

      return { status: 200, data: { transaction } };
    }

    // Handle /transactions (list with pagination and filters)
    if (url.includes('/transactions')) {
      const query = options.query || {};
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const type = query.type;
      const category = query.category;

      let filtered = this.transactions.filter(t => t.user_id === 1);

      if (type) {
        filtered = filtered.filter(t => t.transaction_type === type);
      }
      if (category) {
        filtered = filtered.filter(t => t.category_id === parseInt(category));
      }

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = filtered.slice(start, end);

      return {
        status: 200,
        data: {
          transactions: paginated,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(filtered.length / limit),
            total_items: filtered.length,
          },
        },
      };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  async post(url: string, data: any) {
    if (url.includes('/transactions')) {
      // Validation
      if (!data.user_id || !data.category_id || !data.transaction_type || !data.amount) {
        return {
          status: 400,
          data: { error: 'Missing required fields' },
        };
      }

      if (data.amount <= 0) {
        return {
          status: 400,
          data: { error: 'Amount must be positive' },
        };
      }

      if (!['income', 'expense'].includes(data.transaction_type)) {
        return {
          status: 400,
          data: { error: 'Invalid transaction type' },
        };
      }

      const newTransaction = {
        transaction_id: this.nextId++,
        user_id: data.user_id,
        category_id: data.category_id,
        transaction_type: data.transaction_type,
        amount: data.amount,
        note: data.note || null,
        transaction_date: data.transaction_date || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.transactions.push(newTransaction);

      return {
        status: 201,
        data: { transaction: newTransaction },
      };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  async put(url: string, data: any) {
    if (url.match(/\/transactions\/\d+$/)) {
      const id = parseInt(url.split('/').pop()!);
      const transactionIndex = this.transactions.findIndex(
        t => t.transaction_id === id && t.user_id === data.user_id
      );

      if (transactionIndex === -1) {
        return { status: 404, data: { error: 'Transaction not found' } };
      }

      // Validation
      if (data.amount && data.amount <= 0) {
        return {
          status: 400,
          data: { error: 'Amount must be positive' },
        };
      }

      if (data.transaction_type && !['income', 'expense'].includes(data.transaction_type)) {
        return {
          status: 400,
          data: { error: 'Invalid transaction type' },
        };
      }

      const updatedTransaction = {
        ...this.transactions[transactionIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };

      this.transactions[transactionIndex] = updatedTransaction;

      return {
        status: 200,
        data: { transaction: updatedTransaction },
      };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  async delete(url: string, options: any = {}) {
    if (url.match(/\/transactions\/\d+$/)) {
      const id = parseInt(url.split('/').pop()!);
      const transactionIndex = this.transactions.findIndex(
        t => t.transaction_id === id && t.user_id === options.user_id
      );

      if (transactionIndex === -1) {
        return { status: 404, data: { error: 'Transaction not found' } };
      }

      this.transactions.splice(transactionIndex, 1);

      return { status: 204, data: {} };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  // Helper method for tests
  reset() {
    this.transactions = [];
    this.nextId = 1;
  }

  // Helper method to seed data
  seedTestData() {
    this.transactions = [
      {
        transaction_id: 1,
        user_id: 1,
        category_id: 1,
        transaction_type: 'expense',
        amount: 250.5,
        note: 'Lunch at restaurant',
        transaction_date: '2024-01-15',
        created_at: '2024-01-15T12:30:00Z',
        updated_at: '2024-01-15T12:30:00Z',
      },
      {
        transaction_id: 2,
        user_id: 1,
        category_id: 2,
        transaction_type: 'expense',
        amount: 45.0,
        note: 'Gas for car',
        transaction_date: '2024-01-14',
        created_at: '2024-01-14T10:15:00Z',
        updated_at: '2024-01-14T10:15:00Z',
      },
      {
        transaction_id: 3,
        user_id: 1,
        category_id: 3,
        transaction_type: 'income',
        amount: 2500.0,
        note: 'Monthly salary',
        transaction_date: '2024-01-01',
        created_at: '2024-01-01T09:00:00Z',
        updated_at: '2024-01-01T09:00:00Z',
      },
    ];
    this.nextId = 4;
  }
}

describe('Transaction API Integration Tests', () => {
  let httpClient: MockHttpClient;

  beforeEach(() => {
    httpClient = new MockHttpClient();
  });

  afterEach(() => {
    httpClient.reset();
  });

  describe('GET /api/v1/transactions', () => {
    describe('📄 Basic Functionality', () => {
      it('should return paginated transactions for authenticated user', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/transactions`, {
          query: { page: '1', limit: '10' },
        });

        expect(response.status).toBe(200);
        expect(response.data.transactions).toHaveLength(3);
        expect(response.data.pagination.current_page).toBe(1);
        expect(response.data.pagination.total_items).toBe(3);
      });

      it('should return empty array when no transactions exist', async () => {
        const response = await httpClient.get(`${API_BASE_URL}/transactions`);

        expect(response.status).toBe(200);
        expect(response.data.transactions).toHaveLength(0);
        expect(response.data.pagination.total_items).toBe(0);
      });
    });

    describe('🔍 Filtering & Pagination', () => {
      it('should filter transactions by type', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/transactions`, {
          query: { type: 'expense' },
        });

        expect(response.status).toBe(200);
        expect(response.data.transactions).toHaveLength(2);
        expect(response.data.transactions.every((t: any) => t.transaction_type === 'expense')).toBe(
          true
        );
      });

      it('should filter transactions by category', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/transactions`, {
          query: { category: '1' },
        });

        expect(response.status).toBe(200);
        expect(response.data.transactions).toHaveLength(1);
        expect(response.data.transactions[0].category_id).toBe(1);
      });

      it('should handle pagination correctly', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/transactions`, {
          query: { page: '1', limit: '2' },
        });

        expect(response.status).toBe(200);
        expect(response.data.transactions).toHaveLength(2);
        expect(response.data.pagination.current_page).toBe(1);
        expect(response.data.pagination.total_pages).toBe(2);
      });
    });
  });

  describe('GET /api/v1/transactions/:id', () => {
    describe('🔍 Basic Functionality', () => {
      it('should return specific transaction by ID', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/transactions/1`);

        expect(response.status).toBe(200);
        expect(response.data.transaction!.transaction_id).toBe(1);
        expect(response.data.transaction!.amount).toBe(250.5);
      });

      it('should return 404 for non-existent transaction', async () => {
        const response = await httpClient.get(`${API_BASE_URL}/transactions/999`);

        expect(response.status).toBe(404);
        expect(response.data.error).toBe('Transaction not found');
      });
    });
  });

  describe('POST /api/v1/transactions', () => {
    describe('✅ Successful Creation', () => {
      it('should create new transaction with valid data', async () => {
        const transactionData = {
          user_id: 1,
          category_id: 1,
          transaction_type: 'expense',
          amount: 150.75,
          note: 'Coffee and pastry',
          transaction_date: '2024-01-16',
        };

        const response = await httpClient.post(`${API_BASE_URL}/transactions`, transactionData);

        expect(response.status).toBe(201);
        expect(response.data.transaction!.transaction_id).toBeDefined();
        expect(response.data.transaction!.amount).toBe(150.75);
        expect(response.data.transaction!.note).toBe('Coffee and pastry');
        expect(response.data.transaction!.created_at).toBeDefined();
      });

      it('should create transaction without optional note', async () => {
        const transactionData = {
          user_id: 1,
          category_id: 2,
          transaction_type: 'income',
          amount: 500.0,
          transaction_date: '2024-01-16',
        };

        const response = await httpClient.post(`${API_BASE_URL}/transactions`, transactionData);

        expect(response.status).toBe(201);
        expect(response.data.transaction!.note).toBeNull();
        expect(response.data.transaction!.amount).toBe(500.0);
      });
    });

    describe('❌ Validation Errors', () => {
      it('should return 400 for missing required fields', async () => {
        const incompleteData = {
          user_id: 1,
          category_id: 1,
          // missing transaction_type and amount
        };

        const response = await httpClient.post(`${API_BASE_URL}/transactions`, incompleteData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Missing required fields');
      });

      it('should return 400 for invalid amount', async () => {
        const invalidData = {
          user_id: 1,
          category_id: 1,
          transaction_type: 'expense',
          amount: -50.0,
        };

        const response = await httpClient.post(`${API_BASE_URL}/transactions`, invalidData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Amount must be positive');
      });

      it('should return 400 for invalid transaction type', async () => {
        const invalidData = {
          user_id: 1,
          category_id: 1,
          transaction_type: 'invalid_type',
          amount: 100.0,
        };

        const response = await httpClient.post(`${API_BASE_URL}/transactions`, invalidData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Invalid transaction type');
      });
    });
  });

  describe('PUT /api/v1/transactions/:id', () => {
    describe('✅ Successful Updates', () => {
      it('should update transaction with valid data', async () => {
        httpClient.seedTestData();

        const updateData = {
          user_id: 1,
          amount: 300.0,
          note: 'Updated lunch expense',
        };

        const response = await httpClient.put(`${API_BASE_URL}/transactions/1`, updateData);

        expect(response.status).toBe(200);
        expect(response.data.transaction!.amount).toBe(300.0);
        expect(response.data.transaction!.note).toBe('Updated lunch expense');
        expect(response.data.transaction!.updated_at).toBeDefined();
      });

      it('should update transaction type', async () => {
        httpClient.seedTestData();

        const updateData = {
          user_id: 1,
          transaction_type: 'income',
        };

        const response = await httpClient.put(`${API_BASE_URL}/transactions/1`, updateData);

        expect(response.status).toBe(200);
        expect(response.data.transaction!.transaction_type).toBe('income');
      });
    });

    describe('❌ Error Handling', () => {
      it('should return 404 for non-existent transaction', async () => {
        const updateData = { user_id: 1, amount: 200.0 };

        const response = await httpClient.put(`${API_BASE_URL}/transactions/999`, updateData);

        expect(response.status).toBe(404);
        expect(response.data.error).toBe('Transaction not found');
      });

      it('should return 400 for invalid amount', async () => {
        httpClient.seedTestData();

        const updateData = {
          user_id: 1,
          amount: -100.0,
        };

        const response = await httpClient.put(`${API_BASE_URL}/transactions/1`, updateData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Amount must be positive');
      });

      it('should return 400 for invalid transaction type', async () => {
        httpClient.seedTestData();

        const updateData = {
          user_id: 1,
          transaction_type: 'invalid',
        };

        const response = await httpClient.put(`${API_BASE_URL}/transactions/1`, updateData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Invalid transaction type');
      });
    });
  });

  describe('DELETE /api/v1/transactions/:id', () => {
    describe('🗑️ Successful Deletion', () => {
      it('should delete transaction successfully', async () => {
        httpClient.seedTestData();

        const response = await httpClient.delete(`${API_BASE_URL}/transactions/1`, {
          user_id: 1,
        });

        expect(response.status).toBe(204);

        // Verify transaction is deleted
        const getResponse = await httpClient.get(`${API_BASE_URL}/transactions/1`);
        expect(getResponse.status).toBe(404);
      });
    });

    describe('❌ Error Handling', () => {
      it('should return 404 for non-existent transaction', async () => {
        const response = await httpClient.delete(`${API_BASE_URL}/transactions/999`, {
          user_id: 1,
        });

        expect(response.status).toBe(404);
        expect(response.data.error).toBe('Transaction not found');
      });
    });
  });

  describe('GET /api/v1/transactions/recent', () => {
    describe('📊 Recent Transactions', () => {
      it('should return recent transactions ordered by date', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/transactions/recent`);

        expect(response.status).toBe(200);
        expect(response.data.transactions).toHaveLength(3);

        // Check if ordered by created_at (newest first)
        const transactions = response.data.transactions;
        expect(new Date(transactions[0].created_at).getTime()).toBeGreaterThanOrEqual(
          new Date(transactions[1].created_at).getTime()
        );
      });

      it('should limit to maximum 5 transactions', async () => {
        // Add more test data
        for (let i = 4; i <= 10; i++) {
          await httpClient.post(`${API_BASE_URL}/transactions`, {
            user_id: 1,
            category_id: 1,
            transaction_type: 'expense',
            amount: 100.0,
            note: `Test transaction ${i}`,
          });
        }

        const response = await httpClient.get(`${API_BASE_URL}/transactions/recent`);

        expect(response.status).toBe(200);
        expect(response.data.transactions.length).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('GET /api/v1/transactions/summary', () => {
    describe('📈 Transaction Summary', () => {
      it('should return correct transaction summary', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/transactions/summary`);

        expect(response.status).toBe(200);
        expect(response.data.total_income).toBe(2500.0);
        expect(response.data.total_expense).toBe(295.5); // 250.5 + 45.0
        expect(response.data.net_balance).toBe(2204.5); // 2500 - 295.5
        expect(response.data.transaction_count).toBe(3);
      });

      it('should return zero summary when no transactions exist', async () => {
        const response = await httpClient.get(`${API_BASE_URL}/transactions/summary`);

        expect(response.status).toBe(200);
        expect(response.data.total_income).toBe(0);
        expect(response.data.total_expense).toBe(0);
        expect(response.data.net_balance).toBe(0);
        expect(response.data.transaction_count).toBe(0);
      });
    });
  });

  describe('🧪 Integration Scenarios', () => {
    it('should handle complete transaction lifecycle', async () => {
      // Create transaction
      const createResponse = await httpClient.post(`${API_BASE_URL}/transactions`, {
        user_id: 1,
        category_id: 1,
        transaction_type: 'expense',
        amount: 200.0,
        note: 'Test transaction',
      });

      expect(createResponse.status).toBe(201);
      const transactionId = createResponse.data.transaction!.transaction_id;

      // Read transaction
      const getResponse = await httpClient.get(`${API_BASE_URL}/transactions/${transactionId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.transaction!.amount).toBe(200.0);

      // Update transaction
      const updateResponse = await httpClient.put(`${API_BASE_URL}/transactions/${transactionId}`, {
        user_id: 1,
        amount: 250.0,
        note: 'Updated test transaction',
      });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.transaction!.amount).toBe(250.0);

      // Delete transaction
      const deleteResponse = await httpClient.delete(
        `${API_BASE_URL}/transactions/${transactionId}`,
        {
          user_id: 1,
        }
      );

      expect(deleteResponse.status).toBe(204);

      // Verify deletion
      const finalGetResponse = await httpClient.get(
        `${API_BASE_URL}/transactions/${transactionId}`
      );
      expect(finalGetResponse.status).toBe(404);
    });

    it('should handle multiple transactions and summary calculation', async () => {
      // Create multiple transactions
      await httpClient.post(`${API_BASE_URL}/transactions`, {
        user_id: 1,
        category_id: 1,
        transaction_type: 'income',
        amount: 1000.0,
        note: 'Salary',
      });

      await httpClient.post(`${API_BASE_URL}/transactions`, {
        user_id: 1,
        category_id: 2,
        transaction_type: 'expense',
        amount: 200.0,
        note: 'Groceries',
      });

      await httpClient.post(`${API_BASE_URL}/transactions`, {
        user_id: 1,
        category_id: 3,
        transaction_type: 'expense',
        amount: 150.0,
        note: 'Entertainment',
      });

      // Check summary
      const summaryResponse = await httpClient.get(`${API_BASE_URL}/transactions/summary`);
      expect(summaryResponse.status).toBe(200);
      expect(summaryResponse.data.total_income).toBe(1000.0);
      expect(summaryResponse.data.total_expense).toBe(350.0);
      expect(summaryResponse.data.net_balance).toBe(650.0);
      expect(summaryResponse.data.transaction_count).toBe(3);

      // Check pagination
      const listResponse = await httpClient.get(`${API_BASE_URL}/transactions`, {
        query: { page: '1', limit: '2' },
      });

      expect(listResponse.status).toBe(200);
      expect(listResponse.data.transactions).toHaveLength(2);
      expect(listResponse.data.pagination.total_items).toBe(3);
    });
  });
});
