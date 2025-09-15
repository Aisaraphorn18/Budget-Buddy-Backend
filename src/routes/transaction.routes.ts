/**
 * Transaction Routes
 * 
 * Defines HTTP endpoints for financial transaction management in Budget Buddy.
 * All transaction routes are protected and require JWT authentication.
 * Transactions are the core of the personal finance system, recording all
 * income and expense activities with proper categorization and tracking.
 * 
 * Routes:
 * - POST /api/v1/transactions - Create new transaction
 * - GET /api/v1/transactions - Get transactions with filtering and pagination
 * - GET /api/v1/transactions/:id - Get specific transaction by ID
 * - PATCH /api/v1/transactions/:id - Update existing transaction
 * - DELETE /api/v1/transactions/:id - Delete transaction
 * 
 * Features:
 * - JWT authentication required for all endpoints
 * - Input validation with Elysia schemas
 * - Advanced filtering (type, category, date range, amount)
 * - Pagination support for large datasets
 * - User-scoped access control (users can only access their own transactions)
 * - OpenAPI documentation integration
 * - Proper HTTP status codes and error handling
 * 
 * Security:
 * - Bearer token authentication on all endpoints
 * - User isolation (transaction ownership validation)
 * - Input sanitization and type validation
 * - Protection against unauthorized access
 */

import { Elysia, t } from "elysia";
import { TransactionController } from "../controllers/transaction.controller";
import { CreateTransactionSchema, UpdateTransactionSchema } from "../schemas/api.schema";

const transactionController = new TransactionController();

export const transactionRoutes = new Elysia({ prefix: "/api/v1/transactions" })
  // Create new transaction endpoint
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
  
  // Get all transactions with filtering endpoint
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
  
  // Get specific transaction by ID endpoint
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
  
  // Update existing transaction endpoint
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
  
  // Delete transaction endpoint
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