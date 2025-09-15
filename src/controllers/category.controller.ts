/**
 * Category Controller
 * 
 * HTTP request handler for category management endpoints in Budget Buddy.
 * Categories are used to organize financial transactions into meaningful groups
 * such as Food, Transportation, Entertainment, etc.
 * 
 * Key Features:
 * - Public access to category data (no authentication required)
 * - Retrieve all available categories
 * - Find specific categories by ID
 * - Consistent error handling and response formatting
 * - Optimized for frontend category selection components
 * 
 * Note: Categories are typically shared resources across users,
 * allowing consistent transaction categorization throughout the system.
 */

import { CategoryService } from "../services/category.service";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  /**
   * Get all categories
   * Returns complete list of available categories for transaction classification
   * 
   * @param context - Elysia context (no authentication required)
   * @returns Array of all categories ordered by ID
   */
  async getAllCategories(context: any) {
    try {
      const categories = await this.categoryService.getAllCategories();

      return {
        success: true,
        message: "Categories retrieved successfully",
        data: categories
      };
    } catch (error) {
      console.error("Get all categories error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get categories",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Get specific category by ID
   * Retrieves a single category by its unique identifier
   * 
   * @param context - Elysia context with category ID parameter
   * @returns Category object or error if not found
   */
  async getCategoryById(context: any) {
    try {
      const categoryId = parseInt(context.params.id);
      
      if (isNaN(categoryId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid category ID"
        };
      }

      const category = await this.categoryService.getCategoryById(categoryId);
      
      if (!category) {
        context.set.status = 404;
        return {
          success: false,
          message: "Category not found"
        };
      }

      return {
        success: true,
        message: "Category retrieved successfully",
        data: category
      };
    } catch (error) {
      console.error("Get category by ID error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get category",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}