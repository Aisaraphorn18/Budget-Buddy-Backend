import { Elysia, t } from "elysia";
import { HomeController } from "../controllers/home.controller";

const homeController = new HomeController();

export const homeRoutes = new Elysia({ prefix: "/api/v1" })
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