/**
 * Home & Analytics Routes
 *
 * Defines HTTP en        return await homeController.getHomeData(withAuth(context));
      } catch (error) {
        console.error('Error in get home data route:', error);i        return await homeController.getHomeDataByUserId(withAuth(context));
      } catch (error) {
        console.error('Error in get home data by user ID route:', error); for dashboard and analytics functionality in Budget Buddy.
 * All home routes are protected and require JWT authentication.
 * These endpoints provide comprehensive financial insights, summaries,
 * and dashboard data to help users understand their financial situation.
 *
 * Routes:
 * - GET /api/v1/home - Get complete dashboard data
 * - GET /api/v1/recent-transactions - Get recent transaction history
 * - GET /api/v1/analytics/summary - Get financial summary analytics
 * - GET /api/v1/analytics/by-category - Get category-based spending analysis
 * - GET /api/v1/analytics/flow - Get cash flow analytics and trends
 *
 * Features:
 * - JWT authentication required for all endpoints
 * - Multi-service data aggregation (user, transactions, budgets)
 * - Real-time financial calculations and insights
 * - Category-based spending breakdown
 * - Monthly financial summaries and trends
 * - Budget vs actual spending comparisons
 * - Optimized queries for dashboard performance
 * - OpenAPI documentation integration
 *
 * Analytics Capabilities:
 * - Total income/expense calculations
 * - Budget progress tracking
 * - Spending pattern analysis
 * - Financial goal monitoring
 * - Category-wise transaction summaries
 * - Cash flow trend analysis
 *
 * Security:
 * - Bearer token authentication on all endpoints
 * - User-scoped data access only
 * - Aggregated data presentation for privacy
 * - No sensitive data exposure in analytics
 */

import { Elysia, t } from 'elysia';
import { HomeController } from '../controllers/home.controller';
import { withAuth } from '../types/elysia.types';

const homeController = new HomeController();

export const homeRoutes = new Elysia({ prefix: '/api/v1' })
  // Home dashboard endpoint
  .get(
    '/home',
    async context => {
      try {
        return await homeController.getHomeData(withAuth(context));
      } catch (error) {
        console.error('Error in home data route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve home data',
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ['Home & Analytics'],
        summary: 'Get home dashboard data',
        description:
          'Retrieve username, financial summary, budget overview, and recent transactions',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // Recent transactions endpoint
  .get(
    '/recent-transactions',
    async context => {
      try {
        return await homeController.getRecentTransactions(withAuth(context));
      } catch (error) {
        console.error('Error in recent transactions route:', error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : 'Failed to retrieve recent transactions',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Home & Analytics'],
        summary: 'Get recent transactions',
        description: 'Retrieve latest transactions (default limit: 10)',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // Analytics summary endpoint
  .get(
    '/analytics/summary',
    async context => {
      try {
        return await homeController.getAnalyticsSummary(withAuth(context));
      } catch (error) {
        console.error('Error in analytics summary route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve analytics summary',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Home & Analytics'],
        summary: 'Get analytics summary',
        description: 'Get income, expense, and balance summary for a date range',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // Analytics by category endpoint
  .get(
    '/analytics/by-category',
    async context => {
      try {
        return await homeController.getAnalyticsByCategory(withAuth(context));
      } catch (error) {
        console.error('Error in analytics by category route:', error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : 'Failed to retrieve analytics by category',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Home & Analytics'],
        summary: 'Get analytics by category',
        description: 'Get income/expense breakdown by category',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // Analytics flow endpoint
  .get(
    '/analytics/flow',
    async context => {
      try {
        return await homeController.getAnalyticsFlow(withAuth(context));
      } catch (error) {
        console.error('Error in analytics flow route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve analytics flow',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String()),
        group_by: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Home & Analytics'],
        summary: 'Get analytics flow',
        description: 'Get financial flow timeline (daily/monthly grouping for charts)',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // Admin endpoints - Get data by user ID
  .get(
    '/home/user/:user_id',
    async context => {
      try {
        // Validate user_id parameter
        const userId = context.params.user_id;
        if (!userId || userId.trim() === '') {
          return {
            success: false,
            message: 'Invalid user ID. User ID is required.',
            data: null,
          };
        }
        return await homeController.getHomeDataByUserId(withAuth(context));
      } catch (error) {
        console.error('Error in home data by user ID route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve home data',
          data: null,
        };
      }
    },
    {
      params: t.Object({
        user_id: t.String({ description: 'User ID to get home data for' }),
      }),
      detail: {
        tags: ['Home & Analytics'],
        summary: 'Get home dashboard data by user ID',
        description:
          'Retrieve username, financial summary, budget overview, and recent transactions for specific user (admin only)',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  .get(
    '/recent-transactions/user/:user_id',
    async context => {
      try {
        // Validate user_id parameter
        const userId = context.params.user_id;
        if (!userId || userId.trim() === '') {
          return {
            success: false,
            message: 'Invalid user ID. User ID is required.',
            data: null,
          };
        }
        return await homeController.getRecentTransactionsByUserId(withAuth(context));
      } catch (error) {
        console.error('Error in recent transactions by user ID route:', error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : 'Failed to retrieve recent transactions',
          data: null,
        };
      }
    },
    {
      params: t.Object({
        user_id: t.String({ description: 'User ID to get transactions for' }),
      }),
      query: t.Object({
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Home & Analytics'],
        summary: 'Get recent transactions by user ID',
        description: 'Retrieve latest transactions for specific user (admin only)',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  .get(
    '/analytics/summary/user/:user_id',
    async context => {
      try {
        const userId = context.params.user_id;
        if (!userId || userId.trim() === '') {
          return { success: false, message: 'Invalid user ID. User ID is required.', data: null };
        }
        return await homeController.getAnalyticsSummaryByUserId(withAuth(context));
      } catch (error) {
        console.error('Error in analytics summary by user ID route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve analytics summary',
          data: null,
        };
      }
    },
    {
      params: t.Object({
        user_id: t.String({ description: 'User ID to get analytics for' }),
      }),
      query: t.Object({
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Home & Analytics'],
        summary: 'Get analytics summary by user ID',
        description: 'Get income, expense, and balance summary for specific user (admin only)',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  .get(
    '/analytics/by-category/user/:user_id',
    async context => {
      try {
        const userId = context.params.user_id;
        if (!userId || userId.trim() === '') {
          return { success: false, message: 'Invalid user ID. User ID is required.', data: null };
        }
        return await homeController.getAnalyticsByCategoryByUserId(withAuth(context));
      } catch (error) {
        console.error('Error in analytics by category by user ID route:', error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : 'Failed to retrieve analytics by category',
          data: null,
        };
      }
    },
    {
      params: t.Object({
        user_id: t.String({ description: 'User ID to get analytics for' }),
      }),
      query: t.Object({
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Home & Analytics'],
        summary: 'Get analytics by category by user ID',
        description: 'Get income/expense breakdown by category for specific user (admin only)',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  .get(
    '/analytics/flow/user/:user_id',
    async context => {
      try {
        const userId = context.params.user_id;
        if (!userId || userId.trim() === '') {
          return { success: false, message: 'Invalid user ID. User ID is required.', data: null };
        }
        return await homeController.getAnalyticsFlowByUserId(withAuth(context));
      } catch (error) {
        console.error('Error in analytics flow by user ID route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve analytics flow',
          data: null,
        };
      }
    },
    {
      params: t.Object({
        user_id: t.String({ description: 'User ID to get analytics for' }),
      }),
      query: t.Object({
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String()),
        group_by: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Home & Analytics'],
        summary: 'Get analytics flow by user ID',
        description: 'Get financial flow timeline for specific user (admin only)',
        security: [{ bearerAuth: [] }],
      },
    }
  );
