/**
 * Authentication Routes
 *
 * Defines all authentication-related HTTP endpoints for Budget Buddy.
 * Handles user registration, login, logout, and profile management.
 *
 * Routes:
 * - POST /api/v1/auth/register - Create new user account
 * - POST /api/v1/auth/login - User authentication and JWT token generation
 * - POST /api/v1/auth/logout - User logout (token invalidation)
 * - GET /api/v1/auth/profile - Retrieve user profile (requires authentication)
 *
 * Features:
 * - Input validation with Elysia schemas
 * - OpenAPI documentation integration
 * - JWT token management
 * - Proper HTTP status codes and error handling
 * - Security middleware for protected routes
 *
 * Security:
 * - Password hashing with bcryptjs
 * - JWT token generation and validation
 * - Bearer token authentication
 * - Input sanitization and validation
 */

import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { bearer } from '@elysiajs/bearer';
import { AuthController } from '../controllers/auth.controller';
import { LoginRequestSchema, RegisterRequestSchema } from '../schemas/auth.schema';
import { withAuth } from '../types/elysia.types';

const authController = new AuthController();

// Authentication routes with /api/v1/auth prefix
export const authRoutes = new Elysia({ prefix: '/api/v1/auth' })
  // JWT configuration for token generation and validation
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'budget-buddy-secret-key-2024',
    })
  )
  // Bearer token middleware for Authorization header processing
  .use(bearer())

  // User Registration Endpoint
  .post('/register', async context => await authController.register(withAuth(context)), {
    body: RegisterRequestSchema,
    detail: {
      tags: ['Authentication'],
      summary: 'Register new user',
      description: 'Create a new user account with hashed password',
    },
  })

  // User Login Endpoint
  .post('/login', async context => await authController.login(withAuth(context)), {
    body: LoginRequestSchema,
    detail: {
      tags: ['Authentication'],
      summary: 'User login',
      description: 'Authenticate user and return JWT token',
    },
  })

  // User Logout Endpoint
  .post('/logout', async context => await authController.logout(withAuth(context)), {
    detail: {
      tags: ['Authentication'],
      summary: 'User logout',
      description: 'Logout user (client-side token removal)',
    },
  })

  // User Profile Endpoint (Protected)
  .get('/profile', async context => await authController.getProfile(withAuth(context)), {
    headers: t.Object({
      authorization: t.String({ description: 'Bearer JWT token' }),
    }),
    detail: {
      tags: ['Authentication'],
      summary: 'Get user profile',
      description: 'Get current user profile information (requires JWT token)',
      security: [{ bearerAuth: [] }],
    },
  });
