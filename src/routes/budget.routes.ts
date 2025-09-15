/**
 * Budget Routes
 * 
 * Defines HTTP endpoints for budget management in Budget Buddy.
 * All budget routes are protected and require JWT authentication.
 * Budgets help users set spending limits for different categories
 * and track their financial goals over monthly cycles.
 * 
 * Routes:
 * - POST /api/v1/budgets - Create new budget
 * - GET /api/v1/budgets - Get budgets with filtering
 * - GET /api/v1/budgets/:id - Get specific budget by ID
 * - PATCH /api/v1/budgets/:id - Update existing budget
 * - DELETE /api/v1/budgets/:id - Delete budget
 * 
 * Features:
 * - JWT authentication required for all endpoints
 * - Input validation with Elysia schemas
 * - Monthly budget cycle management (YYYY-MM format)
 * - Category-based budget filtering
 * - User-scoped access control (users can only access their own budgets)
 * - Duplicate prevention (one budget per category per month)
 * - OpenAPI documentation integration
 * - Proper HTTP status codes and error handling
 * 
 * Security:
 * - Bearer token authentication on all endpoints
 * - User isolation (budget ownership validation)
 * - Input sanitization and type validation
 * - Protection against unauthorized access
 * 
 * Business Rules:
 * - Each user can have one budget per category per month
 * - Budget amounts must be positive values
 * - Budget cycles are monthly-based for consistent tracking
 */

import { Elysia, t } from "elysia";
import { BudgetController } from "../controllers/budget.controller";
import { CreateBudgetSchema, UpdateBudgetSchema } from "../schemas/api.schema";

const budgetController = new BudgetController();

export const budgetRoutes = new Elysia({ prefix: "/api/v1/budgets" })
  // Create new budget endpoint
  .post("/",
    async (context) => await budgetController.createBudget(context),
    {
      body: CreateBudgetSchema,
      detail: {
        tags: ["Budgets"],
        summary: "Create new budget",
        description: "Set a budget for a category and month (unique constraint)",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  
  // Get all budgets with filtering endpoint
  .get("/",
    async (context) => await budgetController.getAllBudgets(context),
    {
      query: t.Object({
        cycle_month: t.Optional(t.String()),
        category_id: t.Optional(t.String())
      }),
      detail: {
        tags: ["Budgets"],
        summary: "Get all budgets",
        description: "Retrieve budgets with optional filters",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  
  // Get specific budget by ID endpoint
  .get("/:id",
    async (context) => await budgetController.getBudgetById(context),
    {
      detail: {
        tags: ["Budgets"],
        summary: "Get budget by ID",
        description: "Retrieve a specific budget",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  
  // Update existing budget endpoint
  .patch("/:id",
    async (context) => await budgetController.updateBudget(context),
    {
      body: UpdateBudgetSchema,
      detail: {
        tags: ["Budgets"],
        summary: "Update budget",
        description: "Modify an existing budget",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  
  // Delete budget endpoint
  .delete("/:id",
    async (context) => await budgetController.deleteBudget(context),
    {
      detail: {
        tags: ["Budgets"],
        summary: "Delete budget",
        description: "Remove a budget",
        security: [{ bearerAuth: [] }]
      }
    }
  );