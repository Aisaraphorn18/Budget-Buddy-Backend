/**
 * Category Routes
 * 
 * Defines HTTP endpoints for category management in Budget Buddy.
 * Categories are used to organize financial transactions into meaningful
 * groups such as Food, Transportation, Entertainment, etc.
 * 
 * Routes:
 * - GET /api/v1/categories - Get all available categories
 * - GET /api/v1/categories/:id - Get specific category by ID
 * 
 * Features:
 * - Public access (no authentication required)
 * - OpenAPI documentation integration
 * - Consistent response formatting
 * - Error handling for invalid category IDs
 * - Optimized for frontend category selection components
 * 
 * Note: Categories are typically pre-defined and shared across all users
 * to ensure consistent transaction categorization throughout the system.
 */

import { Elysia } from "elysia";
import { CategoryController } from "../controllers/category.controller";

const categoryController = new CategoryController();

export const categoryRoutes = new Elysia({ prefix: "/api/v1/categories" })
  // Get all categories endpoint
  .get("/", 
    async (context) => await categoryController.getAllCategories(context),
    {
      detail: {
        tags: ["Categories"],
        summary: "Get all categories",
        description: "Retrieve all available categories (10 fixed categories)"
      }
    }
  )
  
  // Get category by ID endpoint
  .get("/:id", 
    async (context) => await categoryController.getCategoryById(context),
    {
      detail: {
        tags: ["Categories"],
        summary: "Get category by ID",
        description: "Retrieve a specific category by its ID"
      }
    }
  );