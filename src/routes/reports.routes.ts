/**
 * Reports & Analytics Routes
 *
 * Defines HTTP endpoints for reports and analytics functionality in Budget Buddy.
 * All reports routes are protected and require JWT authentication.
 * These endpoints provide comprehensive financial reports and analytics.
 *
 * Routes:
 * - GET /reports/summary - Get financial summary report
 * - GET /reports/recent-transactions - Get recent transactions report
 * - GET /reports/income-vs-expense - Get income vs expense analysis
 * - GET /reports/expenses-by-category - Get expenses breakdown by category
 * - GET /reports/monthly-close - Get monthly financial close report
 *
 * Features:
 * - JWT authentication required for all endpoints
 * - User-scoped data access (own data + admin can access any user)
 * - Monthly/yearly period filtering
 * - Comprehensive financial analytics
 * - Budget vs actual comparisons
 *
 * Security:
 * - Bearer token authentication on all endpoints
 * - User isolation (users can only access their own data unless admin)
 * - Input sanitization and type validation
 */

import { Elysia, t } from 'elysia';
import { ReportsController } from '../controllers/reports.controller';
import { withAuth } from '../types/elysia.types';
import logger from '../utils/logger';

const reportsController = new ReportsController();

export const reportsRoutes = new Elysia({ prefix: '/api/v1/reports' })
  // Financial summary report
  .get(
    '/summary',
    async context => {
      try {
        return await reportsController.getSummaryReport(withAuth(context));
      } catch (error) {
        logger.error('Error in summary report route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve summary report',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        month: t.Optional(t.String({ pattern: '^\\d{4}-\\d{2}$' })), // YYYY-MM format
        user_id: t.Optional(t.String()), // Admin can specify user_id
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get financial summary report',
        description: 'Retrieve total income, total expense, and balance for specified month',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // Recent transactions report
  .get(
    '/recent-transactions',
    async context => {
      try {
        return await reportsController.getRecentTransactionsReport(withAuth(context));
      } catch (error) {
        logger.error('Error in recent transactions report route:', error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to retrieve recent transactions report',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()), // Default 10
        user_id: t.Optional(t.String()), // Admin can specify user_id
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get recent transactions report',
        description:
          'Retrieve list of recent transactions with transaction_id, category_name, type, amount, date, note',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // Income vs Expense analysis
  .get(
    '/income-vs-expense',
    async context => {
      try {
        return await reportsController.getIncomeVsExpenseReport(withAuth(context));
      } catch (error) {
        logger.error('Error in income vs expense report route:', error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : 'Failed to retrieve income vs expense report',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        period: t.Optional(t.String()), // year&year=YYYY หรือ month&month=YYYY-MM
        year: t.Optional(t.String({ pattern: '^\\d{4}$' })),
        month: t.Optional(t.String({ pattern: '^\\d{4}-\\d{2}$' })),
        user_id: t.Optional(t.String()), // Admin can specify user_id
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get income vs expense analysis',
        description: 'Retrieve comparative analysis of income vs expense with labels and amounts',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // Expenses by category breakdown
  .get(
    '/expenses-by-category',
    async context => {
      try {
        return await reportsController.getExpensesByCategoryReport(withAuth(context));
      } catch (error) {
        logger.error('Error in expenses by category report route:', error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to retrieve expenses by category report',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        month: t.Optional(t.String({ pattern: '^\\d{4}-\\d{2}$' })), // YYYY-MM format
        user_id: t.Optional(t.String()), // Admin can specify user_id
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get expenses breakdown by category',
        description:
          'Retrieve expenses analysis grouped by category with category_id, category_name, amount, and percentage',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // Monthly close report
  .get(
    '/monthly-close',
    async context => {
      try {
        return await reportsController.getMonthlyCloseReport(withAuth(context));
      } catch (error) {
        logger.error('Error in monthly close report route:', error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : 'Failed to retrieve monthly close report',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        month: t.Optional(t.String({ pattern: '^\\d{4}-\\d{2}$' })), // YYYY-MM format
        user_id: t.Optional(t.String()), // Admin can specify user_id
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get monthly financial close report',
        description:
          'Retrieve comprehensive monthly summary including month, total_income, total_expense, and net_balance',
        security: [{ bearerAuth: [] }],
      },
    }
  );
