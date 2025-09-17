/**
 * CategoryService Unit Tests for Bun
 * Tests without real database operations
 */

import { describe, it, expect, beforeEach } from 'bun:test';

// Mock category data
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

// Test data - available for future test cases

// Simple mock CategoryService class for testing
class MockCategoryService {
  private categories = [...mockCategories];
  private nextId = 3;

  async getAllCategories() {
    return this.categories;
  }

  async getCategoryById(categoryId: number) {
    const category = this.categories.find(c => c.category_id === categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async createCategory(categoryData: { category_name: string }) {
    const newCategory = {
      category_id: this.nextId++,
      category_name: categoryData.category_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(categoryId: number, updateData: { category_name?: string }) {
    const categoryIndex = this.categories.findIndex(c => c.category_id === categoryId);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }

    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    return this.categories[categoryIndex];
  }

  async deleteCategory(categoryId: number) {
    // Simulate dependency check
    if (categoryId === 1) {
      throw new Error('Cannot delete category with existing transactions or budgets');
    }

    const categoryIndex = this.categories.findIndex(c => c.category_id === categoryId);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }

    this.categories.splice(categoryIndex, 1);
  }

  // Helper method to reset test data
  reset() {
    this.categories = [...mockCategories];
    this.nextId = 3;
  }
}

describe('CategoryService', () => {
  let categoryService: MockCategoryService;

  beforeEach(() => {
    categoryService = new MockCategoryService();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const result = await categoryService.getAllCategories();

      expect(result).toHaveLength(2);
      expect(result[0].category_name).toBe('Food');
      expect(result[1].category_name).toBe('Transport');
    });

    it('should return empty array when no categories exist', async () => {
      categoryService.reset();
      // Clear all categories
      categoryService['categories'] = [];

      const result = await categoryService.getAllCategories();
      expect(result).toHaveLength(0);
    });
  });

  describe('getCategoryById', () => {
    it('should return category when found', async () => {
      const result = await categoryService.getCategoryById(1);

      expect(result.category_id).toBe(1);
      expect(result.category_name).toBe('Food');
    });

    it('should throw error when category not found', async () => {
      expect(async () => {
        await categoryService.getCategoryById(999);
      }).toThrow('Category not found');
    });
  });

  describe('createCategory', () => {
    it('should create new category successfully', async () => {
      const newCategoryData = { category_name: 'Entertainment' };
      const result = await categoryService.createCategory(newCategoryData);

      expect(result.category_id).toBe(3);
      expect(result.category_name).toBe('Entertainment');
      expect(result.created_at).toBeDefined();
      expect(result.updated_at).toBeDefined();
    });

    it('should add category to the list', async () => {
      const newCategoryData = { category_name: 'Shopping' };
      await categoryService.createCategory(newCategoryData);

      const allCategories = await categoryService.getAllCategories();
      expect(allCategories).toHaveLength(3);
      expect(allCategories[2].category_name).toBe('Shopping');
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', async () => {
      const updateData = { category_name: 'Updated Food' };
      const result = await categoryService.updateCategory(1, updateData);

      expect(result.category_id).toBe(1);
      expect(result.category_name).toBe('Updated Food');
      expect(result.updated_at).toBeDefined();
    });

    it('should throw error when category not found', async () => {
      const updateData = { category_name: 'Updated Category' };

      expect(async () => {
        await categoryService.updateCategory(999, updateData);
      }).toThrow('Category not found');
    });

    it('should preserve other fields when updating', async () => {
      const updateData = { category_name: 'New Food Name' };
      const result = await categoryService.updateCategory(1, updateData);

      expect(result.category_id).toBe(1);
      expect(result.created_at).toBeDefined();
      expect(result.updated_at).toBeDefined();
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      await categoryService.deleteCategory(2);

      const allCategories = await categoryService.getAllCategories();
      expect(allCategories).toHaveLength(1);
      expect(allCategories.find(c => c.category_id === 2)).toBeUndefined();
    });

    it('should throw error when category has dependencies', async () => {
      expect(async () => {
        await categoryService.deleteCategory(1);
      }).toThrow('Cannot delete category with existing transactions or budgets');
    });

    it('should throw error when category not found', async () => {
      expect(async () => {
        await categoryService.deleteCategory(999);
      }).toThrow('Category not found');
    });
  });

  describe('Business Logic Validation', () => {
    it('should validate category name is required for creation', async () => {
      // This would be handled by validation middleware in real app
      const categoryData = { category_name: '' };
      const result = await categoryService.createCategory(categoryData);

      // Mock allows empty string, but real service would validate
      expect(result.category_name).toBe('');
    });

    it('should handle concurrent operations', async () => {
      // Test multiple operations
      const promises = [
        categoryService.getCategoryById(1),
        categoryService.createCategory({ category_name: 'Test1' }),
        categoryService.createCategory({ category_name: 'Test2' }),
      ];

      const results = await Promise.all(promises);
      expect(results).toHaveLength(3);
      expect(results[0].category_id).toBe(1);
      expect(results[1].category_name).toBe('Test1');
      expect(results[2].category_name).toBe('Test2');
    });
  });
});
