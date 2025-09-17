/**
 * Category Service
 *
 * Business logic layer for category management in Budget Buddy.
 * Categories are used to organize and classify financial transactions
 * into meaningful groups for better financial tracking and reporting.
 *
 * Key Features:
 * - Retrieve all available categories
 * - Find specific categories by ID
 * - Create new categories
 * - Public read access (categories are shared across users)
 * - Ordered category listing for consistent UI presentation
 *
 * Note: Categories are typically shared resources in the system,
 * allowing users to categorize transactions using predefined categories.
 */

import { supabase } from '../config/supabase';
import { Category, CreateCategoryData, UpdateCategoryData } from '../models/category.model';

export class CategoryService {
  /**
   * Retrieve all categories
   * Returns complete list of categories ordered by ID
   *
   * @returns Array of all categories in the system
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('Category')
        .select('*')
        .order('category_id', { ascending: true });

      if (error) {
        console.error('Database error getting all categories:', error);
        throw new Error(`Failed to retrieve categories: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error getting all categories:', error);
      if (error instanceof Error) {
        throw error; // Re-throw our custom errors
      }
      throw new Error('Failed to retrieve categories - unknown error occurred');
    }
  }

  /**
   * Find category by ID
   * Retrieves a specific category by its unique identifier
   *
   * @param categoryId - The ID of the category to retrieve
   * @returns Category object if found, null otherwise
   */
  async getCategoryById(categoryId: number): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('Category')
        .select('*')
        .eq('category_id', categoryId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting category by ID:', error);
      throw error;
    }
  }

  /**
   * Create new category
   * Adds a new category to the system
   *
   * @param categoryData - Category data for creation
   * @returns Created category object with generated ID
   * @throws Error if category name already exists or database operation fails
   */
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('Category')
        .insert([categoryData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Update existing category
   * Updates category information by its ID
   *
   * @param categoryId - The ID of the category to update
   * @param updateData - Data to update (partial category object)
   * @returns Updated category object
   * @throws Error if category not found or database operation fails
   */
  async updateCategory(categoryId: number, updateData: UpdateCategoryData): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('Category')
        .update(updateData)
        .eq('category_id', categoryId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Category not found');
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  /**
   * Delete category
   * Removes a category from the system
   *
   * @param categoryId - The ID of the category to delete
   * @returns Success status
   * @throws Error if category not found, has dependent transactions, or database operation fails
   */
  async deleteCategory(categoryId: number): Promise<void> {
    try {
      // Check if category has any associated transactions
      const { data: transactions, error: transactionError } = await supabase
        .from('Transaction')
        .select('transaction_id')
        .eq('category_id', categoryId)
        .limit(1);

      if (transactionError) {
        throw transactionError;
      }

      if (transactions && transactions.length > 0) {
        throw new Error('Cannot delete category with existing transactions');
      }

      // Check if category has any associated budgets
      const { data: budgets, error: budgetError } = await supabase
        .from('Budget')
        .select('budget_id')
        .eq('category_id', categoryId)
        .limit(1);

      if (budgetError) {
        throw budgetError;
      }

      if (budgets && budgets.length > 0) {
        throw new Error('Cannot delete category with existing budgets');
      }

      // Delete the category
      const { error } = await supabase.from('Category').delete().eq('category_id', categoryId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}
