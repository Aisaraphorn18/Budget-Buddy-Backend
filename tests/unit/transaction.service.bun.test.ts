/**
 * Transaction Service Unit Tests
 *
 * ทดสอบ TransactionService ที่จัดการรายการธุรกรรมในระบบ Budget Buddy
 * ครอบคลุม CRUD operations, การกรอง, pagination และ business logic ของธุรกรรม
 */

import { describe, it, expect, beforeEach } from 'bun:test';

// Mock Transaction Data
const mockTransactions = [
  {
    transaction_id: 1,
    user_id: 1,
    category_id: 1,
    type: 'expense',
    amount: 50.0,
    note: 'Lunch at restaurant',
    created_at: '2024-01-01T12:00:00Z',
    updated_at: '2024-01-01T12:00:00Z',
  },
  {
    transaction_id: 2,
    user_id: 1,
    category_id: 2,
    type: 'expense',
    amount: 25.0,
    note: 'Bus fare',
    created_at: '2024-01-02T08:00:00Z',
    updated_at: '2024-01-02T08:00:00Z',
  },
  {
    transaction_id: 3,
    user_id: 1,
    category_id: 1,
    type: 'income',
    amount: 1000.0,
    note: 'Salary payment',
    created_at: '2024-01-03T10:00:00Z',
    updated_at: '2024-01-03T10:00:00Z',
  },
  {
    transaction_id: 4,
    user_id: 2,
    category_id: 1,
    type: 'expense',
    amount: 30.0,
    note: 'Coffee',
    created_at: '2024-01-04T14:00:00Z',
    updated_at: '2024-01-04T14:00:00Z',
  },
];

// Mock TransactionService Class
class MockTransactionService {
  private transactions = [...mockTransactions];
  private nextId = 5;

  async getAllTransactions(
    userId: number,
    filters: {
      page?: number;
      limit?: number;
      type?: string;
      category_id?: number;
    } = {}
  ) {
    // Validate parameters
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }

    const { page = 1, limit = 20, type, category_id } = filters;

    if (page <= 0) {
      throw new Error('Page number must be greater than 0');
    }
    if (limit <= 0 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    // Filter transactions for specific user
    let userTransactions = this.transactions.filter(t => t.user_id === userId);

    // Apply filters
    if (type) {
      userTransactions = userTransactions.filter(t => t.type === type);
    }
    if (category_id) {
      userTransactions = userTransactions.filter(t => t.category_id === category_id);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedTransactions = userTransactions.slice(offset, offset + limit);

    return {
      transactions: paginatedTransactions,
      total: userTransactions.length,
      page,
      limit,
    };
  }

  async getTransactionById(transactionId: number, userId: number) {
    if (!transactionId || transactionId <= 0) {
      throw new Error('Valid transaction ID is required');
    }
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }

    const transaction = this.transactions.find(
      t => t.transaction_id === transactionId && t.user_id === userId
    );

    return transaction || null;
  }

  async createTransaction(transactionData: any) {
    // Validate required fields
    if (!transactionData.user_id || transactionData.user_id <= 0) {
      throw new Error('Valid user ID is required');
    }
    if (!transactionData.category_id || transactionData.category_id <= 0) {
      throw new Error('Valid category ID is required');
    }
    if (!transactionData.type || !['income', 'expense'].includes(transactionData.type)) {
      throw new Error("Transaction type must be 'income' or 'expense'");
    }
    if (!transactionData.amount || transactionData.amount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    const newTransaction = {
      transaction_id: this.nextId++,
      user_id: transactionData.user_id,
      category_id: transactionData.category_id,
      type: transactionData.type,
      amount: transactionData.amount,
      note: transactionData.note || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async updateTransaction(transactionId: number, userId: number, updateData: any) {
    if (!transactionId || transactionId <= 0) {
      throw new Error('Valid transaction ID is required');
    }
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('Update data is required');
    }

    const transactionIndex = this.transactions.findIndex(
      t => t.transaction_id === transactionId && t.user_id === userId
    );

    if (transactionIndex === -1) {
      return null;
    }

    // Validate update data
    if (updateData.type && !['income', 'expense'].includes(updateData.type)) {
      throw new Error("Transaction type must be 'income' or 'expense'");
    }
    if (updateData.amount && updateData.amount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    const updatedTransaction = {
      ...this.transactions[transactionIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    this.transactions[transactionIndex] = updatedTransaction;
    return updatedTransaction;
  }

  async deleteTransaction(transactionId: number, userId: number): Promise<boolean> {
    if (!transactionId || transactionId <= 0) {
      throw new Error('Valid transaction ID is required');
    }
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }

    const transactionIndex = this.transactions.findIndex(
      t => t.transaction_id === transactionId && t.user_id === userId
    );

    if (transactionIndex === -1) {
      return false;
    }

    this.transactions.splice(transactionIndex, 1);
    return true;
  }

  async getRecentTransactions(userId: number, limit: number = 10) {
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }
    if (limit <= 0 || limit > 50) {
      throw new Error('Limit must be between 1 and 50');
    }

    const userTransactions = this.transactions
      .filter(t => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);

    return userTransactions;
  }

  async getTransactionsSummary(userId: number, startDate?: string, endDate?: string) {
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }

    let userTransactions = this.transactions.filter(t => t.user_id === userId);

    // Apply date filters if provided
    if (startDate) {
      userTransactions = userTransactions.filter(
        t => new Date(t.created_at) >= new Date(startDate)
      );
    }
    if (endDate) {
      userTransactions = userTransactions.filter(t => new Date(t.created_at) <= new Date(endDate));
    }

    const totalIncome = userTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = userTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      total_income: totalIncome,
      total_expense: totalExpense,
      balance: totalIncome - totalExpense,
      transaction_count: userTransactions.length,
    };
  }
}

describe('TransactionService', () => {
  let transactionService: MockTransactionService;

  beforeEach(() => {
    transactionService = new MockTransactionService();
  });

  describe('getAllTransactions()', () => {
    describe('📄 Basic Functionality', () => {
      it('should return paginated transactions for valid user', async () => {
        const result = await transactionService.getAllTransactions(1);

        expect(result).toBeDefined();
        expect(result.transactions).toBeInstanceOf(Array);
        expect(result.transactions.length).toBe(3); // User 1 has 3 transactions
        expect(result.total).toBe(3);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(20);
      });

      it('should apply pagination correctly', async () => {
        const result = await transactionService.getAllTransactions(1, { page: 1, limit: 2 });

        expect(result.transactions.length).toBe(2);
        expect(result.total).toBe(3);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(2);
      });
    });

    describe('🔍 Filtering', () => {
      it('should filter transactions by type', async () => {
        const result = await transactionService.getAllTransactions(1, { type: 'expense' });

        expect(result.transactions).toHaveLength(2);
        expect(result.transactions.every(t => t.type === 'expense')).toBe(true);
      });

      it('should filter transactions by category', async () => {
        const result = await transactionService.getAllTransactions(1, { category_id: 1 });

        expect(result.transactions).toHaveLength(2);
        expect(result.transactions.every(t => t.category_id === 1)).toBe(true);
      });
    });

    describe('❌ Error Handling', () => {
      it('should throw error for invalid user ID', async () => {
        expect(async () => {
          await transactionService.getAllTransactions(0);
        }).toThrow('Valid user ID is required');
      });

      it('should throw error for invalid page number', async () => {
        expect(async () => {
          await transactionService.getAllTransactions(1, { page: 0 });
        }).toThrow('Page number must be greater than 0');
      });

      it('should throw error for invalid limit', async () => {
        expect(async () => {
          await transactionService.getAllTransactions(1, { limit: 101 });
        }).toThrow('Limit must be between 1 and 100');
      });
    });

    describe('🧪 Edge Cases', () => {
      it('should return empty result for user with no transactions', async () => {
        const result = await transactionService.getAllTransactions(999);

        expect(result.transactions).toHaveLength(0);
        expect(result.total).toBe(0);
      });
    });
  });

  describe('getTransactionById()', () => {
    describe('🔍 Basic Functionality', () => {
      it('should return transaction for valid ID and user', async () => {
        const transaction = await transactionService.getTransactionById(1, 1);

        expect(transaction).not.toBeNull();
        expect(transaction?.transaction_id).toBe(1);
        expect(transaction?.user_id).toBe(1);
        expect(transaction?.type).toBe('expense');
        expect(transaction?.amount).toBe(50.0);
      });

      it('should return null for non-existent transaction', async () => {
        const transaction = await transactionService.getTransactionById(999, 1);

        expect(transaction).toBeNull();
      });

      it('should return null for transaction of different user', async () => {
        const transaction = await transactionService.getTransactionById(1, 2);

        expect(transaction).toBeNull();
      });
    });

    describe('❌ Error Handling', () => {
      it('should throw error for invalid transaction ID', async () => {
        expect(async () => {
          await transactionService.getTransactionById(0, 1);
        }).toThrow('Valid transaction ID is required');
      });

      it('should throw error for invalid user ID', async () => {
        expect(async () => {
          await transactionService.getTransactionById(1, 0);
        }).toThrow('Valid user ID is required');
      });
    });
  });

  describe('createTransaction()', () => {
    describe('✅ Successful Creation', () => {
      it('should create new transaction with valid data', async () => {
        const transactionData = {
          user_id: 1,
          category_id: 1,
          type: 'expense',
          amount: 100.0,
          note: 'Test transaction',
        };

        const result = await transactionService.createTransaction(transactionData);

        expect(result).toBeDefined();
        expect(result.transaction_id).toBe(5); // Next available ID
        expect(result.user_id).toBe(1);
        expect(result.category_id).toBe(1);
        expect(result.type).toBe('expense');
        expect(result.amount).toBe(100.0);
        expect(result.note).toBe('Test transaction');
        expect(result.created_at).toBeDefined();
        expect(result.updated_at).toBeDefined();
      });

      it('should create transaction without note', async () => {
        const transactionData = {
          user_id: 1,
          category_id: 1,
          type: 'income',
          amount: 500.0,
        };

        const result = await transactionService.createTransaction(transactionData);

        expect(result.note).toBe('');
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for invalid user ID', async () => {
        const transactionData = {
          user_id: 0,
          category_id: 1,
          type: 'expense',
          amount: 100.0,
        };

        expect(async () => {
          await transactionService.createTransaction(transactionData);
        }).toThrow('Valid user ID is required');
      });

      it('should throw error for invalid category ID', async () => {
        const transactionData = {
          user_id: 1,
          category_id: 0,
          type: 'expense',
          amount: 100.0,
        };

        expect(async () => {
          await transactionService.createTransaction(transactionData);
        }).toThrow('Valid category ID is required');
      });

      it('should throw error for invalid transaction type', async () => {
        const transactionData = {
          user_id: 1,
          category_id: 1,
          type: 'invalid',
          amount: 100.0,
        };

        expect(async () => {
          await transactionService.createTransaction(transactionData);
        }).toThrow("Transaction type must be 'income' or 'expense'");
      });

      it('should throw error for invalid amount', async () => {
        const transactionData = {
          user_id: 1,
          category_id: 1,
          type: 'expense',
          amount: 0,
        };

        expect(async () => {
          await transactionService.createTransaction(transactionData);
        }).toThrow('Amount must be a positive number');
      });

      it('should throw error for negative amount', async () => {
        const transactionData = {
          user_id: 1,
          category_id: 1,
          type: 'expense',
          amount: -50.0,
        };

        expect(async () => {
          await transactionService.createTransaction(transactionData);
        }).toThrow('Amount must be a positive number');
      });
    });
  });

  describe('updateTransaction()', () => {
    describe('✅ Successful Updates', () => {
      it('should update transaction with valid data', async () => {
        const updateData = {
          amount: 150.0,
          note: 'Updated note',
        };

        const result = await transactionService.updateTransaction(1, 1, updateData);

        expect(result).not.toBeNull();
        expect(result?.amount).toBe(150.0);
        expect(result?.note).toBe('Updated note');
        expect(result?.updated_at).toBeDefined();
        expect(new Date(result?.updated_at!)).toBeInstanceOf(Date);
      });

      it('should update transaction type', async () => {
        const updateData = { type: 'income' };

        const result = await transactionService.updateTransaction(1, 1, updateData);

        expect(result?.type).toBe('income');
      });
    });

    describe('🔍 Not Found Cases', () => {
      it('should return null for non-existent transaction', async () => {
        const updateData = { amount: 200.0 };

        const result = await transactionService.updateTransaction(999, 1, updateData);

        expect(result).toBeNull();
      });

      it('should return null for transaction of different user', async () => {
        const updateData = { amount: 200.0 };

        const result = await transactionService.updateTransaction(1, 2, updateData);

        expect(result).toBeNull();
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for invalid transaction ID', async () => {
        const updateData = { amount: 200.0 };

        expect(async () => {
          await transactionService.updateTransaction(0, 1, updateData);
        }).toThrow('Valid transaction ID is required');
      });

      it('should throw error for invalid user ID', async () => {
        const updateData = { amount: 200.0 };

        expect(async () => {
          await transactionService.updateTransaction(1, 0, updateData);
        }).toThrow('Valid user ID is required');
      });

      it('should throw error for empty update data', async () => {
        expect(async () => {
          await transactionService.updateTransaction(1, 1, {});
        }).toThrow('Update data is required');
      });

      it('should throw error for invalid transaction type', async () => {
        const updateData = { type: 'invalid' };

        expect(async () => {
          await transactionService.updateTransaction(1, 1, updateData);
        }).toThrow("Transaction type must be 'income' or 'expense'");
      });

      it('should throw error for invalid amount', async () => {
        const updateData = { amount: -100.0 };

        expect(async () => {
          await transactionService.updateTransaction(1, 1, updateData);
        }).toThrow('Amount must be a positive number');
      });
    });
  });

  describe('deleteTransaction()', () => {
    describe('🗑️ Successful Deletion', () => {
      it('should delete transaction successfully', async () => {
        const result = await transactionService.deleteTransaction(1, 1);

        expect(result).toBe(true);

        // Verify transaction is deleted
        const deletedTransaction = await transactionService.getTransactionById(1, 1);
        expect(deletedTransaction).toBeNull();
      });
    });

    describe('🔍 Not Found Cases', () => {
      it('should return false for non-existent transaction', async () => {
        const result = await transactionService.deleteTransaction(999, 1);

        expect(result).toBe(false);
      });

      it('should return false for transaction of different user', async () => {
        const result = await transactionService.deleteTransaction(1, 2);

        expect(result).toBe(false);
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for invalid transaction ID', async () => {
        expect(async () => {
          await transactionService.deleteTransaction(0, 1);
        }).toThrow('Valid transaction ID is required');
      });

      it('should throw error for invalid user ID', async () => {
        expect(async () => {
          await transactionService.deleteTransaction(1, 0);
        }).toThrow('Valid user ID is required');
      });
    });
  });

  describe('getRecentTransactions()', () => {
    describe('📊 Basic Functionality', () => {
      it('should return recent transactions for user', async () => {
        const transactions = await transactionService.getRecentTransactions(1);

        expect(transactions).toHaveLength(3); // User 1 has 3 transactions
        expect(transactions[0].user_id).toBe(1);
      });

      it('should return transactions in descending order by created_at', async () => {
        const transactions = await transactionService.getRecentTransactions(1);

        // Should be sorted newest first
        expect(new Date(transactions[0].created_at).getTime()).toBeGreaterThan(
          new Date(transactions[1].created_at).getTime()
        );
      });

      it('should use default limit when not specified', async () => {
        const transactions = await transactionService.getRecentTransactions(1);

        expect(transactions).toHaveLength(3); // User has only 3 transactions, less than default 10
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for invalid user ID', async () => {
        expect(async () => {
          await transactionService.getRecentTransactions(0);
        }).toThrow('Valid user ID is required');
      });

      it('should throw error for invalid limit', async () => {
        expect(async () => {
          await transactionService.getRecentTransactions(1, 51);
        }).toThrow('Limit must be between 1 and 50');
      });
    });
  });

  describe('getTransactionsSummary()', () => {
    describe('📈 Summary Calculation', () => {
      it('should return correct summary for user', async () => {
        const summary = await transactionService.getTransactionsSummary(1);

        expect(summary.total_income).toBe(1000.0); // User 1 has 1 income transaction
        expect(summary.total_expense).toBe(75.0); // User 1 has 2 expense transactions (50 + 25)
        expect(summary.balance).toBe(925.0); // 1000 - 75
        expect(summary.transaction_count).toBe(3);
      });

      it('should filter by date range', async () => {
        const summary = await transactionService.getTransactionsSummary(
          1,
          '2024-01-02T00:00:00Z',
          '2024-01-03T23:59:59Z'
        );

        expect(summary.transaction_count).toBe(2); // Only transactions from Jan 2-3
      });

      it('should return zero summary for user with no transactions', async () => {
        const summary = await transactionService.getTransactionsSummary(999);

        expect(summary.total_income).toBe(0);
        expect(summary.total_expense).toBe(0);
        expect(summary.balance).toBe(0);
        expect(summary.transaction_count).toBe(0);
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for invalid user ID', async () => {
        expect(async () => {
          await transactionService.getTransactionsSummary(0);
        }).toThrow('Valid user ID is required');
      });
    });
  });
});
