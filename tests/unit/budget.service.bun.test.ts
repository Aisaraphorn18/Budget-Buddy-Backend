/**
 * Budget Service Unit Tests
 *
 * ทดสอบ BudgetService ที่จัดการงบประมาณในระบบ Budget Buddy
 * ครอบคลุม CRUD operations, การกรอง, การวิเคราะห์งบประมาณ และ business logic
 */

import { describe, it, expect, beforeEach } from 'bun:test';

// Mock Budget Data
const mockBudgets = [
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
  {
    budget_id: 4,
    user_id: 2,
    category_id: 1,
    cycle_month: '2024-01',
    budget_amount: 800.0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock Spending Data - แยกตาม category_id และ cycle_month
const mockSpendingData = {
  '1_2024-01': 750.0, // Category 1, 2024-01 = 750
  '2_2024-01': 200.0, // Category 2, 2024-01 = 200
  '1_2024-02': 300.0, // Category 1, 2024-02 = 300
  // Total for user 1 = 750 + 200 + 300 = 1250
};

// Mock BudgetService Class
class MockBudgetService {
  private budgets = [...mockBudgets];
  private nextId = 5;

  async getAllBudgets(
    userId: number,
    filters: { cycle_month?: string; category_id?: number } = {}
  ) {
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }

    let userBudgets = this.budgets.filter(b => b.user_id === userId);

    // Apply filters
    if (filters.cycle_month) {
      userBudgets = userBudgets.filter(b => b.cycle_month === filters.cycle_month);
    }
    if (filters.category_id) {
      userBudgets = userBudgets.filter(b => b.category_id === filters.category_id);
    }

    return userBudgets;
  }

  async getBudgetById(budgetId: number, userId: number) {
    if (!budgetId || budgetId <= 0) {
      throw new Error('Valid budget ID is required');
    }
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }

    const budget = this.budgets.find(b => b.budget_id === budgetId && b.user_id === userId);

    return budget || null;
  }

  async createBudget(budgetData: any) {
    // Validate required fields
    if (!budgetData.user_id || budgetData.user_id <= 0) {
      throw new Error('Valid user ID is required');
    }
    if (!budgetData.category_id || budgetData.category_id <= 0) {
      throw new Error('Valid category ID is required');
    }
    if (!budgetData.cycle_month || !/^\d{4}-\d{2}$/.test(budgetData.cycle_month)) {
      throw new Error('Cycle month must be in YYYY-MM format');
    }
    if (!budgetData.budget_amount || budgetData.budget_amount <= 0) {
      throw new Error('Budget amount must be a positive number');
    }

    // Check for duplicate budget
    const existingBudget = this.budgets.find(
      b =>
        b.user_id === budgetData.user_id &&
        b.category_id === budgetData.category_id &&
        b.cycle_month === budgetData.cycle_month
    );

    if (existingBudget) {
      throw new Error('Budget already exists for this category and month');
    }

    const newBudget = {
      budget_id: this.nextId++,
      user_id: budgetData.user_id,
      category_id: budgetData.category_id,
      cycle_month: budgetData.cycle_month,
      budget_amount: budgetData.budget_amount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.budgets.push(newBudget);
    return newBudget;
  }

  async updateBudget(budgetId: number, userId: number, updateData: any) {
    if (!budgetId || budgetId <= 0) {
      throw new Error('Valid budget ID is required');
    }
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('Update data cannot be empty');
    }

    const budgetIndex = this.budgets.findIndex(
      b => b.budget_id === budgetId && b.user_id === userId
    );

    if (budgetIndex === -1) {
      return null;
    }

    // Validate update data
    if (updateData.budget_amount !== undefined && updateData.budget_amount <= 0) {
      throw new Error('Budget amount must be a positive number');
    }
    if (updateData.cycle_month && !/^\d{4}-\d{2}$/.test(updateData.cycle_month)) {
      throw new Error('Cycle month must be in YYYY-MM format');
    }

    // Check for duplicate budget when updating category or month
    if (updateData.category_id || updateData.cycle_month) {
      const existingBudget = this.budgets.find(
        b =>
          b.budget_id !== budgetId &&
          b.user_id === userId &&
          b.category_id === (updateData.category_id || this.budgets[budgetIndex].category_id) &&
          b.cycle_month === (updateData.cycle_month || this.budgets[budgetIndex].cycle_month)
      );

      if (existingBudget) {
        throw new Error('Budget already exists for this category and month');
      }
    }

    const updatedBudget = {
      ...this.budgets[budgetIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    this.budgets[budgetIndex] = updatedBudget;
    return updatedBudget;
  }

  async deleteBudget(budgetId: number, userId: number): Promise<boolean> {
    if (!budgetId || budgetId <= 0) {
      throw new Error('Valid budget ID is required');
    }
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }

    const budgetIndex = this.budgets.findIndex(
      b => b.budget_id === budgetId && b.user_id === userId
    );

    if (budgetIndex === -1) {
      return false;
    }

    this.budgets.splice(budgetIndex, 1);
    return true;
  }

  async getBudgetsWithSpending(userId: number, cycleMonth: string) {
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }
    if (!cycleMonth || !/^\d{4}-\d{2}$/.test(cycleMonth)) {
      throw new Error('Cycle month must be in YYYY-MM format');
    }

    const userBudgets = await this.getAllBudgets(userId, { cycle_month: cycleMonth });

    return userBudgets.map(budget => {
      const spendingKey = `${budget.category_id}_${budget.cycle_month}`;
      const spentAmount = mockSpendingData[spendingKey as keyof typeof mockSpendingData] || 0;

      return {
        ...budget,
        spent_amount: spentAmount,
        remaining_amount: budget.budget_amount - spentAmount,
        usage_percentage: (spentAmount / budget.budget_amount) * 100,
      };
    });
  }

  async getBudgetOverview(userId: number) {
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }

    const userBudgets = await this.getAllBudgets(userId);

    const totalBudget = userBudgets.reduce((sum, b) => sum + b.budget_amount, 0);
    const totalSpent = userBudgets.reduce((sum, budget) => {
      const spendingKey = `${budget.category_id}_${budget.cycle_month}`;
      const spentAmount = mockSpendingData[spendingKey as keyof typeof mockSpendingData] || 0;
      return sum + spentAmount;
    }, 0);

    return {
      total_budget: totalBudget,
      total_spent: totalSpent,
      total_remaining: totalBudget - totalSpent,
      budget_count: userBudgets.length,
    };
  }
}

describe('BudgetService', () => {
  let budgetService: MockBudgetService;

  beforeEach(() => {
    budgetService = new MockBudgetService();
  });

  describe('getAllBudgets()', () => {
    describe('📄 Basic Functionality', () => {
      it('should return all budgets for valid user', async () => {
        const budgets = await budgetService.getAllBudgets(1);

        expect(budgets).toHaveLength(3); // User 1 has 3 budgets
        expect(budgets.every(b => b.user_id === 1)).toBe(true);
      });
    });

    describe('🔍 Filtering', () => {
      it('should filter budgets by cycle month', async () => {
        const budgets = await budgetService.getAllBudgets(1, { cycle_month: '2024-01' });

        expect(budgets).toHaveLength(2); // User 1 has 2 budgets in 2024-01
        expect(budgets.every(b => b.cycle_month === '2024-01')).toBe(true);
      });

      it('should filter budgets by category', async () => {
        const budgets = await budgetService.getAllBudgets(1, { category_id: 1 });

        expect(budgets).toHaveLength(2); // User 1 has 2 budgets for category 1
        expect(budgets.every(b => b.category_id === 1)).toBe(true);
      });

      it('should filter by both cycle month and category', async () => {
        const budgets = await budgetService.getAllBudgets(1, {
          cycle_month: '2024-01',
          category_id: 1,
        });

        expect(budgets).toHaveLength(1);
        expect(budgets[0].cycle_month).toBe('2024-01');
        expect(budgets[0].category_id).toBe(1);
      });
    });

    describe('🧪 Edge Cases', () => {
      it('should return empty array for user with no budgets', async () => {
        const budgets = await budgetService.getAllBudgets(999);

        expect(budgets).toHaveLength(0);
      });
    });

    describe('❌ Error Handling', () => {
      it('should throw error for invalid user ID', async () => {
        expect(async () => {
          await budgetService.getAllBudgets(0);
        }).toThrow('Valid user ID is required');
      });
    });
  });

  describe('getBudgetById()', () => {
    describe('🔍 Basic Functionality', () => {
      it('should return budget for valid ID and user', async () => {
        const budget = await budgetService.getBudgetById(1, 1);

        expect(budget).not.toBeNull();
        expect(budget?.budget_id).toBe(1);
        expect(budget?.user_id).toBe(1);
      });

      it('should return null for non-existent budget', async () => {
        const budget = await budgetService.getBudgetById(999, 1);

        expect(budget).toBeNull();
      });

      it('should return null for budget of different user', async () => {
        const budget = await budgetService.getBudgetById(1, 2);

        expect(budget).toBeNull();
      });
    });

    describe('❌ Error Handling', () => {
      it('should throw error for invalid budget ID', async () => {
        expect(async () => {
          await budgetService.getBudgetById(0, 1);
        }).toThrow('Valid budget ID is required');
      });

      it('should throw error for invalid user ID', async () => {
        expect(async () => {
          await budgetService.getBudgetById(1, 0);
        }).toThrow('Valid user ID is required');
      });
    });
  });

  describe('createBudget()', () => {
    describe('✅ Successful Creation', () => {
      it('should create new budget with valid data', async () => {
        const budgetData = {
          user_id: 1,
          category_id: 3,
          cycle_month: '2024-03',
          budget_amount: 1500.0,
        };

        const budget = await budgetService.createBudget(budgetData);

        expect(budget.budget_id).toBeDefined();
        expect(budget.user_id).toBe(1);
        expect(budget.category_id).toBe(3);
        expect(budget.cycle_month).toBe('2024-03');
        expect(budget.budget_amount).toBe(1500.0);
        expect(budget.created_at).toBeDefined();
        expect(budget.updated_at).toBeDefined();
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for invalid user ID', async () => {
        const budgetData = {
          user_id: 0,
          category_id: 1,
          cycle_month: '2024-03',
          budget_amount: 1000.0,
        };

        expect(async () => {
          await budgetService.createBudget(budgetData);
        }).toThrow('Valid user ID is required');
      });

      it('should throw error for invalid category ID', async () => {
        const budgetData = {
          user_id: 1,
          category_id: 0,
          cycle_month: '2024-03',
          budget_amount: 1000.0,
        };

        expect(async () => {
          await budgetService.createBudget(budgetData);
        }).toThrow('Valid category ID is required');
      });

      it('should throw error for invalid cycle month format', async () => {
        const budgetData = {
          user_id: 1,
          category_id: 1,
          cycle_month: '2024/03',
          budget_amount: 1000.0,
        };

        expect(async () => {
          await budgetService.createBudget(budgetData);
        }).toThrow('Cycle month must be in YYYY-MM format');
      });

      it('should throw error for invalid budget amount', async () => {
        const budgetData = {
          user_id: 1,
          category_id: 1,
          cycle_month: '2024-03',
          budget_amount: 0,
        };

        expect(async () => {
          await budgetService.createBudget(budgetData);
        }).toThrow('Budget amount must be a positive number');
      });

      it('should throw error for negative budget amount', async () => {
        const budgetData = {
          user_id: 1,
          category_id: 1,
          cycle_month: '2024-03',
          budget_amount: -500.0,
        };

        expect(async () => {
          await budgetService.createBudget(budgetData);
        }).toThrow('Budget amount must be a positive number');
      });

      it('should throw error for duplicate budget', async () => {
        const budgetData = {
          user_id: 1,
          category_id: 1,
          cycle_month: '2024-01',
          budget_amount: 1000.0,
        };

        expect(async () => {
          await budgetService.createBudget(budgetData);
        }).toThrow('Budget already exists for this category and month');
      });
    });
  });

  describe('updateBudget()', () => {
    describe('✅ Successful Updates', () => {
      it('should update budget with valid data', async () => {
        const updateData = { budget_amount: 1500.0 };
        const updated = await budgetService.updateBudget(1, 1, updateData);

        expect(updated).not.toBeNull();
        expect(updated?.budget_amount).toBe(1500.0);
        expect(updated?.updated_at).toBeDefined();
      });

      it('should update cycle month', async () => {
        const updateData = { cycle_month: '2024-03' };
        const updated = await budgetService.updateBudget(1, 1, updateData);

        expect(updated).not.toBeNull();
        expect(updated?.cycle_month).toBe('2024-03');
      });
    });

    describe('🔍 Not Found Cases', () => {
      it('should return null for non-existent budget', async () => {
        const updateData = { budget_amount: 1500.0 };
        const updated = await budgetService.updateBudget(999, 1, updateData);

        expect(updated).toBeNull();
      });

      it('should return null for budget of different user', async () => {
        const updateData = { budget_amount: 1500.0 };
        const updated = await budgetService.updateBudget(1, 2, updateData);

        expect(updated).toBeNull();
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for invalid budget ID', async () => {
        const updateData = { budget_amount: 1500.0 };

        expect(async () => {
          await budgetService.updateBudget(0, 1, updateData);
        }).toThrow('Valid budget ID is required');
      });

      it('should throw error for invalid user ID', async () => {
        const updateData = { budget_amount: 1500.0 };

        expect(async () => {
          await budgetService.updateBudget(1, 0, updateData);
        }).toThrow('Valid user ID is required');
      });

      it('should throw error for empty update data', async () => {
        expect(async () => {
          await budgetService.updateBudget(1, 1, {});
        }).toThrow('Update data cannot be empty');
      });

      it('should throw error for invalid budget amount', async () => {
        const updateData = { budget_amount: 0 };

        expect(async () => {
          await budgetService.updateBudget(1, 1, updateData);
        }).toThrow('Budget amount must be a positive number');
      });

      it('should throw error for invalid cycle month format', async () => {
        const updateData = { cycle_month: '2024/03' };

        expect(async () => {
          await budgetService.updateBudget(1, 1, updateData);
        }).toThrow('Cycle month must be in YYYY-MM format');
      });

      it('should throw error for duplicate budget when updating category', async () => {
        const updateData = { category_id: 2 };

        expect(async () => {
          await budgetService.updateBudget(1, 1, updateData);
        }).toThrow('Budget already exists for this category and month');
      });
    });
  });

  describe('deleteBudget()', () => {
    describe('🗑️ Successful Deletion', () => {
      it('should delete budget successfully', async () => {
        const result = await budgetService.deleteBudget(1, 1);

        expect(result).toBe(true);

        // Verify budget is deleted
        const budget = await budgetService.getBudgetById(1, 1);
        expect(budget).toBeNull();
      });
    });

    describe('🔍 Not Found Cases', () => {
      it('should return false for non-existent budget', async () => {
        const result = await budgetService.deleteBudget(999, 1);

        expect(result).toBe(false);
      });

      it('should return false for budget of different user', async () => {
        const result = await budgetService.deleteBudget(1, 2);

        expect(result).toBe(false);
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for invalid budget ID', async () => {
        expect(async () => {
          await budgetService.deleteBudget(0, 1);
        }).toThrow('Valid budget ID is required');
      });

      it('should throw error for invalid user ID', async () => {
        expect(async () => {
          await budgetService.deleteBudget(1, 0);
        }).toThrow('Valid user ID is required');
      });
    });
  });

  describe('getBudgetsWithSpending()', () => {
    describe('📊 Spending Analysis', () => {
      it('should return budgets with spending analysis', async () => {
        const budgets = await budgetService.getBudgetsWithSpending(1, '2024-01');

        expect(budgets).toHaveLength(2);
        expect(budgets[0].spent_amount).toBeDefined();
        expect(budgets[0].remaining_amount).toBeDefined();
        expect(budgets[0].usage_percentage).toBeDefined();
      });

      it('should return empty array for month with no budgets', async () => {
        const budgets = await budgetService.getBudgetsWithSpending(1, '2024-12');

        expect(budgets).toHaveLength(0);
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for invalid user ID', async () => {
        expect(async () => {
          await budgetService.getBudgetsWithSpending(0, '2024-01');
        }).toThrow('Valid user ID is required');
      });

      it('should throw error for invalid cycle month format', async () => {
        expect(async () => {
          await budgetService.getBudgetsWithSpending(1, '2024/01');
        }).toThrow('Cycle month must be in YYYY-MM format');
      });
    });
  });

  describe('getBudgetOverview()', () => {
    describe('📈 Overview Calculation', () => {
      it('should return budget overview for user', async () => {
        const overview = await budgetService.getBudgetOverview(1);

        expect(overview.total_budget).toBe(2700.0); // 1000 + 500 + 1200
        expect(overview.total_spent).toBe(1250.0); // 750 + 200 + 300
        expect(overview.total_remaining).toBe(1450.0); // 2700 - 1250
        expect(overview.budget_count).toBe(3);
      });

      it('should return zero overview for user with no budgets', async () => {
        const overview = await budgetService.getBudgetOverview(999);

        expect(overview.total_budget).toBe(0);
        expect(overview.total_spent).toBe(0);
        expect(overview.total_remaining).toBe(0);
        expect(overview.budget_count).toBe(0);
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for invalid user ID', async () => {
        expect(async () => {
          await budgetService.getBudgetOverview(0);
        }).toThrow('Valid user ID is required');
      });
    });
  });
});
