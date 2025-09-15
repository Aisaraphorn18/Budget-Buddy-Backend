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

      context.set.status = 200;
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
        data: null
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

  /**
   * Create new category
   * Creates a new category in the system
   * 
   * @param context - Elysia context with category data in body
   * @returns Created category object or error
   */
  async createCategory(context: any) {
    try {
      const categoryData = context.body;

      if (!categoryData.category_name || categoryData.category_name.trim() === '') {
        context.set.status = 400;
        return {
          success: false,
          message: "Category name is required"
        };
      }

      const category = await this.categoryService.createCategory({
        category_name: categoryData.category_name.trim()
      });

      context.set.status = 201;
      return {
        success: true,
        message: "Category created successfully",
        data: category
      };
    } catch (error) {
      console.error("Create category error:", error);
      
      // Handle duplicate category name
      if (error instanceof Error && error.message.includes('duplicate')) {
        context.set.status = 409;
        return {
          success: false,
          message: "Category name already exists"
        };
      }

      context.set.status = 500;
      return {
        success: false,
        message: "Failed to create category",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Update existing category
   * Updates category information by its ID
   * 
   * @param context - Elysia context with category ID and update data
   * @returns Updated category object or error
   */
  async updateCategory(context: any) {
    try {
      const categoryId = parseInt(context.params.id);
      const updateData = context.body;

      if (isNaN(categoryId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid category ID"
        };
      }

      if (!updateData.category_name || updateData.category_name.trim() === '') {
        context.set.status = 400;
        return {
          success: false,
          message: "Category name is required"
        };
      }

      const category = await this.categoryService.updateCategory(categoryId, {
        category_name: updateData.category_name.trim()
      });

      return {
        success: true,
        message: "Category updated successfully",
        data: category
      };
    } catch (error) {
      console.error("Update category error:", error);
      
      if (error instanceof Error && error.message === 'Category not found') {
        context.set.status = 404;
        return {
          success: false,
          message: "Category not found"
        };
      }

      // Handle duplicate category name
      if (error instanceof Error && error.message.includes('duplicate')) {
        context.set.status = 409;
        return {
          success: false,
          message: "Category name already exists"
        };
      }

      context.set.status = 500;
      return {
        success: false,
        message: "Failed to update category",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Delete category
   * Removes a category from the system
   * 
   * @param context - Elysia context with category ID parameter
   * @returns Success message or error
   */
  async deleteCategory(context: any) {
    try {
      const categoryId = parseInt(context.params.id);

      if (isNaN(categoryId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid category ID"
        };
      }

      // Check if category exists first
      const existingCategory = await this.categoryService.getCategoryById(categoryId);
      if (!existingCategory) {
        context.set.status = 404;
        return {
          success: false,
          message: "Category not found"
        };
      }

      await this.categoryService.deleteCategory(categoryId);

      return {
        success: true,
        message: "Category deleted successfully",
        data: {
          deleted_category_id: categoryId
        }
      };
    } catch (error) {
      console.error("Delete category error:", error);
      
      if (error instanceof Error) {
        if (error.message.includes('existing transactions')) {
          context.set.status = 409;
          return {
            success: false,
            message: "Cannot delete category with existing transactions"
          };
        }
        
        if (error.message.includes('existing budgets')) {
          context.set.status = 409;
          return {
            success: false,
            message: "Cannot delete category with existing budgets"
          };
        }
      }

      context.set.status = 500;
      return {
        success: false,
        message: "Failed to delete category",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}