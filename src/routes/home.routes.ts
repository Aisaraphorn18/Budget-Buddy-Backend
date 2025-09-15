/**
 * Home & Analytics Routes
 * 
 * Defines HTTP endpoints for dashboard and analytics functionality in Budget Buddy.
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

import { Elysia, t } from "elysia";
import { HomeController } from "../controllers/home.controller";

const homeController = new HomeController();

export const homeRoutes = new Elysia({ prefix: "/api/v1" })
  // Home dashboard endpoint
  .get("/home",
    async (context) => await homeController.getHomeData(context),
    {
      detail: {
        tags: ["Home & Analytics"],
        summary: "Get home dashboard data",
        description: "Retrieve username, financial summary, budget overview, and recent transactions",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  
  // Recent transactions endpoint
  .get("/recent-transactions",
    async (context) => await homeController.getRecentTransactions(context),
    {
      query: t.Object({
        limit: t.Optional(t.String())
      }),
      detail: {
        tags: ["Home & Analytics"],
        summary: "Get recent transactions",
        description: "Retrieve latest transactions (default limit: 10)",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  
  // Analytics summary endpoint
  .get("/analytics/summary",
    async (context) => await homeController.getAnalyticsSummary(context),
    {
      query: t.Object({
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String())
      }),
      detail: {
        tags: ["Home & Analytics"],
        summary: "Get analytics summary",
        description: "Get income, expense, and balance summary for a date range",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  
  // Analytics by category endpoint
  .get("/analytics/by-category",
    async (context) => await homeController.getAnalyticsByCategory(context),
    {
      query: t.Object({
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String())
      }),
      detail: {
        tags: ["Home & Analytics"],
        summary: "Get analytics by category",
        description: "Get income/expense breakdown by category",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  
  // Analytics flow endpoint
  .get("/analytics/flow",
    async (context) => await homeController.getAnalyticsFlow(context),
    {
      query: t.Object({
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String()),
        group_by: t.Optional(t.String())
      }),
      detail: {
        tags: ["Home & Analytics"],
        summary: "Get analytics flow",
        description: "Get financial flow timeline (daily/monthly grouping for charts)",
        security: [{ bearerAuth: [] }]
      }
    }
  );