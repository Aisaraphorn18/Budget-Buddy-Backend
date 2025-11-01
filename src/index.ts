/**
 * Budget Buddy Backend API
 *
 * A comprehensive RESTful API for personal finance management built with ElysiaJS and Supabase.
 * Features include user authentication, transaction tracking, budget management, and financial analytics.
logger.info("  POST   /protected/api/v1/transactions     - Create transaction");
logger.info(
  "  GET    /protected/api/v1/transactions     - Get transactions (with filters)"
);
logger.info(
  "  GET    /protected/api/v1/transactions/:id - Get transaction by ID"
);
logger.info("  GET    /protected/api/v1/transactions/user/:user_id - Get transactions by user ID (admin)");
logger.info("  PUT  /protected/api/v1/transactions/:id - Update transaction");
logger.info("  DELETE /protected/api/v1/transactions/:id - Delete transaction");
logger.info("");
logger.info("📊 Budgets:");
logger.info("  POST   /protected/api/v1/budgets          - Create budget");
logger.info(
  "  GET    /protected/api/v1/budgets          - Get budgets (with filters)"
);
logger.info("  GET    /protected/api/v1/budgets/:id      - Get budget by ID");
logger.info("  GET    /protected/api/v1/budgets/user/:user_id - Get budgets by user ID (admin)");
logger.info("  PUT  /protected/api/v1/budgets/:id     - Update budget");
logger.info("  DELETE /protected/api/v1/budgets/:id     - Delete budget");al analytics.
 *
 * Architecture:
 * - Framework: ElysiaJS with TypeScript
 * - Database: Supabase (PostgreSQL)
 * - Authentication: JWT Bearer Token
 * - Documentation: OpenAPI/Swagger
 * - Architecture Pattern: Clean Architecture (Models/Services/Controllers/Routes)
 */

import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { bearer } from '@elysiajs/bearer';
import {
  authRoutes, // Authentication routes (register, login, logout, profile)
  healthRoutes, // Health check endpoint
  categoryRoutes, // Category management (public read-only)
  transactionRoutes, // Transaction CRUD operations (protected)
  budgetRoutes, // Budget management (protected)
  reportsRoutes, // Reports and analytics (protected)
  userRoutes, // User management (protected, admin-only)
} from './routes';
import logger from './utils/logger';
import { csrfPlugin, csrfTokens } from './middleware/csrf';
// Initialize Elysia application with comprehensive middleware setup
const app = new Elysia()
  // JWT Configuration - Handles token generation and validation
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'budget-buddy-secret-key-2024', // Use environment variable in production
    })
  )
  // Bearer Token Plugin - Extracts Authorization header for JWT middleware
  .use(bearer())
  // OpenAPI Documentation Plugin - Generates interactive API documentation
  .use(
    openapi({
      documentation: {
        info: {
          title: 'Budget Buddy Backend API',
          version: '1.0.0',
          description: 'RESTful API for Budget Buddy application with JWT Authentication',
        },
        // API endpoint categorization for better documentation organization
        tags: [
          { name: 'Health', description: 'Health check operations' },
          {
            name: 'Authentication',
            description: 'User authentication and authorization',
          },
          { name: 'Categories', description: 'Category management operations' },
          {
            name: 'Transactions',
            description: 'Transaction management operations',
          },
          { name: 'Budgets', description: 'Budget management operations' },
          {
            name: 'Reports',
            description: 'Report and analytics operations',
          },
          {
            name: 'User Management',
            description: 'Administrative user management operations',
          },
        ],
        // Security scheme configuration for JWT authentication
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    })
  )
  // CORS Configuration - Enables cross-origin requests for frontend integration
  .use(
    cors({
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',') // Multiple origins from env: "http://localhost:3000,https://yourdomain.com"
        : true, // Development: allow all origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
      credentials: true, // Allow cookies and authentication headers
    })
  )

  // CSRF Protection - Prevents Cross-Site Request Forgery attacks
  .use(csrfPlugin)

  // CSRF Validation Middleware - Applied globally to all routes
  .onBeforeHandle(({ request, cookie, headers }) => {
    const method = request.method;
    const url = new globalThis.URL(request.url);
    const pathname = url.pathname;

    // Debug log
    logger.info('🛡️ [GLOBAL] CSRF Middleware:', {
      method,
      pathname,
      nodeEnv: process.env.NODE_ENV,
      hasCSRFHeader: !!headers['x-csrf-token'],
      hasSessionCookie: !!cookie.session_id?.value,
    });

    // Skip CSRF ONLY for specific whitelisted endpoints
    // Only these GET endpoints are allowed without CSRF token
    const csrfWhitelist = ['/health', '/api/v1/csrf-token'];

    if (method === 'GET' && csrfWhitelist.includes(pathname)) {
      logger.info('✅ CSRF Skip: Whitelisted GET endpoint:', pathname);
      return;
    }

    // Skip CSRF check for OPTIONS (CORS preflight)
    if (method === 'OPTIONS') {
      logger.info('✅ CSRF Skip: OPTIONS preflight');
      return;
    }

    // Skip CSRF only in development/local environment
    // Railway and Vercel deployments MUST use CSRF protection
    const nodeEnv = process.env.NODE_ENV?.toLowerCase();
    const isLocal = nodeEnv === 'development' || nodeEnv === 'local';

    logger.info('🔍 CSRF Check:', { nodeEnv, isLocal });

    if (isLocal) {
      logger.info('✅ CSRF Skip: Local development');
      return;
    }

    // For Railway and Vercel (production/uat/undefined), require CSRF for ALL requests
    // This includes: POST, PUT, DELETE, and ALL GET requests except whitelisted ones
    logger.info('🔒 CSRF Required for production/deployment');

    const csrfToken = headers['x-csrf-token'];
    const sessionId = cookie.session_id?.value as string | undefined;

    if (!csrfToken || !sessionId) {
      throw new Error('CSRF token required');
    }

    // Check token from csrf middleware storage
    const storedToken = csrfTokens.get(sessionId);

    if (!storedToken) {
      throw new Error('Invalid or expired CSRF token');
    }

    if (storedToken.expiresAt < Date.now()) {
      csrfTokens.delete(sessionId);
      throw new Error('CSRF token expired');
    }

    if (storedToken.token !== csrfToken) {
      throw new Error('Invalid CSRF token');
    }

    // Token is valid, continue
    logger.info('✅ CSRF token validated successfully');
    return;
  })

  // Route Registration
  // Public routes (no authentication required)
  .use(healthRoutes) // Health check endpoint
  .use(authRoutes) // Authentication endpoints (register, login, logout, profile)

  // Protected routes group (JWT authentication required)
  .group(
    '/protected',
    app =>
      app
        .derive(async ({ bearer, jwt }) => {
          // Check if Authorization Bearer token is present
          if (!bearer) {
            logger.info('❌ No bearer token found');
            throw new Error('Authorization token required');
          }

          // Verify and decode the JWT token
          const payload = await jwt.verify(bearer);
          // logger.info('🔍 JWT - Payload:', payload);
          if (!payload) {
            logger.info('❌ Invalid token payload');
            throw new Error('Invalid token');
          }

          const user = {
            user_id: payload.userId, // Convert userId to user_id for consistency
            username: payload.username,
            ...payload,
          };

          // Attach user ation to request context for use in protected routes
          return {
            user,
          };
        })
        .onError(({ error, set }) => {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';

          if (errorMessage === 'Authorization token required' || errorMessage === 'Invalid token') {
            set.status = 401;
            return {
              success: false,
              message: errorMessage,
            };
          }
        })
        .use(categoryRoutes) // Category management operations
        .use(transactionRoutes) // Transaction CRUD operations
        .use(budgetRoutes) // Budget management operations
        .use(reportsRoutes) // Reports and analytics operations
        .use(userRoutes) // User management operations (admin-only)
  )

  // Global Error Handling - Provides consistent error responses across all endpoints
  .onError(({ error, code, set }) => {
    logger.error('API Error:', error);

    // Handle specific error types with appropriate HTTP status codes
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        success: false,
        message: 'Route not found',
        data: null,
      };
    }

    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        success: false,
        message: 'Validation error',
        data: null,
      };
    }

    // Default error response for unexpected errors
    set.status = 500;
    return {
      success: false,
      message: 'Internal server error',
      data: null,
    };
  })

  // Start the server - Railway will provide PORT via environment variable
  .listen({
    port: parseInt(process.env.PORT || '3000'),
    hostname: '0.0.0.0', // Listen on all network interfaces for Railway/Docker
  });

// API Endpoint Documentation - Provides a comprehensive list of all available endpoints
logger.info(`
🦊 Budget Buddy Backend is running at ${app.server?.hostname}:${app.server?.port}

📚 Available API Endpoints:

🔓 Public Routes:
  GET    /health                     - Health check
  POST   /api/v1/auth/register       - Register new user
  POST   /api/v1/auth/login          - User login
  POST   /api/v1/auth/logout         - User logout
  GET    /api/v1/auth/profile        - Get user profile

🔒 Protected Routes (Require JWT Token):
📂 Categories:
  GET    /protected/api/v1/categories     - Get all categories
  GET    /protected/api/v1/categories/:id - Get category by ID
  POST   /protected/api/v1/categories     - Create new category
  PUT  /protected/api/v1/categories/:id - Update category
  DELETE /protected/api/v1/categories/:id - Delete category

💸 Transactions:
  POST   /protected/api/v1/transactions     - Create transaction
  GET    /protected/api/v1/transactions     - Get transactions (with filters)
  GET    /protected/api/v1/transactions/:id - Get transaction by ID
  PUT  /protected/api/v1/transactions/:id - Update transaction
  DELETE /protected/api/v1/transactions/:id - Delete transaction

📊 Budgets:
  POST   /protected/api/v1/budgets          - Create budget
  GET    /protected/api/v1/budgets          - Get budgets (with filters)
  GET    /protected/api/v1/budgets/:id      - Get budget by ID
  PUT  /protected/api/v1/budgets/:id     - Update budget
  DELETE /protected/api/v1/budgets/:id     - Delete budget

🏠 Reports & Analytics:
  GET    /protected/api/v1/reports/summary           - Get financial summary
  GET    /protected/api/v1/reports/recent-transactions - Get recent transactions
  GET    /protected/api/v1/reports/income-vs-expense - Get income vs expense analysis
  GET    /protected/api/v1/reports/expenses-by-category - Get expenses by category
  GET    /protected/api/v1/reports/monthly-close     - Get monthly close report

� Admin Only Routes:
  GET    /protected/api/v1/transactions/user/:user_id - Get transactions by user ID (admin)
  GET    /protected/api/v1/budgets/user/:user_id      - Get budgets by user ID (admin)

�👥 User Management (Admin Only):
  GET    /protected/api/v1/users           - Get all users (with search & pagination)
  GET    /protected/api/v1/users/:id       - Get user by ID (with stats)
  DELETE /protected/api/v1/users/:id       - Delete user account

📖 API Documentation:
  OpenAPI JSON: http://${app.server?.hostname}:${app.server?.port}/openapi
`);
