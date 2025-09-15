import { Elysia, t } from "elysia";
import { TransactionController } from "../controllers/transaction.controller";
import { CreateTransactionSchema, UpdateTransactionSchema } from "../schemas/api.schema";

const transactionController = new TransactionController();

export const transactionRoutes = new Elysia({ prefix: "/api/v1/transactions" })
  .post("/",
    async (context) => await transactionController.createTransaction(context),
    {
      body: CreateTransactionSchema,
      detail: {
        tags: ["Transactions"],
        summary: "Create new transaction",
        description: "Add a new income or expense transaction",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .get("/",
    async (context) => await transactionController.getAllTransactions(context),
    {
      query: t.Object({
        type: t.Optional(t.Union([t.Literal('income'), t.Literal('expense')])),
        category_id: t.Optional(t.String()),
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String())
      }),
      detail: {
        tags: ["Transactions"],
        summary: "Get all transactions",
        description: "Retrieve transactions with optional filters and pagination",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .get("/:id",
    async (context) => await transactionController.getTransactionById(context),
    {
      detail: {
        tags: ["Transactions"],
        summary: "Get transaction by ID",
        description: "Retrieve a specific transaction",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .patch("/:id",
    async (context) => await transactionController.updateTransaction(context),
    {
      body: UpdateTransactionSchema,
      detail: {
        tags: ["Transactions"],
        summary: "Update transaction",
        description: "Modify an existing transaction",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .delete("/:id",
    async (context) => await transactionController.deleteTransaction(context),
    {
      detail: {
        tags: ["Transactions"],
        summary: "Delete transaction",
        description: "Remove a transaction",
        security: [{ bearerAuth: [] }]
      }
    }
  );