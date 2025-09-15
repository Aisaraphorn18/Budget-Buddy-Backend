/**
 * User Management Service
 * 
 * Business logic layer for user management operations in Budget Buddy.
 * Handles user data retrieval, filtering, statistics, and administrative
 * operations for user accounts.
 * 
 * Key Features:
 * - User data retrieval with pagination and search
 * - User statistics calculation (transactions, budgets)
 * - User account deletion with data cleanup
 * - Admin-focused user management operations
 * - Data privacy and security compliance
 * 
 * Security:
 * - Password data exclusion from responses
 * - User data isolation and access control
 * - Input sanitization and validation
 * - Safe user deletion with cascading cleanup
 */

import { supabase } from "../config/supabase";
import { User } from "../models/user.model";

interface UserFilters {
  page: number;
  limit: number;
  search: string;
}

interface UserStats {
  total_transactions: number;
  total_budgets: number;
  last_login?: string;
}

export class UserService {
  /**
   * Retrieve all users with pagination and search functionality
   * Supports filtering by username, first_name, and last_name
   * 
   * @param filters - Pagination and search parameters
   * @returns Object containing users array, total count, and pagination info
   */
  async getAllUsers(filters: UserFilters): Promise<{
    users: Omit<User, 'password'>[],
    total: number,
    page: number,
    limit: number
  }> {
    try {
      const { page, limit, search } = filters;
      const offset = (page - 1) * limit;

      // Build query with search functionality
      let query = supabase
        .from('User')
        .select('user_id, username, first_name, last_name, created_date', { count: 'exact' })
        .order('created_date', { ascending: false })
        .range(offset, offset + limit - 1);

      // Add search filter if provided
      if (search) {
        query = query.or(`username.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        users: data || [],
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  /**
   * Retrieve specific user by ID
   * Excludes password field for security
   * 
   * @param userId - The ID of the user to retrieve
   * @returns User object without password or null if not found
   */
  async getUserById(userId: number): Promise<Omit<User, 'password'> | null> {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('user_id, username, first_name, last_name, created_date')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  /**
   * Get user statistics including transaction and budget counts
   * Provides overview of user activity and engagement
   * 
   * @param userId - The ID of the user to get statistics for
   * @returns Object containing user activity statistics
   */
  async getUserStats(userId: number): Promise<UserStats> {
    try {
      // Get transaction count
      const { count: transactionCount, error: transactionError } = await supabase
        .from('Transaction')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (transactionError) {
        throw transactionError;
      }

      // Get budget count
      const { count: budgetCount, error: budgetError } = await supabase
        .from('Budget')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (budgetError) {
        throw budgetError;
      }

      // Get last transaction date as proxy for last activity
      const { data: lastTransaction, error: lastTransactionError } = await supabase
        .from('Transaction')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Don't throw error if no transactions found
      const lastLogin = lastTransaction?.created_at || undefined;

      return {
        total_transactions: transactionCount || 0,
        total_budgets: budgetCount || 0,
        last_login: lastLogin
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      throw error;
    }
  }

  /**
   * Delete user account and all associated data
   * Performs cascading deletion of user's transactions and budgets
   * 
   * @param userId - The ID of the user to delete
   * @returns true if user was deleted, false if user not found
   */
  async deleteUser(userId: number): Promise<boolean> {
    try {
      // Check if user exists first
      const user = await this.getUserById(userId);
      if (!user) {
        return false;
      }

      // Delete associated data first (due to foreign key constraints)
      
      // Delete user's transactions
      const { error: transactionDeleteError } = await supabase
        .from('Transaction')
        .delete()
        .eq('user_id', userId);

      if (transactionDeleteError) {
        throw transactionDeleteError;
      }

      // Delete user's budgets
      const { error: budgetDeleteError } = await supabase
        .from('Budget')
        .delete()
        .eq('user_id', userId);

      if (budgetDeleteError) {
        throw budgetDeleteError;
      }

      // Finally, delete the user
      const { error: userDeleteError } = await supabase
        .from('User')
        .delete()
        .eq('user_id', userId);

      if (userDeleteError) {
        throw userDeleteError;
      }

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}