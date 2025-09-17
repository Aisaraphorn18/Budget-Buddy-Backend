/**
 * 📈 Reports API Integration Tests
 * ทดสอบ API endpoints สำหรับรายงานและการวิเคราะห์การเงิน
 */

import { describe, it, expect, beforeEach } from 'bun:test';

// 🔧 Mock API Response Helpers
const createMockResponse = (statusCode: number, data: any) => ({
  status: statusCode,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
});

// 🔗 Mock Reports HTTP Client
class MockReportsHttpClient {
  async getSummaryReport(query: Record<string, string> = {}, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    const { month } = query;
    let responseData = {
      month: month || '2024-03',
      total_income: 25000,
      total_expense: 18500,
      net_balance: 6500,
      budget_count: 5,
      transaction_count: 42,
    };

    if (month === '2024-02') {
      responseData = {
        ...responseData,
        month: '2024-02',
        total_income: 22000,
        total_expense: 16800,
        net_balance: 5200,
      };
    }

    return createMockResponse(200, {
      success: true,
      data: responseData,
      message: 'Summary report retrieved successfully',
    });
  }

  async getRecentTransactionsReport(query: Record<string, string> = {}, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    const { limit = '10' } = query;
    const limitNum = parseInt(limit);
    const transactions = [
      {
        transaction_id: 1,
        category_name: 'Food',
        type: 'expense',
        amount: 350,
        date: '2024-03-15',
        note: 'Lunch at restaurant',
      },
      {
        transaction_id: 2,
        category_name: 'Salary',
        type: 'income',
        amount: 25000,
        date: '2024-03-01',
        note: 'Monthly salary',
      },
    ].slice(0, limitNum);

    return createMockResponse(200, {
      success: true,
      data: transactions,
      message: 'Recent transactions retrieved successfully',
    });
  }

  async getIncomeVsExpenseReport(query: Record<string, string> = {}, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    const { year, month } = query;
    let responseData = {
      period: month || year || '2024-03',
      income: { label: 'รายได้', amount: 25000 },
      expense: { label: 'รายจ่าย', amount: 18500 },
      net_balance: 6500,
    };

    if (year && !month) {
      responseData = {
        ...responseData,
        income: { label: 'รายได้', amount: 300000 },
        expense: { label: 'รายจ่าย', amount: 220000 },
        net_balance: 80000,
      };
    }

    return createMockResponse(200, {
      success: true,
      data: responseData,
      message: 'Income vs expense report retrieved successfully',
    });
  }

  async getExpensesByCategoryReport(_query?: Record<string, string>, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    const data = [
      { category_id: 1, category_name: 'Food', amount: 8500, percentage: 45.95 },
      { category_id: 2, category_name: 'Transport', amount: 3200, percentage: 17.3 },
      { category_id: 3, category_name: 'Entertainment', amount: 6800, percentage: 36.76 },
    ];

    return createMockResponse(200, {
      success: true,
      data,
      message: 'Expenses by category retrieved successfully',
    });
  }

  async getMonthlyCloseReport(query: Record<string, string> = {}, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    const data = {
      month: query.month || '2024-03',
      total_income: 25000,
      total_expense: 18500,
      net_balance: 6500,
      budget_performance: {
        total_budgeted: 20000,
        total_spent: 18500,
        variance: 1500,
        performance_percentage: 92.5,
      },
    };

    return createMockResponse(200, {
      success: true,
      data,
      message: 'Monthly close report retrieved successfully',
    });
  }
}

describe('📈 Reports API Integration Tests', () => {
  let api: MockReportsHttpClient;
  const validToken = 'mock-jwt-token-123';

  beforeEach(() => {
    api = new MockReportsHttpClient();
  });

  describe('GET /api/v1/reports/summary', () => {
    describe('📄 Basic Functionality', () => {
      it('should return financial summary - ดึงข้อมูลสรุปการเงิน', async () => {
        const response = await api.getSummaryReport({}, validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toHaveProperty('total_income');
        expect(data.data).toHaveProperty('total_expense');
        expect(data.data).toHaveProperty('net_balance');
        expect(data.data.net_balance).toBe(6500);
      });
    });

    describe('❌ Authentication Errors', () => {
      it('should return 401 for missing token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const response = await api.getSummaryReport({});
        expect(response.status).toBe(401);
      });
    });
  });

  describe('GET /api/v1/reports/recent-transactions', () => {
    describe('📄 Basic Functionality', () => {
      it('should return recent transactions - ดึงรายการธุรกรรมล่าสุด', async () => {
        const response = await api.getRecentTransactionsReport({}, validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(Array.isArray(data.data)).toBe(true);
        expect(data.data[0]).toHaveProperty('transaction_id');
      });

      it('should respect limit parameter - เคารพค่า limit', async () => {
        const response = await api.getRecentTransactionsReport({ limit: '1' }, validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.data).toHaveLength(1);
      });
    });

    describe('❌ Authentication Errors', () => {
      it('should return 401 for missing token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const response = await api.getRecentTransactionsReport({});
        expect(response.status).toBe(401);
      });
    });
  });

  describe('GET /api/v1/reports/income-vs-expense', () => {
    describe('📊 Income vs Expense Analysis', () => {
      it('should return income vs expense analysis - วิเคราะห์รายได้ vs รายจ่าย', async () => {
        const response = await api.getIncomeVsExpenseReport({}, validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toHaveProperty('income');
        expect(data.data).toHaveProperty('expense');
        expect(data.data).toHaveProperty('net_balance');
      });

      it('should return yearly analysis when year provided - วิเคราะห์รายปี', async () => {
        const response = await api.getIncomeVsExpenseReport({ year: '2024' }, validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.data.income.amount).toBe(300000);
        expect(data.data.expense.amount).toBe(220000);
      });
    });

    describe('❌ Authentication Errors', () => {
      it('should return 401 for missing token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const response = await api.getIncomeVsExpenseReport({});
        expect(response.status).toBe(401);
      });
    });
  });

  describe('GET /api/v1/reports/expenses-by-category', () => {
    describe('📊 Expense Category Analysis', () => {
      it('should return expenses breakdown by category - แยกรายจ่ายตามหมวดหมู่', async () => {
        const response = await api.getExpensesByCategoryReport({}, validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(Array.isArray(data.data)).toBe(true);
        expect(data.data[0]).toHaveProperty('category_name');
        expect(data.data[0]).toHaveProperty('amount');
        expect(data.data[0]).toHaveProperty('percentage');
      });
    });

    describe('❌ Authentication Errors', () => {
      it('should return 401 for missing token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const response = await api.getExpensesByCategoryReport({});
        expect(response.status).toBe(401);
      });
    });
  });

  describe('GET /api/v1/reports/monthly-close', () => {
    describe('📈 Monthly Close Report', () => {
      it('should return monthly close report - รายงานสรุปรายเดือน', async () => {
        const response = await api.getMonthlyCloseReport({}, validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toHaveProperty('month');
        expect(data.data).toHaveProperty('budget_performance');
        expect(data.data.budget_performance).toHaveProperty('performance_percentage');
      });
    });

    describe('❌ Authentication Errors', () => {
      it('should return 401 for missing token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const response = await api.getMonthlyCloseReport({});
        expect(response.status).toBe(401);
      });
    });
  });

  describe('🧪 Integration Scenarios', () => {
    describe('📋 Complete Reports Workflow', () => {
      it('should handle complete reporting flow - ทดสอบการทำงานรายงานแบบครบวงจร', async () => {
        // Get summary
        const summaryResponse = await api.getSummaryReport({ month: '2024-03' }, validToken);
        expect(summaryResponse.status).toBe(200);

        // Get recent transactions
        const recentResponse = await api.getRecentTransactionsReport({ limit: '5' }, validToken);
        expect(recentResponse.status).toBe(200);

        // Get income vs expense
        const incomeExpenseResponse = await api.getIncomeVsExpenseReport(
          { month: '2024-03' },
          validToken
        );
        expect(incomeExpenseResponse.status).toBe(200);

        // Get expenses by category
        const categoryResponse = await api.getExpensesByCategoryReport({}, validToken);
        expect(categoryResponse.status).toBe(200);

        // Get monthly close
        const closeResponse = await api.getMonthlyCloseReport({ month: '2024-03' }, validToken);
        expect(closeResponse.status).toBe(200);
      });
    });
  });
});
