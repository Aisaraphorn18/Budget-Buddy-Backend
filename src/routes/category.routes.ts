/**
 * Category Routes
 * 
 * Defines HTTP endpoints for category management in Budget Buddy.
 * Categories are used to organize financial transactions into meaningful
 * groups such as Food, Transportation, Entertainment, etc.
 * 
 * Routes:
 * - GET /protected/api/v1/categories - Get all available categories
 * - GET /protected/api/v1/categories/:id - Get specific category by ID
 * - POST /protected/api/v1/categories - Create new category
 * - PATCH /protected/api/v1/categories/:id - Update existing category
 * - DELETE /protected/api/v1/categories/:id - Delete category
 * 
 * Features:
 * - Protected access (JWT authentication required for all operations)
 * - OpenAPI documentation integration
 * - Consistent response formatting
 * - Error handling for invalid category IDs
 * - Business logic validation (prevent deletion of categories with dependencies)
 * - Optimized for frontend category management components
 * 
 * Note: All category operations now require authentication to ensure
 * proper access control and user-specific category management.
 */

import { Elysia } from "elysia";
import { CategoryController } from "../controllers/category.controller";

const categoryController = new CategoryController();

export const categoryRoutes = new Elysia({ prefix: "/api/v1/categories" })
  // Get all categories endpoint (protected)
  .get("/", 
    async (context) => await categoryController.getAllCategories(context),
    {
      detail: {
        tags: ["Categories"],
        summary: "Get all categories",
        description: "Retrieve all available categories",
        security: [{ bearerAuth: [] }]
      }
    }
  )
  
  // Get category by ID endpoint (protected)
  .get("/:id", 
    async (context) => await categoryController.getCategoryById(context),
    {
      detail: {
        tags: ["Categories"],
        summary: "Get category by ID",
        description: "Retrieve a specific category by its ID",
        security: [{ bearerAuth: [] }]
      }
    }
  )

  // Create new category endpoint (protected)
  .post("/", 
    async (context) => await categoryController.createCategory(context),
    {
      detail: {
        tags: ["Categories"],
        summary: "Create new category",
        description: "Create a new category for transaction classification",
        security: [{ bearerAuth: [] }]
      }
    }
  )

  // Update category endpoint (protected)
  .patch("/:id", 
    async (context) => await categoryController.updateCategory(context),
    {
      detail: {
        tags: ["Categories"],
        summary: "Update category",
        description: "Update an existing category by its ID",
        security: [{ bearerAuth: [] }]
      }
    }
  )

  // Delete category endpoint (protected)
  .delete("/:id", 
    async (context) => await categoryController.deleteCategory(context),
    {
      detail: {
        tags: ["Categories"],
        summary: "Delete category",
        description: "Delete a category by its ID (only if no transactions or budgets depend on it)",
        security: [{ bearerAuth: [] }]
      }
    }
  );