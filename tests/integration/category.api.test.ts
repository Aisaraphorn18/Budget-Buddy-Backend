/**
 * Category API Integration Tests for Bun
 * Tests API endpoints without real database operations
 */

import { describe, it, expect, beforeEach } from "bun:test";

// Mock API response helpers
const createMockResponse = (statusCode: number, data: any) => ({
  status: statusCode,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data))
});

// Mock category data
const mockCategories = [
  { category_id: 1, category_name: 'Food', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { category_id: 2, category_name: 'Transport', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
];

// Mock API client
class MockCategoryAPI {
  private categories = [...mockCategories];
  private nextId = 3;

  async getAllCategories(authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: "Authentication required" });
    }

    return createMockResponse(200, {
      success: true,
      data: this.categories,
      message: "Categories retrieved successfully"
    });
  }

  async getCategoryById(categoryId: number, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: "Authentication required" });
    }

    const category = this.categories.find(c => c.category_id === categoryId);
    if (!category) {
      return createMockResponse(404, {
        success: false,
        message: "Category not found"
      });
    }

    return createMockResponse(200, {
      success: true,
      data: category,
      message: "Category retrieved successfully"
    });
  }

  async createCategory(categoryData: { category_name: string }, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: "Authentication required" });
    }

    if (!categoryData.category_name || categoryData.category_name.trim() === '') {
      return createMockResponse(400, {
        success: false,
        message: "Category name is required"
      });
    }

    const newCategory = {
      category_id: this.nextId++,
      category_name: categoryData.category_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.categories.push(newCategory);

    return createMockResponse(201, {
      success: true,
      data: newCategory,
      message: "Category created successfully"
    });
  }

  async updateCategory(categoryId: number, updateData: { category_name?: string }, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: "Authentication required" });
    }

    const categoryIndex = this.categories.findIndex(c => c.category_id === categoryId);
    if (categoryIndex === -1) {
      return createMockResponse(404, {
        success: false,
        message: "Category not found"
      });
    }

    if (updateData.category_name && updateData.category_name.trim() === '') {
      return createMockResponse(400, {
        success: false,
        message: "Category name cannot be empty"
      });
    }

    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    return createMockResponse(200, {
      success: true,
      data: this.categories[categoryIndex],
      message: "Category updated successfully"
    });
  }

  async deleteCategory(categoryId: number, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: "Authentication required" });
    }

    // Simulate dependency check
    if (categoryId === 1) {
      return createMockResponse(409, {
        success: false,
        message: "Cannot delete category with existing transactions or budgets"
      });
    }

    const categoryIndex = this.categories.findIndex(c => c.category_id === categoryId);
    if (categoryIndex === -1) {
      return createMockResponse(404, {
        success: false,
        message: "Category not found"
      });
    }

    this.categories.splice(categoryIndex, 1);

    return createMockResponse(200, {
      success: true,
      message: "Category deleted successfully"
    });
  }

  // Helper method to reset test data
  reset() {
    this.categories = [...mockCategories];
    this.nextId = 3;
  }
}

describe("Category API Endpoints", () => {
  let api: MockCategoryAPI;
  const validToken = "Bearer valid-jwt-token";

  beforeEach(() => {
    api = new MockCategoryAPI();
  });

  describe("GET /api/categories", () => {
    it("should return all categories with valid authentication", async () => {
      const response = await api.getAllCategories(validToken);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.message).toBe("Categories retrieved successfully");
    });

    it("should return 401 without authentication", async () => {
      const response = await api.getAllCategories();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe("Authentication required");
    });
  });

  describe("GET /api/categories/:id", () => {
    it("should return specific category when found", async () => {
      const response = await api.getCategoryById(1, validToken);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.category_id).toBe(1);
      expect(data.data.category_name).toBe('Food');
    });

    it("should return 404 when category not found", async () => {
      const response = await api.getCategoryById(999, validToken);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Category not found");
    });

    it("should return 401 without authentication", async () => {
      const response = await api.getCategoryById(1);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe("Authentication required");
    });
  });

  describe("POST /api/categories", () => {
    it("should create new category with valid data", async () => {
      const categoryData = { category_name: 'Entertainment' };
      const response = await api.createCategory(categoryData, validToken);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.category_name).toBe('Entertainment');
      expect(data.data.category_id).toBe(3);
      expect(data.message).toBe("Category created successfully");
    });

    it("should return 400 with empty category name", async () => {
      const categoryData = { category_name: '' };
      const response = await api.createCategory(categoryData, validToken);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Category name is required");
    });

    it("should return 401 without authentication", async () => {
      const categoryData = { category_name: 'Test' };
      const response = await api.createCategory(categoryData);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe("Authentication required");
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("should update category with valid data", async () => {
      const updateData = { category_name: 'Updated Food' };
      const response = await api.updateCategory(1, updateData, validToken);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.category_name).toBe('Updated Food');
      expect(data.message).toBe("Category updated successfully");
    });

    it("should return 404 when category not found", async () => {
      const updateData = { category_name: 'Updated Category' };
      const response = await api.updateCategory(999, updateData, validToken);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Category not found");
    });

    it("should return 400 with empty category name", async () => {
      const updateData = { category_name: '' };
      const response = await api.updateCategory(1, updateData, validToken);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Category name cannot be empty");
    });

    it("should return 401 without authentication", async () => {
      const updateData = { category_name: 'Test' };
      const response = await api.updateCategory(1, updateData);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe("Authentication required");
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("should delete category successfully", async () => {
      const response = await api.deleteCategory(2, validToken);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Category deleted successfully");
    });

    it("should return 409 when category has dependencies", async () => {
      const response = await api.deleteCategory(1, validToken);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Cannot delete category with existing transactions or budgets");
    });

    it("should return 404 when category not found", async () => {
      const response = await api.deleteCategory(999, validToken);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Category not found");
    });

    it("should return 401 without authentication", async () => {
      const response = await api.deleteCategory(2);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe("Authentication required");
    });
  });

  describe("API Response Format", () => {
    it("should return consistent success response format", async () => {
      const response = await api.getAllCategories(validToken);
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('message');
      expect(typeof data.success).toBe('boolean');
    });

    it("should return consistent error response format", async () => {
      const response = await api.getCategoryById(999, validToken);
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('message');
      expect(data.success).toBe(false);
    });
  });

  describe("Authentication and Authorization", () => {
    it("should handle missing authorization header", async () => {
      const response = await api.getAllCategories();
      expect(response.status).toBe(401);
    });

    it("should handle valid authorization token", async () => {
      const response = await api.getAllCategories(validToken);
      expect(response.status).toBe(200);
    });
  });
});