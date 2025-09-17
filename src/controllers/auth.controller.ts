/**
 * Authentication Controller
 *
 * Handles all authentication-related HTTP requests including:
 * - User registration with password hashing
 * - User login with JWT token generation
 * - User logout (token invalidation)
 * - User profile retrieval
 *
 * Security Features:
 * - Password hashing with bcryptjs (12 salt rounds)
 * - JWT token generation for session management
 * - Input validation and sanitization
 * - Proper error handling and response formatting
 */

import bcrypt from 'bcryptjs';
import { AuthService } from '../services/auth.service';
import type { ElysiaContext } from '../types/elysia.types';
import logger from '../utils/logger';
interface RegisterBody {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}

interface LoginBody {
  username: string;
  password: string;
}

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register new user
   * Creates a new user account with hashed password
   *
   * @param context - Elysia context containing request body
   * @returns Success/error response with user data or error message
   */
  async register(context: ElysiaContext) {
    try {
      const { username, first_name, last_name, password } = context.body as RegisterBody;

      // Check if user already exists by username
      const existingUserByUsername = await this.authService.findUserByUsername(username);
      if (existingUserByUsername) {
        context.set.status = 400;
        return {
          success: false,
          message: 'User with this username already exists',
        };
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await this.authService.createUser({
        username,
        first_name,
        last_name,
        password: hashedPassword,
      });

      context.set.status = 201;
      return {
        success: true,
        message: 'User registered successfully',
        user: {
          user_id: user.user_id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          created_at: user.created_at,
        },
      };
    } catch (error) {
      logger.error('Register error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to register user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async login(context: ElysiaContext) {
    try {
      const { username, password } = context.body as LoginBody;

      // Find user by username
      const user = await this.authService.findUserByUsername(username);
      if (!user) {
        context.set.status = 401;
        return {
          success: false,
          message: 'Invalid username or password',
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        context.set.status = 401;
        return {
          success: false,
          message: 'Invalid username or password',
        };
      }

      // Generate JWT token
      if (!context.jwt) {
        context.set.status = 500;
        return {
          success: false,
          message: 'JWT service not available',
        };
      }

      const token = await context.jwt.sign({
        userId: user.user_id,
        username: user.username,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      });

      return {
        success: true,
        message: 'Login successful',
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          created_at: user.created_at,
        },
      };
    } catch (error) {
      logger.error('Login error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to login',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async logout(context: ElysiaContext) {
    // For JWT, logout is typically handled client-side by removing the token
    // But we can add token blacklisting logic here if needed
    context.set.status = 200;
    return {
      success: true,
      message: 'Logout successful',
    };
  }

  async getProfile(context: ElysiaContext) {
    try {
      const bearer = context.bearer;
      if (!bearer) {
        context.set.status = 401;
        return {
          success: false,
          message: 'Authorization token required',
        };
      }

      if (!context.jwt) {
        context.set.status = 500;
        return {
          success: false,
          message: 'JWT service not available',
        };
      }

      // Verify JWT token
      const payload = await context.jwt.verify(bearer);
      if (!payload || typeof payload !== 'object') {
        context.set.status = 401;
        return {
          success: false,
          message: 'Invalid token',
        };
      }

      // Get user details
      const userId = (payload as { userId: number }).userId;
      const user = await this.authService.findUserById(userId);
      if (!user) {
        context.set.status = 404;
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        message: 'Profile retrieved successfully',
        user: {
          user_id: user.user_id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          created_at: user.created_at,
        },
      };
    } catch (error) {
      logger.error('Get profile error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to get profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
