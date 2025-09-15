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

import { supabase } from "../config/supabase";
import { Category, CreateCategoryData } from "../models/category.model";

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
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Error getting all categories:", error);
      throw error;
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
      console.error("Error getting category by ID:", error);
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
      console.error("Error creating category:", error);
      throw error;
    }
  }
}