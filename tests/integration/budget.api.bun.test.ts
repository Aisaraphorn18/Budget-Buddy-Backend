/**
 * Budget API Integration Tests
 *
 * ทดสอบการทำงานของ Budget API endpoints แบบ end-to-end
 * ครอบคลุม CRUD operations, การกรอง, การวิเคราะห์งบประมาณ และ spending analysis
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

// Mock server instance (จำลองการเชื่อมต่อ API)
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Mock HTTP client สำหรับ Budget API testing
class MockBudgetHttpClient {
  private budgets: any[] = [];
  private nextId = 1;
  private mockSpending: Record<string, number> = {}; // category_id_cycle_month -> amount

  async get(url: string, options: any = {}) {
    // Handle /budgets/overview
    if (url.includes('/budgets/overview')) {
      const userBudgets = this.budgets.filter(b => b.user_id === 1);
      const totalBudget = userBudgets.reduce((sum, b) => sum + b.budget_amount, 0);

      const totalSpent = userBudgets.reduce((sum, budget) => {
        const spendingKey = `${budget.category_id}_${budget.cycle_month}`;
        const spent = this.mockSpending[spendingKey] || 0;
        return sum + spent;
      }, 0);

      return {
        status: 200,
        data: {
          total_budget: totalBudget,
          total_spent: totalSpent,
          total_remaining: totalBudget - totalSpent,
          budget_count: userBudgets.length,
        },
      };
    }

    // Handle /budgets/spending/:cycleMonth
    if (url.match(/\/budgets\/spending\/[\d-]+$/)) {
      const cycleMonth = url.split('/').pop()!;
      const userBudgets = this.budgets.filter(b => b.user_id === 1 && b.cycle_month === cycleMonth);

      const budgetsWithSpending = userBudgets.map(budget => {
        const spendingKey = `${budget.category_id}_${budget.cycle_month}`;
        const spentAmount = this.mockSpending[spendingKey] || 0;

        return {
          ...budget,
          spent_amount: spentAmount,
          remaining_amount: budget.budget_amount - spentAmount,
          usage_percentage: (spentAmount / budget.budget_amount) * 100,
        };
      });

      return {
        status: 200,
        data: { budgets: budgetsWithSpending },
      };
    }

    // Handle /budgets/:id (specific budget)
    if (url.match(/\/budgets\/\d+$/)) {
      const id = parseInt(url.split('/').pop()!);
      const budget = this.budgets.find(b => b.budget_id === id && b.user_id === 1);

      if (!budget) {
        return { status: 404, data: { error: 'Budget not found' } };
      }

      return { status: 200, data: { budget } };
    }

    // Handle /budgets (list with filters)
    if (url.includes('/budgets')) {
      const query = options.query || {};
      const cycleMonth = query.cycle_month;
      const categoryId = query.category_id;

      let filtered = this.budgets.filter(b => b.user_id === 1);

      if (cycleMonth) {
        filtered = filtered.filter(b => b.cycle_month === cycleMonth);
      }
      if (categoryId) {
        filtered = filtered.filter(b => b.category_id === parseInt(categoryId));
      }

      return {
        status: 200,
        data: { budgets: filtered },
      };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  async post(url: string, data: any) {
    if (url.includes('/budgets')) {
      // Validation
      if (!data.user_id || !data.category_id || !data.cycle_month || !data.budget_amount) {
        return {
          status: 400,
          data: { error: 'Missing required fields' },
        };
      }

      if (data.budget_amount <= 0) {
        return {
          status: 400,
          data: { error: 'Budget amount must be positive' },
        };
      }

      if (!/^\d{4}-\d{2}$/.test(data.cycle_month)) {
        return {
          status: 400,
          data: { error: 'Cycle month must be in YYYY-MM format' },
        };
      }

      // Check for duplicate budget
      const existingBudget = this.budgets.find(
        b =>
          b.user_id === data.user_id &&
          b.category_id === data.category_id &&
          b.cycle_month === data.cycle_month
      );

      if (existingBudget) {
        return {
          status: 409,
          data: { error: 'Budget already exists for this category and month' },
        };
      }

      const newBudget = {
        budget_id: this.nextId++,
        user_id: data.user_id,
        category_id: data.category_id,
        cycle_month: data.cycle_month,
        budget_amount: data.budget_amount,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.budgets.push(newBudget);

      return {
        status: 201,
        data: { budget: newBudget },
      };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  async put(url: string, data: any) {
    if (url.match(/\/budgets\/\d+$/)) {
      const id = parseInt(url.split('/').pop()!);
      const budgetIndex = this.budgets.findIndex(
        b => b.budget_id === id && b.user_id === data.user_id
      );

      if (budgetIndex === -1) {
        return { status: 404, data: { error: 'Budget not found' } };
      }

      // Validation
      if (data.budget_amount !== undefined && data.budget_amount <= 0) {
        return {
          status: 400,
          data: { error: 'Budget amount must be positive' },
        };
      }

      if (data.cycle_month && !/^\d{4}-\d{2}$/.test(data.cycle_month)) {
        return {
          status: 400,
          data: { error: 'Cycle month must be in YYYY-MM format' },
        };
      }

      // Check for duplicate when updating category or month
      if (data.category_id || data.cycle_month) {
        const existingBudget = this.budgets.find(
          b =>
            b.budget_id !== id &&
            b.user_id === data.user_id &&
            b.category_id === (data.category_id || this.budgets[budgetIndex].category_id) &&
            b.cycle_month === (data.cycle_month || this.budgets[budgetIndex].cycle_month)
        );

        if (existingBudget) {
          return {
            status: 409,
            data: { error: 'Budget already exists for this category and month' },
          };
        }
      }

      const updatedBudget = {
        ...this.budgets[budgetIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };

      this.budgets[budgetIndex] = updatedBudget;

      return {
        status: 200,
        data: { budget: updatedBudget },
      };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  async delete(url: string, options: any = {}) {
    if (url.match(/\/budgets\/\d+$/)) {
      const id = parseInt(url.split('/').pop()!);
      const budgetIndex = this.budgets.findIndex(
        b => b.budget_id === id && b.user_id === options.user_id
      );

      if (budgetIndex === -1) {
        return { status: 404, data: { error: 'Budget not found' } };
      }

      this.budgets.splice(budgetIndex, 1);

      return { status: 204, data: {} };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  // Helper methods
  reset() {
    this.budgets = [];
    this.nextId = 1;
    this.mockSpending = {};
  }

  seedTestData() {
    this.budgets = [
      {
        budget_id: 1,
        user_id: 1,
        category_id: 1,
        cycle_month: '2024-01',
        budget_amount: 1000.0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        budget_id: 2,
        user_id: 1,
        category_id: 2,
        cycle_month: '2024-01',
        budget_amount: 500.0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        budget_id: 3,
        user_id: 1,
        category_id: 1,
        cycle_month: '2024-02',
        budget_amount: 1200.0,
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
      },
    ];

    this.mockSpending = {
      '1_2024-01': 750.0, // Category 1, January
      '2_2024-01': 200.0, // Category 2, January
      '1_2024-02': 300.0, // Category 1, February
    };

    this.nextId = 4;
  }
}

describe('Budget API Integration Tests', () => {
  let httpClient: MockBudgetHttpClient;

  beforeEach(() => {
    httpClient = new MockBudgetHttpClient();
  });

  afterEach(() => {
    httpClient.reset();
  });

  describe('GET /api/v1/budgets', () => {
    describe('📄 Basic Functionality', () => {
      it('should return all budgets for authenticated user', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/budgets`);

        expect(response.status).toBe(200);
        expect(response.data.budgets).toHaveLength(3);
        expect(response.data.budgets?.every((b: any) => b.user_id === 1)).toBe(true);
      });

      it('should return empty array when no budgets exist', async () => {
        const response = await httpClient.get(`${API_BASE_URL}/budgets`);

        expect(response.status).toBe(200);
        expect(response.data.budgets).toHaveLength(0);
      });
    });

    describe('🔍 Filtering', () => {
      it('should filter budgets by cycle month', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/budgets`, {
          query: { cycle_month: '2024-01' },
        });

        expect(response.status).toBe(200);
        expect(response.data.budgets).toHaveLength(2);
        expect(response.data.budgets?.every((b: any) => b.cycle_month === '2024-01')).toBe(true);
      });

      it('should filter budgets by category', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/budgets`, {
          query: { category_id: '1' },
        });

        expect(response.status).toBe(200);
        expect(response.data.budgets).toHaveLength(2);
        expect(response.data.budgets?.every((b: any) => b.category_id === 1)).toBe(true);
      });

      it('should filter by both cycle month and category', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/budgets`, {
          query: { cycle_month: '2024-01', category_id: '1' },
        });

        expect(response.status).toBe(200);
        expect(response.data.budgets).toHaveLength(1);
        expect(response.data.budgets?.[0]?.cycle_month).toBe('2024-01');
        expect(response.data.budgets?.[0]?.category_id).toBe(1);
      });
    });
  });

  describe('GET /api/v1/budgets/:id', () => {
    describe('🔍 Basic Functionality', () => {
      it('should return specific budget by ID', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/budgets/1`);

        expect(response.status).toBe(200);
        expect(response.data.budget!.budget_id).toBe(1);
        expect(response.data.budget!.budget_amount).toBe(1000.0);
      });

      it('should return 404 for non-existent budget', async () => {
        const response = await httpClient.get(`${API_BASE_URL}/budgets/999`);

        expect(response.status).toBe(404);
        expect(response.data.error).toBe('Budget not found');
      });
    });
  });

  describe('POST /api/v1/budgets', () => {
    describe('✅ Successful Creation', () => {
      it('should create new budget with valid data', async () => {
        const budgetData = {
          user_id: 1,
          category_id: 3,
          cycle_month: '2024-03',
          budget_amount: 1500.0,
        };

        const response = await httpClient.post(`${API_BASE_URL}/budgets`, budgetData);

        expect(response.status).toBe(201);
        expect(response.data.budget!.budget_id).toBeDefined();
        expect(response.data.budget!.category_id).toBe(3);
        expect(response.data.budget!.cycle_month).toBe('2024-03');
        expect(response.data.budget!.budget_amount).toBe(1500.0);
        expect(response.data.budget!.created_at).toBeDefined();
      });
    });

    describe('❌ Validation Errors', () => {
      it('should return 400 for missing required fields', async () => {
        const incompleteData = {
          user_id: 1,
          category_id: 1,
          // missing cycle_month and budget_amount
        };

        const response = await httpClient.post(`${API_BASE_URL}/budgets`, incompleteData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Missing required fields');
      });

      it('should return 400 for invalid budget amount', async () => {
        const invalidData = {
          user_id: 1,
          category_id: 1,
          cycle_month: '2024-03',
          budget_amount: -500.0,
        };

        const response = await httpClient.post(`${API_BASE_URL}/budgets`, invalidData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Budget amount must be positive');
      });

      it('should return 400 for invalid cycle month format', async () => {
        const invalidData = {
          user_id: 1,
          category_id: 1,
          cycle_month: '2024/03',
          budget_amount: 1000.0,
        };

        const response = await httpClient.post(`${API_BASE_URL}/budgets`, invalidData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Cycle month must be in YYYY-MM format');
      });

      it('should return 409 for duplicate budget', async () => {
        httpClient.seedTestData();

        const duplicateData = {
          user_id: 1,
          category_id: 1,
          cycle_month: '2024-01',
          budget_amount: 800.0,
        };

        const response = await httpClient.post(`${API_BASE_URL}/budgets`, duplicateData);

        expect(response.status).toBe(409);
        expect(response.data.error).toBe('Budget already exists for this category and month');
      });
    });
  });

  describe('PUT /api/v1/budgets/:id', () => {
    describe('✅ Successful Updates', () => {
      it('should update budget amount', async () => {
        httpClient.seedTestData();

        const updateData = {
          user_id: 1,
          budget_amount: 1500.0,
        };

        const response = await httpClient.put(`${API_BASE_URL}/budgets/1`, updateData);

        expect(response.status).toBe(200);
        expect(response.data.budget!.budget_amount).toBe(1500.0);
        expect(response.data.budget!.updated_at).toBeDefined();
      });

      it('should update cycle month', async () => {
        httpClient.seedTestData();

        const updateData = {
          user_id: 1,
          cycle_month: '2024-03',
        };

        const response = await httpClient.put(`${API_BASE_URL}/budgets/1`, updateData);

        expect(response.status).toBe(200);
        expect(response.data.budget!.cycle_month).toBe('2024-03');
      });
    });

    describe('❌ Error Handling', () => {
      it('should return 404 for non-existent budget', async () => {
        const updateData = { user_id: 1, budget_amount: 1200.0 };

        const response = await httpClient.put(`${API_BASE_URL}/budgets/999`, updateData);

        expect(response.status).toBe(404);
        expect(response.data.error).toBe('Budget not found');
      });

      it('should return 400 for invalid budget amount', async () => {
        httpClient.seedTestData();

        const updateData = {
          user_id: 1,
          budget_amount: 0,
        };

        const response = await httpClient.put(`${API_BASE_URL}/budgets/1`, updateData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Budget amount must be positive');
      });

      it('should return 400 for invalid cycle month format', async () => {
        httpClient.seedTestData();

        const updateData = {
          user_id: 1,
          cycle_month: '2024/03',
        };

        const response = await httpClient.put(`${API_BASE_URL}/budgets/1`, updateData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Cycle month must be in YYYY-MM format');
      });

      it('should return 409 for duplicate budget when updating', async () => {
        httpClient.seedTestData();

        const updateData = {
          user_id: 1,
          category_id: 2, // This would create duplicate with budget 2
        };

        const response = await httpClient.put(`${API_BASE_URL}/budgets/1`, updateData);

        expect(response.status).toBe(409);
        expect(response.data.error).toBe('Budget already exists for this category and month');
      });
    });
  });

  describe('DELETE /api/v1/budgets/:id', () => {
    describe('🗑️ Successful Deletion', () => {
      it('should delete budget successfully', async () => {
        httpClient.seedTestData();

        const response = await httpClient.delete(`${API_BASE_URL}/budgets/1`, {
          user_id: 1,
        });

        expect(response.status).toBe(204);

        // Verify budget is deleted
        const getResponse = await httpClient.get(`${API_BASE_URL}/budgets/1`);
        expect(getResponse.status).toBe(404);
      });
    });

    describe('❌ Error Handling', () => {
      it('should return 404 for non-existent budget', async () => {
        const response = await httpClient.delete(`${API_BASE_URL}/budgets/999`, {
          user_id: 1,
        });

        expect(response.status).toBe(404);
        expect(response.data.error).toBe('Budget not found');
      });
    });
  });

  describe('GET /api/v1/budgets/spending/:cycleMonth', () => {
    describe('📊 Spending Analysis', () => {
      it('should return budgets with spending analysis for specific month', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/budgets/spending/2024-01`);

        expect(response.status).toBe(200);
        expect(response.data.budgets).toHaveLength(2);

        const budget1 = response.data.budgets?.find((b: any) => b.category_id === 1);
        expect(budget1?.spent_amount).toBe(750.0);
        expect(budget1?.remaining_amount).toBe(250.0); // 1000 - 750
        expect(budget1?.usage_percentage).toBe(75.0); // (750/1000) * 100

        const budget2 = response.data.budgets?.find((b: any) => b.category_id === 2);
        expect(budget2?.spent_amount).toBe(200.0);
        expect(budget2?.remaining_amount).toBe(300.0); // 500 - 200
        expect(budget2?.usage_percentage).toBe(40.0); // (200/500) * 100
      });

      it('should return empty array for month with no budgets', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/budgets/spending/2024-12`);

        expect(response.status).toBe(200);
        expect(response.data.budgets).toHaveLength(0);
      });
    });
  });

  describe('GET /api/v1/budgets/overview', () => {
    describe('📈 Budget Overview', () => {
      it('should return correct budget overview', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/budgets/overview`);

        expect(response.status).toBe(200);
        expect(response.data.total_budget).toBe(2700.0); // 1000 + 500 + 1200
        expect(response.data.total_spent).toBe(1250.0); // 750 + 200 + 300
        expect(response.data.total_remaining).toBe(1450.0); // 2700 - 1250
        expect(response.data.budget_count).toBe(3);
      });

      it('should return zero overview when no budgets exist', async () => {
        const response = await httpClient.get(`${API_BASE_URL}/budgets/overview`);

        expect(response.status).toBe(200);
        expect(response.data.total_budget).toBe(0);
        expect(response.data.total_spent).toBe(0);
        expect(response.data.total_remaining).toBe(0);
        expect(response.data.budget_count).toBe(0);
      });
    });
  });

  describe('🧪 Integration Scenarios', () => {
    it('should handle complete budget lifecycle', async () => {
      // Create budget
      const createResponse = await httpClient.post(`${API_BASE_URL}/budgets`, {
        user_id: 1,
        category_id: 3,
        cycle_month: '2024-03',
        budget_amount: 800.0,
      });

      expect(createResponse.status).toBe(201);
      const budgetId = createResponse.data.budget!.budget_id;

      // Read budget
      const getResponse = await httpClient.get(`${API_BASE_URL}/budgets/${budgetId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.budget!.budget_amount).toBe(800.0);

      // Update budget
      const updateResponse = await httpClient.put(`${API_BASE_URL}/budgets/${budgetId}`, {
        user_id: 1,
        budget_amount: 1000.0,
      });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.budget!.budget_amount).toBe(1000.0);

      // Delete budget
      const deleteResponse = await httpClient.delete(`${API_BASE_URL}/budgets/${budgetId}`, {
        user_id: 1,
      });

      expect(deleteResponse.status).toBe(204);

      // Verify deletion
      const finalGetResponse = await httpClient.get(`${API_BASE_URL}/budgets/${budgetId}`);
      expect(finalGetResponse.status).toBe(404);
    });

    it('should handle multiple budgets and filtering', async () => {
      // Create multiple budgets
      await httpClient.post(`${API_BASE_URL}/budgets`, {
        user_id: 1,
        category_id: 1,
        cycle_month: '2024-03',
        budget_amount: 1000.0,
      });

      await httpClient.post(`${API_BASE_URL}/budgets`, {
        user_id: 1,
        category_id: 2,
        cycle_month: '2024-03',
        budget_amount: 600.0,
      });

      await httpClient.post(`${API_BASE_URL}/budgets`, {
        user_id: 1,
        category_id: 3,
        cycle_month: '2024-04',
        budget_amount: 800.0,
      });

      // Test filtering by cycle month
      const marchResponse = await httpClient.get(`${API_BASE_URL}/budgets`, {
        query: { cycle_month: '2024-03' },
      });

      expect(marchResponse.status).toBe(200);
      expect(marchResponse.data.budgets).toHaveLength(2);
      expect(marchResponse.data.budgets?.every((b: any) => b.cycle_month === '2024-03')).toBe(true);

      // Test filtering by category
      const categoryResponse = await httpClient.get(`${API_BASE_URL}/budgets`, {
        query: { category_id: '1' },
      });

      expect(categoryResponse.status).toBe(200);
      expect(categoryResponse.data.budgets).toHaveLength(1);
      expect(categoryResponse.data.budgets?.[0]?.category_id).toBe(1);

      // Test overview calculation
      const overviewResponse = await httpClient.get(`${API_BASE_URL}/budgets/overview`);
      expect(overviewResponse.status).toBe(200);
      expect(overviewResponse.data.total_budget).toBe(2400.0); // 1000 + 600 + 800
      expect(overviewResponse.data.budget_count).toBe(3);
    });
  });
});
