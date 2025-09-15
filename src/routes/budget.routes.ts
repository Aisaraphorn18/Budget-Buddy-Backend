import { Elysia, t } from "elysia";
import { BudgetController } from "../controllers/budget.controller";
import { CreateBudgetSchema, UpdateBudgetSchema } from "../schemas/api.schema";

const budgetController = new BudgetController();

export const budgetRoutes = new Elysia({ prefix: "/api/v1/budgets" })
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