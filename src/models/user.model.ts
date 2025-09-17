/**
 * User Model Interfaces
 *
 * Type definitions for user-related data structures in Budget Buddy.
 * These interfaces ensure type safety throughout the application and define
 * the structure of user data as it flows between database, services, and API responses.
 *
 * Key Features:
 * - Strong typing for user authentication and profile data
 * - Separate interfaces for internal use vs. API responses (password exclusion)
 * - Request/response DTOs for clean API contracts
 * - Consistent field naming with database schema
 */

/**
 * Complete user record as stored in database
 * Contains all user fields including sensitive data like password
 */
export interface User {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  created_date: string;
}

/**
 * User data for API responses
 * Excludes sensitive information like password for security
 */
export interface UserResponse {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  created_date: string;
}

/**
 * Data required to create a new user account
 * Used for registration endpoint validation
 */
export interface CreateUserRequest {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}

/**
 * Data for updating existing user account
 * All fields are optional to support partial updates
 */
export interface UpdateUserRequest {
  username?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
}

/**
 * Standard API response wrapper
 * Provides consistent response format across all endpoints
 * @template T - Type of the data payload
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
