import { CategoryService } from "../services/category.service";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

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