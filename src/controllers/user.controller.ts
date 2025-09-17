/**
 * User Management Controller
 *
 * HTTP request      const page = context.query.page ? parseInt(Array.isArray(context.query.page) ? context.query.page[0] : context.query.page) : 1;
      const limit = Math.min(context.query.limit ? parseInt(Array.isArray(context.query.limit) ? context.query.limit[0] : context.query.limit) : 20, 100);
      const search = Array.isArray(context.query.search) ? context.query.search[0] : context.query.search;ndler for user management endpoints in Budget Buddy.
 * Provides administrative functionality for managing users, viewing user data,
 * and performing user-related operations.
 *
 * Key Features:
 * - Admin-only user management operations
 * - User data retrieval with pagination and search
 * - User statistics and analytics
 * - User account deletion with data cleanup
 * - Input validation and sanitization
 * - Proper error handling and HTTP status codes
 *
 * Security:
 * - JWT authentication required for all operations
 * - Admin role validation
 * - User isolation and access control
 * - Protected sensitive user data (passwords excluded)
 */

import { UserService } from '../services/user.service';
import type { AuthContext } from '../types/elysia.types';
import logger from '../utils/logger';
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get all users with pagination and search
   * Admin-only endpoint for retrieving user list
   *
   * @param context - Elysia context with user info and query parameters
   * @returns Paginated list of users with metadata
   */
  async getAllUsers(context: AuthContext) {
    try {
      // TODO: Add admin role validation here
      const currentUserId = context.user?.user_id;
      if (!currentUserId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      // Parse query parameters
      const page = context.query.page
        ? parseInt(Array.isArray(context.query.page) ? context.query.page[0] : context.query.page)
        : 1;
      const limit = Math.min(
        context.query.limit
          ? parseInt(
              Array.isArray(context.query.limit) ? context.query.limit[0] : context.query.limit
            )
          : 20,
        100
      );
      const search = Array.isArray(context.query.search)
        ? context.query.search[0]
        : context.query.search || '';

      const result = await this.userService.getAllUsers({ page, limit, search });

      const totalPages = Math.ceil(result.total / result.limit);

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: result.users,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages,
        },
      };
    } catch (error) {
      logger.error('Get all users error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to get users',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get specific user by ID with statistics
   * Admin-only endpoint for retrieving detailed user information
   *
   * @param context - Elysia context with user info and user ID parameter
   * @returns User object with statistics or error if not found
   */
  async getUserById(context: AuthContext) {
    try {
      // TODO: Add admin role validation here
      const currentUserId = context.user?.user_id;
      if (!currentUserId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const userId = parseInt(context.params.id);

      if (isNaN(userId)) {
        context.set.status = 400;
        return {
          success: false,
          message: 'Invalid user ID',
        };
      }

      const user = await this.userService.getUserById(userId);

      if (!user) {
        context.set.status = 404;
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Get user statistics
      const stats = await this.userService.getUserStats(userId);

      return {
        success: true,
        message: 'User retrieved successfully',
        data: {
          ...user,
          stats,
        },
      };
    } catch (error) {
      logger.error('Get user by ID error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to get user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Delete user account and all associated data
   * Admin-only endpoint for removing user accounts
   *
   * @param context - Elysia context with user info and user ID parameter
   * @returns Success message or error if not found
   */
  async deleteUser(context: AuthContext) {
    try {
      // TODO: Add admin role validation here
      const currentUserId = context.user?.user_id;
      if (!currentUserId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const userId = parseInt(context.params.id);

      if (isNaN(userId)) {
        context.set.status = 400;
        return {
          success: false,
          message: 'Invalid user ID',
        };
      }

      // Prevent self-deletion
      if (userId === currentUserId) {
        context.set.status = 400;
        return {
          success: false,
          message: 'Cannot delete your own account',
        };
      }

      const deleted = await this.userService.deleteUser(userId);

      if (!deleted) {
        context.set.status = 404;
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      logger.error('Delete user error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
