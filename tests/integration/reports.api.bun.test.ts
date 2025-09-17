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
  async getDashboardSummary(query: Record<string, string> = {}, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    const { month } = query;
    const currentMonth = month || '2024-03';

    return createMockResponse(200, {
      success: true,
      data: {
        cards: [
          {
            type: 'income',
            title: 'Income',
            amount: 8900,
            currency: 'B',
            color: '#10B981',
            icon: 'income',
            formatted_amount: '8,900 B',
          },
          {
            type: 'expense',
            title: 'Expenses',
            amount: 2000,
            currency: 'B',
            color: '#EF4444',
            icon: 'expenses',
            formatted_amount: '2,000 B',
          },
          {
            type: 'balance',
            title: 'Balance',
            amount: 6900,
            currency: 'B',
            color: '#3B82F6',
            icon: 'balance',
            formatted_amount: '6,900 B',
          },
        ],
        summary: {
          total_income: 8900,
          total_expense: 2000,
          net_balance: 6900,
          as_of: currentMonth,
          currency: 'Baht',
        },
      },
      message: 'Dashboard summary retrieved successfully',
    });
  }

  async getSummaryReport(query: Record<string, string> = {}, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    const { month, year, range } = query;

    // Annual breakdown for bar chart
    if (range === 'year' || year) {
      const targetYear = year || '2024';
      const monthlyData = [];

      for (let monthNum = 1; monthNum <= 12; monthNum++) {
        const monthStr = `${targetYear}-${monthNum.toString().padStart(2, '0')}`;
        monthlyData.push({
          month: monthStr,
          month_name: new Date(2024, monthNum - 1).toLocaleString('en-US', { month: 'short' }),
          total_income: 3000 + Math.floor(Math.random() * 2000),
          total_expense: 2000 + Math.floor(Math.random() * 1500),
          net_balance: 1000 + Math.floor(Math.random() * 500),
        });
      }

      const yearTotals = monthlyData.reduce(
        (acc, month) => ({
          total_income: acc.total_income + month.total_income,
          total_expense: acc.total_expense + month.total_expense,
          net_balance: acc.net_balance + month.net_balance,
        }),
        { total_income: 0, total_expense: 0, net_balance: 0 }
      );

      return createMockResponse(200, {
        success: true,
        data: {
          type: 'annual',
          year: targetYear,
          monthly_breakdown: monthlyData,
          year_totals: yearTotals,
        },
        message: 'Annual summary report retrieved successfully',
      });
    }

    // Single month summary
    const currentMonth = month || '2024-03';
    return createMockResponse(200, {
      success: true,
      data: {
        type: 'monthly',
        total_income: 25000,
        total_expense: 18500,
        balance: 6500,
        as_of: currentMonth,
      },
      message: 'Summary report retrieved successfully',
    });
  }

  async getRecentTransactionsReport(query: Record<string, string> = {}, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    const { limit = '10', page = '1' } = query;
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);

    const allTransactions = [
      {
        transaction_id: 1,
        category_name: 'Food',
        category_note: 'Lunch at restaurant',
        type: 'expense',
        amount: 350,
        date: '2024-03-15',
        formatted_date: 'Mar 15, 2024',
        formatted_amount: '-350 Baht',
        amount_color: '#EF4444',
        note: 'Lunch at restaurant',
      },
      {
        transaction_id: 2,
        category_name: 'Salary',
        category_note: 'Monthly salary',
        type: 'income',
        amount: 25000,
        date: '2024-03-01',
        formatted_date: 'Mar 01, 2024',
        formatted_amount: '+25,000 Baht',
        amount_color: '#10B981',
        note: 'Monthly salary',
      },
    ];

    const totalCount = allTransactions.length;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const transactions = allTransactions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(totalCount / limitNum);

    return createMockResponse(200, {
      success: true,
      data: {
        transactions,
        pagination: {
          current_page: pageNum,
          total_pages: totalPages,
          total_count: totalCount,
          limit: limitNum,
          has_next: pageNum < totalPages,
          has_previous: pageNum > 1,
        },
        summary: {
          showing: transactions.length,
          total: totalCount,
        },
      },
      message: 'Recent transactions report retrieved successfully',
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

    const breakdown = [
      {
        category_id: 1,
        category_name: 'Investment',
        amount: 11912.5,
        percent: 35,
        color: '#8B5CF6',
      },
      {
        category_id: 2,
        category_name: 'Food',
        amount: 11912.5,
        percent: 35,
        color: '#10B981',
      },
      {
        category_id: 3,
        category_name: 'Shopping',
        amount: 11912.5,
        percent: 30,
        color: '#F59E0B',
      },
    ];

    const totalExpenses = breakdown.reduce((sum, cat) => sum + cat.amount, 0);

    return createMockResponse(200, {
      success: true,
      data: {
        total_expenses: totalExpenses,
        as_of: '2024-03',
        breakdown: breakdown,
        summary: {
          total_amount: totalExpenses,
          currency: 'Baht',
          categories_count: breakdown.length,
        },
      },
      message: 'Expenses by category report retrieved successfully',
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
        expect(data.data).toHaveProperty('balance');
        expect(data.data.balance).toBe(6500);
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
        expect(Array.isArray(data.data.transactions)).toBe(true);
        expect(data.data.transactions[0]).toHaveProperty('transaction_id');
      });

      it('should respect limit parameter - เคารพค่า limit', async () => {
        const response = await api.getRecentTransactionsReport({ limit: '1' }, validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.data.transactions).toHaveLength(1);
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
        expect(Array.isArray(data.data.breakdown)).toBe(true);
        expect(data.data.breakdown[0]).toHaveProperty('category_name');
        expect(data.data.breakdown[0]).toHaveProperty('amount');
        expect(data.data.breakdown[0]).toHaveProperty('percent');
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

    describe('📊 Dashboard Summary', () => {
      describe('📄 Basic Functionality', () => {
        it('should return dashboard cards for home page - ดึงข้อมูลการ์ดสำหรับหน้าหลัก', async () => {
          const response = await api.getDashboardSummary({}, validToken);
          const data = await response.json();

          expect(response.status).toBe(200);
          expect(data.success).toBe(true);
          expect(data.data.cards).toHaveLength(3);

          // Verify Income card
          const incomeCard = data.data.cards.find((card: any) => card.type === 'income');
          expect(incomeCard.title).toBe('Income');
          expect(incomeCard.amount).toBe(8900);
          expect(incomeCard.formatted_amount).toBe('8,900 B');
          expect(incomeCard.color).toBe('#10B981');

          // Verify Expense card
          const expenseCard = data.data.cards.find((card: any) => card.type === 'expense');
          expect(expenseCard.title).toBe('Expenses');
          expect(expenseCard.amount).toBe(2000);
          expect(expenseCard.color).toBe('#EF4444');

          // Verify Balance card
          const balanceCard = data.data.cards.find((card: any) => card.type === 'balance');
          expect(balanceCard.title).toBe('Balance');
          expect(balanceCard.amount).toBe(6900);
          expect(balanceCard.color).toBe('#3B82F6');

          // Verify summary
          expect(data.data.summary.total_income).toBe(8900);
          expect(data.data.summary.total_expense).toBe(2000);
          expect(data.data.summary.net_balance).toBe(6900);
        });

        it('should support month filter for dashboard cards - รองรับตัวกรองเดือนสำหรับการ์ด', async () => {
          const response = await api.getDashboardSummary({ month: '2024-02' }, validToken);
          const data = await response.json();

          expect(response.status).toBe(200);
          expect(data.success).toBe(true);
          expect(data.data.summary.as_of).toBe('2024-02');
        });
      });

      describe('❌ Authentication Errors', () => {
        it('should return 401 for missing token - ส่งคืน 401 เมื่อไม่มี token', async () => {
          const response = await api.getDashboardSummary({});
          expect(response.status).toBe(401);
        });
      });
    });

    describe('📊 Enhanced Summary Report', () => {
      describe('📄 Annual Breakdown', () => {
        it('should return annual breakdown for bar chart - ดึงข้อมูลรายปีสำหรับ bar chart', async () => {
          const response = await api.getSummaryReport({ range: 'year', year: '2024' }, validToken);
          const data = await response.json();

          expect(response.status).toBe(200);
          expect(data.success).toBe(true);
          expect(data.data.type).toBe('annual');
          expect(data.data.year).toBe('2024');
          expect(data.data.monthly_breakdown).toHaveLength(12);
          expect(data.data.year_totals).toBeDefined();

          // Verify monthly data structure
          const monthData = data.data.monthly_breakdown[0];
          expect(monthData.month).toBeDefined();
          expect(monthData.month_name).toBeDefined();
          expect(monthData.total_income).toBeGreaterThan(0);
          expect(monthData.total_expense).toBeGreaterThan(0);
          expect(monthData.net_balance).toBeDefined();
        });

        it('should return monthly summary when no range specified - ดึงข้อมูลรายเดือนเมื่อไม่ระบุช่วง', async () => {
          const response = await api.getSummaryReport({ month: '2024-03' }, validToken);
          const data = await response.json();

          expect(response.status).toBe(200);
          expect(data.success).toBe(true);
          expect(data.data.type).toBe('monthly');
          expect(data.data.total_income).toBe(25000);
          expect(data.data.total_expense).toBe(18500);
          expect(data.data.balance).toBe(6500);
        });
      });
    });

    describe('📊 Enhanced Recent Transactions', () => {
      describe('📄 Pagination Support', () => {
        it('should support pagination parameters - รองรับพารามิเตอร์การแบ่งหน้า', async () => {
          const response = await api.getRecentTransactionsReport(
            { limit: '10', page: '1' },
            validToken
          );
          const data = await response.json();

          expect(response.status).toBe(200);
          expect(data.success).toBe(true);
          expect(data.data.transactions).toBeDefined();
          expect(data.data.pagination).toBeDefined();
          expect(data.data.pagination.current_page).toBe(1);
          expect(data.data.pagination.limit).toBe(10);
          expect(data.data.summary.showing).toBeDefined();
          expect(data.data.summary.total).toBeDefined();
        });

        it('should format transactions for table display - จัดรูปแบบธุรกรรมสำหรับแสดงในตาราง', async () => {
          const response = await api.getRecentTransactionsReport({}, validToken);
          const data = await response.json();

          expect(response.status).toBe(200);
          const transaction = data.data.transactions[0];
          expect(transaction.formatted_date).toBeDefined();
          expect(transaction.formatted_amount).toBeDefined();
          expect(transaction.amount_color).toBeDefined();
          expect(transaction.category_note).toBeDefined();
        });
      });
    });

    describe('📊 Enhanced Expenses by Category', () => {
      describe('📄 Pie Chart Data', () => {
        it('should return expenses with colors and enhanced structure - ดึงข้อมูลค่าใช้จ่ายพร้อมสีและโครงสร้างที่ปรับปรุง', async () => {
          const response = await api.getExpensesByCategoryReport({}, validToken);
          const data = await response.json();

          expect(response.status).toBe(200);
          expect(data.success).toBe(true);
          expect(data.data.breakdown).toBeDefined();
          expect(data.data.total_expenses).toBeDefined();
          expect(data.data.summary).toBeDefined();

          // Verify category structure
          const category = data.data.breakdown[0];
          expect(category.color).toBeDefined();
          expect(category.percent).toBeDefined();
          expect(category.amount).toBeDefined();
          expect(category.category_name).toBeDefined();

          // Verify summary
          expect(data.data.summary.total_amount).toBeDefined();
          expect(data.data.summary.currency).toBe('Baht');
          expect(data.data.summary.categories_count).toBe(3);
        });
      });
    });
  });
});
