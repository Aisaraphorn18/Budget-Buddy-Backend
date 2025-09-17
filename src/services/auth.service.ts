/**
 * Authentication Service
 *
 * Business logic layer for user authentication and account management in Budget Buddy.
 * Handles all authentication-related database operations and user management functions.
 *
 * Key Features:
 * - User account creation and management
 * - Username uniqueness validation
 * - Secure user lookup operations
 * - User profile retrieval
 * - Database abstraction for authentication operations
 *
 * Security Considerations:
 * - Password hashing handled at controller level
 * - User data validation and sanitization
 * - Proper error handling for database operations
 */

import { supabase } from '../config/supabase';
import logger from '../utils/logger';

/**
 * User interface for authentication service
 * Represents complete user data structure
 */
export interface User {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  created_at: string;
}

/**
 * Data required for creating new user accounts
 * Used in user registration process
 */
export interface CreateUserData {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}

export class AuthService {
  /**
   * Find user by username
   * Used for login validation and username uniqueness checks
   *
   * @param username - The username to search for
   * @returns User object if found, null otherwise
   */
  async findUserByUsername(username: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('username', username)
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
      logger.error('Error finding user by username:', error);
      throw error;
    }
  }

  /**
   * Find user by email address
   * Used for email-based authentication (if implemented)
   *
   * @param email - The email address to search for
   * @returns User object if found, null otherwise
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.from('User').select('*').eq('email', email).single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find user by user ID
   * Used for profile retrieval and user validation
   *
   * @param id - The user ID to search for
   * @returns User object if found, null otherwise
   */
  async findUserById(id: number): Promise<User | null> {
    try {
      const { data, error } = await supabase.from('User').select('*').eq('user_id', id).single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Create new user account
   * Inserts new user data into the database
   *
   * @param userData - Complete user data for account creation
   * @returns Created user object with generated ID
   * @throws Error if username already exists or database operation fails
   */
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const { data, error } = await supabase.from('User').insert([userData]).select().single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }
}
