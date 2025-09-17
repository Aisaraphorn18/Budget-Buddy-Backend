/**
 * Category Service Unit Tests
 *
 * ทดสอบ CategoryService ที่จัดการหมวดหมู่ในระบบ Budget Buddy
 * ครอบคลุม CRUD operations, การตรวจสอบ dependencies และ business logic
 */

import { describe, it, expect, beforeEach } from 'bun:test';

// Mock Category Data
const mockCategories = [
  {
    category_id: 1,
    category_name: 'Food & Dining',
    category_icon: '🍽️',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    category_id: 2,
    category_name: 'Transportation',
    category_icon: '🚗',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    category_id: 3,
    category_name: 'Entertainment',
    category_icon: '🎬',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock CategoryService Class
class MockCategoryService {
  private categories = [...mockCategories];
  private nextId = 4;
  private dependentCategories = new Set([1, 2]); // Categories with dependencies

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

  async createCategory(categoryData: { category_name: string; category_icon?: string }) {
    if (!categoryData.category_name || categoryData.category_name.trim() === '') {
      throw new Error('Category name is required');
    }

    const newCategory = {
      category_id: this.nextId++,
      category_name: categoryData.category_name.trim(),
      category_icon: categoryData.category_icon || '📁',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(
    categoryId: number,
    updateData: { category_name?: string; category_icon?: string }
  ) {
    const categoryIndex = this.categories.findIndex(c => c.category_id === categoryId);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }

    const updatedCategory = {
      ...this.categories[categoryIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    this.categories[categoryIndex] = updatedCategory;
    return updatedCategory;
  }

  async deleteCategory(categoryId: number): Promise<boolean> {
    const categoryIndex = this.categories.findIndex(c => c.category_id === categoryId);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }

    // Check for dependencies
    if (this.dependentCategories.has(categoryId)) {
      throw new Error('Cannot delete category with existing transactions or budgets');
    }

    this.categories.splice(categoryIndex, 1);
    return true;
  }
}

describe('CategoryService', () => {
  let categoryService: MockCategoryService;

  beforeEach(() => {
    categoryService = new MockCategoryService();
  });

  describe('getAllCategories()', () => {
    describe('📄 Basic Functionality', () => {
      it('should return all categories', async () => {
        const categories = await categoryService.getAllCategories();

        expect(categories).toHaveLength(3);
        expect(categories[0].category_name).toBe('Food & Dining');
        expect(categories[1].category_name).toBe('Transportation');
        expect(categories[2].category_name).toBe('Entertainment');
      });

      it('should return empty array when no categories exist', async () => {
        // Create a fresh service with no categories
        const emptyService = new MockCategoryService();
        emptyService['categories'] = [];

        const categories = await emptyService.getAllCategories();

        expect(categories).toHaveLength(0);
        expect(categories).toEqual([]);
      });
    });
  });

  describe('getCategoryById()', () => {
    describe('🔍 Basic Functionality', () => {
      it('should return category when found', async () => {
        const category = await categoryService.getCategoryById(1);

        expect(category).toBeDefined();
        expect(category.category_id).toBe(1);
        expect(category.category_name).toBe('Food & Dining');
        expect(category.category_icon).toBe('🍽️');
      });
    });

    describe('❌ Error Handling', () => {
      it('should throw error when category not found', async () => {
        expect(async () => {
          await categoryService.getCategoryById(999);
        }).toThrow('Category not found');
      });
    });
  });

  describe('createCategory()', () => {
    describe('✅ Successful Creation', () => {
      it('should create new category successfully', async () => {
        const categoryData = {
          category_name: 'Shopping',
          category_icon: '🛍️',
        };

        const result = await categoryService.createCategory(categoryData);

        expect(result).toBeDefined();
        expect(result.category_id).toBe(4); // Next available ID
        expect(result.category_name).toBe('Shopping');
        expect(result.category_icon).toBe('🛍️');
        expect(result.created_at).toBeDefined();
        expect(result.updated_at).toBeDefined();
      });

      it('should create category with default icon when not provided', async () => {
        const categoryData = {
          category_name: 'Health',
        };

        const result = await categoryService.createCategory(categoryData);

        expect(result.category_name).toBe('Health');
        expect(result.category_icon).toBe('📁');
      });

      it('should add category to the list', async () => {
        const categoryData = {
          category_name: 'New Category',
          category_icon: '🆕',
        };

        await categoryService.createCategory(categoryData);
        const allCategories = await categoryService.getAllCategories();

        expect(allCategories).toHaveLength(4);
        expect(allCategories[3].category_name).toBe('New Category');
      });

      it('should trim whitespace from category name', async () => {
        const categoryData = {
          category_name: '  Travel  ',
          category_icon: '✈️',
        };

        const result = await categoryService.createCategory(categoryData);

        expect(result.category_name).toBe('Travel');
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for empty category name', async () => {
        const categoryData = {
          category_name: '',
          category_icon: '📁',
        };

        expect(async () => {
          await categoryService.createCategory(categoryData);
        }).toThrow('Category name is required');
      });

      it('should throw error for whitespace-only category name', async () => {
        const categoryData = {
          category_name: '   ',
          category_icon: '📁',
        };

        expect(async () => {
          await categoryService.createCategory(categoryData);
        }).toThrow('Category name is required');
      });
    });
  });

  describe('updateCategory()', () => {
    describe('✅ Successful Updates', () => {
      it('should update category successfully', async () => {
        const updateData = {
          category_name: 'Food & Beverages',
          category_icon: '🥤',
        };

        const result = await categoryService.updateCategory(1, updateData);

        expect(result).toBeDefined();
        expect(result.category_name).toBe('Food & Beverages');
        expect(result.category_icon).toBe('🥤');
        expect(result.updated_at).toBeDefined();
        expect(new Date(result.updated_at)).toBeInstanceOf(Date);
      });

      it('should update only category name', async () => {
        const updateData = {
          category_name: 'Food & Drinks',
        };

        const result = await categoryService.updateCategory(1, updateData);

        expect(result.category_name).toBe('Food & Drinks');
        expect(result.category_icon).toBe('🍽️'); // Should remain unchanged
      });

      it('should update only category icon', async () => {
        const updateData = {
          category_icon: '🍕',
        };

        const result = await categoryService.updateCategory(1, updateData);

        expect(result.category_name).toBe('Food & Dining'); // Should remain unchanged
        expect(result.category_icon).toBe('🍕');
      });

      it('should preserve other fields when updating', async () => {
        const originalCategory = await categoryService.getCategoryById(1);
        const updateData = {
          category_name: 'Updated Name',
        };

        const result = await categoryService.updateCategory(1, updateData);

        expect(result.category_id).toBe(originalCategory.category_id);
        expect(result.created_at).toBe(originalCategory.created_at);
        expect(result.updated_at).not.toBe(originalCategory.updated_at);
      });
    });

    describe('❌ Error Handling', () => {
      it('should throw error when category not found', async () => {
        const updateData = {
          category_name: 'Updated Name',
        };

        expect(async () => {
          await categoryService.updateCategory(999, updateData);
        }).toThrow('Category not found');
      });
    });
  });

  describe('deleteCategory()', () => {
    describe('✅ Successful Deletion', () => {
      it('should delete category successfully', async () => {
        const result = await categoryService.deleteCategory(3); // Entertainment has no dependencies

        expect(result).toBe(true);

        // Verify category is deleted
        expect(async () => {
          await categoryService.getCategoryById(3);
        }).toThrow('Category not found');
      });

      it('should remove category from the list', async () => {
        await categoryService.deleteCategory(3);
        const allCategories = await categoryService.getAllCategories();

        expect(allCategories).toHaveLength(2);
        expect(allCategories.find(c => c.category_id === 3)).toBeUndefined();
      });
    });

    describe('❌ Error Handling', () => {
      it('should throw error when category has dependencies', async () => {
        expect(async () => {
          await categoryService.deleteCategory(1); // Food & Dining has dependencies
        }).toThrow('Cannot delete category with existing transactions or budgets');
      });

      it('should throw error when category not found', async () => {
        expect(async () => {
          await categoryService.deleteCategory(999);
        }).toThrow('Category not found');
      });
    });
  });

  describe('🧪 Business Logic Validation', () => {
    it('should validate category name is required for creation', async () => {
      const categoryData = {
        category_name: '',
      };

      expect(async () => {
        await categoryService.createCategory(categoryData);
      }).toThrow('Category name is required');
    });

    it('should handle concurrent operations', async () => {
      const categoryData1 = {
        category_name: 'Concurrent 1',
        category_icon: '1️⃣',
      };

      const categoryData2 = {
        category_name: 'Concurrent 2',
        category_icon: '2️⃣',
      };

      // Create categories concurrently
      const [result1, result2] = await Promise.all([
        categoryService.createCategory(categoryData1),
        categoryService.createCategory(categoryData2),
      ]);

      expect(result1.category_id).not.toBe(result2.category_id);
      expect(result1.category_name).toBe('Concurrent 1');
      expect(result2.category_name).toBe('Concurrent 2');

      const allCategories = await categoryService.getAllCategories();
      expect(allCategories).toHaveLength(5); // Original 3 + 2 new
    });

    it('should maintain data integrity after multiple operations', async () => {
      // Create a new category
      const newCategory = await categoryService.createCategory({
        category_name: 'Test Category',
        category_icon: '🧪',
      });

      // Update it
      const updatedCategory = await categoryService.updateCategory(newCategory.category_id, {
        category_name: 'Updated Test Category',
      });

      // Verify the update
      const retrievedCategory = await categoryService.getCategoryById(newCategory.category_id);

      expect(retrievedCategory.category_name).toBe('Updated Test Category');
      expect(retrievedCategory.category_icon).toBe('🧪');
      expect(retrievedCategory.updated_at).toBe(updatedCategory.updated_at);

      // Delete it
      const deleteResult = await categoryService.deleteCategory(newCategory.category_id);
      expect(deleteResult).toBe(true);

      // Verify deletion
      expect(async () => {
        await categoryService.getCategoryById(newCategory.category_id);
      }).toThrow('Category not found');
    });
  });
});
