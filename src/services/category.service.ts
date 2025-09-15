import { supabase } from "../config/supabase";
import { Category, CreateCategoryData } from "../models/category.model";

export class CategoryService {
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