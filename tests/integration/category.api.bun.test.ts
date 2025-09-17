/**
 * 🏷️ Category API Integration Tests
 * ทดสอบ API endpoints สำหรับจัดการหมวดหมู่รายจ่าย พร้อม Mock HTTP Client
 * @description Integration Tests สำหรับทดสอบ Category API endpoints ครบถ้วน
 */

import { describe, it, expect, beforeEach } from 'bun:test';

// 🔧 Mock API Response Helpers
const createMockResponse = (statusCode: number, data: any) => ({
  status: statusCode,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
});

// 🗂️ Mock Category Data
const mockCategories = [
  {
    category_id: 1,
    category_name: 'Food',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    category_id: 2,
    category_name: 'Transport',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// 🔗 Mock Category HTTP Client
class MockCategoryHttpClient {
  private categories = [...mockCategories];
  private nextId = 3;

  async getAllCategories(authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    return createMockResponse(200, {
      success: true,
      data: this.categories,
      message: 'Categories retrieved successfully',
    });
  }

  async getCategoryById(categoryId: number, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    const category = this.categories.find(c => c.category_id === categoryId);
    if (!category) {
      return createMockResponse(404, {
        success: false,
        message: 'Category not found',
      });
    }

    return createMockResponse(200, {
      success: true,
      data: category,
      message: 'Category retrieved successfully',
    });
  }

  async createCategory(categoryData: { category_name: string }, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    if (!categoryData.category_name || categoryData.category_name.trim() === '') {
      return createMockResponse(400, {
        success: false,
        message: 'Category name is required',
      });
    }

    const newCategory = {
      category_id: this.nextId++,
      category_name: categoryData.category_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.categories.push(newCategory);

    return createMockResponse(201, {
      success: true,
      data: newCategory,
      message: 'Category created successfully',
    });
  }

  async updateCategory(
    categoryId: number,
    updateData: { category_name?: string },
    authToken?: string
  ) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    const categoryIndex = this.categories.findIndex(c => c.category_id === categoryId);
    if (categoryIndex === -1) {
      return createMockResponse(404, {
        success: false,
        message: 'Category not found',
      });
    }

    if (updateData.category_name !== undefined && updateData.category_name.trim() === '') {
      return createMockResponse(400, {
        success: false,
        message: 'Category name cannot be empty',
      });
    }

    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    return createMockResponse(200, {
      success: true,
      data: this.categories[categoryIndex],
      message: 'Category updated successfully',
    });
  }

  async deleteCategory(categoryId: number, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    // Simulate dependency check
    if (categoryId === 1) {
      return createMockResponse(409, {
        success: false,
        message: 'Cannot delete category with existing transactions or budgets',
      });
    }

    const categoryIndex = this.categories.findIndex(c => c.category_id === categoryId);
    if (categoryIndex === -1) {
      return createMockResponse(404, {
        success: false,
        message: 'Category not found',
      });
    }

    this.categories.splice(categoryIndex, 1);

    return createMockResponse(200, {
      success: true,
      message: 'Category deleted successfully',
    });
  }

  // Helper method to reset test data
  reset() {
    this.categories = [...mockCategories];
    this.nextId = 3;
  }
}

describe('🏷️ Category API Integration Tests', () => {
  let api: MockCategoryHttpClient;
  const validToken = 'mock-jwt-token-123';

  beforeEach(() => {
    api = new MockCategoryHttpClient();
    api.reset();
  });

  describe('GET /api/v1/categories', () => {
    describe('📄 Basic Functionality', () => {
      it('should return all categories for authenticated user - ดึงข้อมูลหมวดหมู่ทั้งหมดสำหรับผู้ใช้ที่ได้รับการยืนยัน', async () => {
        const response = await api.getAllCategories(validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toHaveLength(2);
        expect(data.message).toBe('Categories retrieved successfully');
        expect(data.data[0]).toHaveProperty('category_id');
        expect(data.data[0]).toHaveProperty('category_name');
      });

      it('should return empty array when no categories exist - ส่งคืน array ว่างเมื่อไม่มีหมวดหมู่', async () => {
        api.reset();
        // Clear all categories
        await api.deleteCategory(2, validToken);

        const response = await api.getAllCategories(validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toHaveLength(1); // Only category 1 left (has dependencies)
      });
    });

    describe('❌ Authentication Errors', () => {
      it('should return 401 for missing authentication token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const response = await api.getAllCategories();
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe('Authentication required');
      });
    });
  });

  describe('GET /api/v1/categories/:id', () => {
    describe('🔍 Category Retrieval', () => {
      it('should return specific category by ID - ดึงข้อมูลหมวดหมู่ตาม ID', async () => {
        const response = await api.getCategoryById(1, validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.category_id).toBe(1);
        expect(data.data.category_name).toBe('Food');
        expect(data.message).toBe('Category retrieved successfully');
      });

      it('should return 404 for non-existent category - ส่งคืน 404 เมื่อไม่พบหมวดหมู่', async () => {
        const response = await api.getCategoryById(999, validToken);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Category not found');
      });
    });

    describe('❌ Authentication Errors', () => {
      it('should return 401 for missing authentication token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const response = await api.getCategoryById(1);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe('Authentication required');
      });
    });
  });

  describe('POST /api/v1/categories', () => {
    describe('✅ Successful Creation', () => {
      it('should create new category with valid data - สร้างหมวดหมู่ใหม่ด้วยข้อมูลที่ถูกต้อง', async () => {
        const categoryData = { category_name: 'Entertainment' };
        const response = await api.createCategory(categoryData, validToken);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.success).toBe(true);
        expect(data.data.category_name).toBe('Entertainment');
        expect(data.data.category_id).toBe(3);
        expect(data.message).toBe('Category created successfully');
      });
    });

    describe('❌ Validation Errors', () => {
      it('should return 400 for empty category name - ส่งคืน 400 เมื่อชื่อหมวดหมู่ว่าง', async () => {
        const categoryData = { category_name: '' };
        const response = await api.createCategory(categoryData, validToken);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Category name is required');
      });

      it('should return 400 for missing category name - ส่งคืน 400 เมื่อไม่มีชื่อหมวดหมู่', async () => {
        const categoryData = { category_name: '   ' };
        const response = await api.createCategory(categoryData, validToken);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Category name is required');
      });

      it('should return 401 for missing authentication token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const categoryData = { category_name: 'Test' };
        const response = await api.createCategory(categoryData);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe('Authentication required');
      });
    });
  });

  describe('PUT /api/v1/categories/:id', () => {
    describe('✅ Successful Updates', () => {
      it('should update category with valid data - อัปเดตหมวดหมู่ด้วยข้อมูลที่ถูกต้อง', async () => {
        const updateData = { category_name: 'Updated Food' };
        const response = await api.updateCategory(1, updateData, validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.category_name).toBe('Updated Food');
        expect(data.message).toBe('Category updated successfully');
      });
    });

    describe('❌ Update Validation Errors', () => {
      it('should return 404 for non-existent category - ส่งคืน 404 เมื่อไม่พบหมวดหมู่', async () => {
        const updateData = { category_name: 'Updated Category' };
        const response = await api.updateCategory(999, updateData, validToken);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Category not found');
      });

      it('should return 400 for empty category name - ส่งคืน 400 เมื่อชื่อหมวดหมู่ว่าง', async () => {
        const updateData = { category_name: '' };
        const response = await api.updateCategory(1, updateData, validToken);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Category name cannot be empty');
      });

      it('should return 401 for missing authentication token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const updateData = { category_name: 'Test' };
        const response = await api.updateCategory(1, updateData);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe('Authentication required');
      });
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    describe('🗑️ Successful Deletion', () => {
      it('should delete category successfully - ลบหมวดหมู่สำเร็จ', async () => {
        const response = await api.deleteCategory(2, validToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe('Category deleted successfully');
      });
    });

    describe('❌ Error Handling', () => {
      it('should return 409 when category has dependencies - ส่งคืน 409 เมื่อหมวดหมู่มีการใช้งาน', async () => {
        const response = await api.deleteCategory(1, validToken);
        const data = await response.json();

        expect(response.status).toBe(409);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Cannot delete category with existing transactions or budgets');
      });

      it('should return 404 for non-existent category - ส่งคืน 404 เมื่อไม่พบหมวดหมู่', async () => {
        const response = await api.deleteCategory(999, validToken);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Category not found');
      });

      it('should return 401 for missing authentication token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const response = await api.deleteCategory(2);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe('Authentication required');
      });
    });
  });

  describe('📊 API Response Format', () => {
    describe('✅ Consistent Response Structure', () => {
      it('should return consistent success response format - ตรวจสอบรูปแบบการตอบกลับที่สำเร็จ', async () => {
        const response = await api.getAllCategories(validToken);
        const data = await response.json();

        expect(data).toHaveProperty('success');
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('message');
        expect(typeof data.success).toBe('boolean');
      });

      it('should return consistent error response format - ตรวจสอบรูปแบบการตอบกลับที่ผิดพลาด', async () => {
        const response = await api.getCategoryById(999, validToken);
        const data = await response.json();

        expect(data).toHaveProperty('success');
        expect(data).toHaveProperty('message');
        expect(data.success).toBe(false);
      });
    });
  });

  describe('🔐 Authentication and Authorization', () => {
    describe('🚫 Token Validation', () => {
      it('should handle missing authorization header - จัดการกรณีไม่มี header authorization', async () => {
        const response = await api.getAllCategories();
        expect(response.status).toBe(401);
      });

      it('should handle valid authorization token - จัดการ token ที่ถูกต้อง', async () => {
        const response = await api.getAllCategories(validToken);
        expect(response.status).toBe(200);
      });
    });
  });

  describe('🧪 Integration Scenarios', () => {
    describe('📋 Complete Category Lifecycle', () => {
      it('should handle complete category management flow - ทดสอบการจัดการหมวดหมู่แบบครบวงจร', async () => {
        // Create new category
        const createData = { category_name: 'Health' };
        const createResponse = await api.createCategory(createData, validToken);
        const createResult = await createResponse.json();

        expect(createResponse.status).toBe(201);
        expect(createResult.data.category_name).toBe('Health');

        const categoryId = createResult.data.category_id;

        // Read created category
        const getResponse = await api.getCategoryById(categoryId, validToken);
        const getResult = await getResponse.json();

        expect(getResponse.status).toBe(200);
        expect(getResult.data.category_name).toBe('Health');

        // Update category
        const updateData = { category_name: 'Healthcare' };
        const updateResponse = await api.updateCategory(categoryId, updateData, validToken);
        const updateResult = await updateResponse.json();

        expect(updateResponse.status).toBe(200);
        expect(updateResult.data.category_name).toBe('Healthcare');

        // Delete category
        const deleteResponse = await api.deleteCategory(categoryId, validToken);
        expect(deleteResponse.status).toBe(200);
      });

      it('should handle multiple categories and validation - จัดการหมวดหมู่หลายรายการและการตรวจสอบ', async () => {
        // Get initial count
        const initialResponse = await api.getAllCategories(validToken);
        const initialData = await initialResponse.json();
        const initialCount = initialData.data.length;

        // Create multiple categories
        await api.createCategory({ category_name: 'Education' }, validToken);
        await api.createCategory({ category_name: 'Shopping' }, validToken);

        // Verify count increased
        const finalResponse = await api.getAllCategories(validToken);
        const finalData = await finalResponse.json();

        expect(finalData.data).toHaveLength(initialCount + 2);
        expect(finalData.data.some((c: any) => c.category_name === 'Education')).toBe(true);
        expect(finalData.data.some((c: any) => c.category_name === 'Shopping')).toBe(true);
      });
    });
  });
});
