/**
 * Budget Buddy Backend API
 *
 * A comprehensive RESTful API for personal finance management built with ElysiaJS and Supabase.
 * Features include user authentication, transaction tracking, budget manaconsole.log("💸 Transactions:");
console.log("  POST   /protected/api/v1/transactions     - Create transaction");
console.log(
  "  GET    /protected/api/v1/transactions     - Get transactions (with filters)"
);
console.log(
  "  GET    /protected/api/v1/transactions/:id - Get transaction by ID"
);
console.log("  GET    /protected/api/v1/transactions/user/:user_id - Get transactions by user ID (admin)");
console.log("  PATCH  /protected/api/v1/transactions/:id - Update transaction");
console.log("  DELETE /protected/api/v1/transactions/:id - Delete transaction");
console.log("");
console.log("📊 Budgets:");
console.log("  POST   /protected/api/v1/budgets          - Create budget");
console.log(
  "  GET    /protected/api/v1/budgets          - Get budgets (with filters)"
);
console.log("  GET    /protected/api/v1/budgets/:id      - Get budget by ID");
console.log("  GET    /protected/api/v1/budgets/user/:user_id - Get budgets by user ID (admin)");
console.log("  PATCH  /protected/api/v1/budgets/:id     - Update budget");
console.log("  DELETE /protected/api/v1/budgets/:id     - Delete budget");al analytics.
 *
 * Architecture:
 * - Framework: ElysiaJS with TypeScript
 * - Database: Supabase (PostgreSQL)
 * - Authentication: JWT Bearer Token
 * - Documentation: OpenAPI/Swagger
 * - Architecture Pattern: Clean Architecture (Models/Services/Controllers/Routes)
 */

import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import {
  authRoutes, // Authentication routes (register, login, logout, profile)
  healthRoutes, // Health check endpoint
  categoryRoutes, // Category management (public read-only)
  transactionRoutes, // Transaction CRUD operations (protected)
  budgetRoutes, // Budget management (protected)
  homeRoutes, // Dashboard and analytics (protected)
  userRoutes // User management (protected, admin-only)
} from "./routes";

// Initialize Elysia application with comprehensive middleware setup
const app = new Elysia()
  // JWT Configuration - Handles token generation and validation
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "budget-buddy-secret-key-2024" // Use environment variable in production
    })
  )
  // Bearer Token Plugin - Extracts Authorization header for JWT middleware
  .use(bearer())
  // OpenAPI Documentation Plugin - Generates interactive API documentation
  .use(
    openapi({
      documentation: {
        info: {
          title: "Budget Buddy Backend API",
          version: "1.0.0",
          description:
            "RESTful API for Budget Buddy application with JWT Authentication"
        },
        // API endpoint categorization for better documentation organization
        tags: [
          { name: "Health", description: "Health check operations" },
          {
            name: "Authentication",
            description: "User authentication and authorization"
          },
          { name: "Categories", description: "Category management operations" },
          {
            name: "Transactions",
            description: "Transaction management operations"
          },
          { name: "Budgets", description: "Budget management operations" },
          {
            name: "Home & Analytics",
            description: "Dashboard and analytics operations"
          },
          {
            name: "User Management",
            description: "Administrative user management operations"
          }
        ],
        // Security scheme configuration for JWT authentication
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT"
            }
          }
        }
      }
    })
  )
  // CORS Configuration - Enables cross-origin requests for frontend integration
  .use(
    cors({
      origin: true, // Allow all origins (configure specific domains in production)
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true // Allow cookies and authentication headers
    })
  )

  // Route Registration
  // Public routes (no authentication required)
  .use(healthRoutes) // Health check endpoint
  .use(authRoutes) // Authentication endpoints (register, login, logout, profile)

  // Protected routes group (JWT authentication required)
  .group(
    "/protected",
    (app) =>
      app
        .derive(async ({ bearer, jwt }) => {
          // Check if Authorization Bearer token is present
          if (!bearer) {
            console.log("❌ No bearer token found");
            throw new Error("Authorization token required");
          }

          // Verify and decode the JWT token
          const payload = await jwt.verify(bearer);
          console.log("🔍 JWT - Payload:", payload);
          if (!payload) {
            console.log("❌ Invalid token payload");
            throw new Error("Invalid token");
          }

          const user = {
            user_id: payload.userId, // Convert userId to user_id for consistency
            username: payload.username,
            ...payload
          };

          // Attach user information to request context for use in protected routes
          return {
            user
          };
        })
        .onError(({ error, code, set }) => {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

          if (
            errorMessage === "Authorization token required" ||
            errorMessage === "Invalid token"
          ) {
            set.status = 401;
            return {
              success: false,
              message: errorMessage
            };
          }
        })
        .use(categoryRoutes) // Category management operations
        .use(transactionRoutes) // Transaction CRUD operations
        .use(budgetRoutes) // Budget management operations
        .use(homeRoutes) // Dashboard and analytics operations
        .use(userRoutes) // User management operations (admin-only)
  )

  // Global Error Handling - Provides consistent error responses across all endpoints
  .onError(({ error, code, set }) => {
    console.error("API Error:", error);

    // Handle specific error types with appropriate HTTP status codes
    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        success: false,
        message: "Route not found",
        data: null
      };
    }

    if (code === "VALIDATION") {
      set.status = 400;
      return {
        success: false,
        message: "Validation error",
        data: null
      };
    }

    // Default error response for unexpected errors
    set.status = 500;
    return {
      success: false,
      message: "Internal server error",
      data: null
    };
  })

  // Start the server on port 3000
  .listen(3000);

// Server startup logging
console.log(
  `🦊 Budget Buddy Backend is running at ${app.server?.hostname}:${app.server?.port}`
);

// API Endpoint Documentation - Provides a comprehensive list of all available endpoints
console.log("📚 Available API Endpoints:");
console.log("🔓 Public Routes:");
console.log("  GET    /health                     - Health check");
console.log("  POST   /api/v1/auth/register       - Register new user");
console.log("  POST   /api/v1/auth/login          - User login");
console.log("  POST   /api/v1/auth/logout         - User logout");
console.log("  GET    /api/v1/auth/profile        - Get user profile");
console.log("");
console.log("🔒 Protected Routes (Require JWT Token):");
console.log("� Categories:");
console.log("  GET    /protected/api/v1/categories     - Get all categories");
console.log("  GET    /protected/api/v1/categories/:id - Get category by ID");
console.log("  POST   /protected/api/v1/categories     - Create new category");
console.log("  PATCH  /protected/api/v1/categories/:id - Update category");
console.log("  DELETE /protected/api/v1/categories/:id - Delete category");
console.log("");
console.log("�💸 Transactions:");
console.log("  POST   /protected/api/v1/transactions     - Create transaction");
console.log(
  "  GET    /protected/api/v1/transactions     - Get transactions (with filters)"
);
console.log(
  "  GET    /protected/api/v1/transactions/:id - Get transaction by ID"
);
console.log("  PATCH  /protected/api/v1/transactions/:id - Update transaction");
console.log("  DELETE /protected/api/v1/transactions/:id - Delete transaction");
console.log("");
console.log("📊 Budgets:");
console.log("  POST   /protected/api/v1/budgets          - Create budget");
console.log(
  "  GET    /protected/api/v1/budgets          - Get budgets (with filters)"
);
console.log("  GET    /protected/api/v1/budgets/:id      - Get budget by ID");
console.log("  PATCH  /protected/api/v1/budgets/:id     - Update budget");
console.log("  DELETE /protected/api/v1/budgets/:id     - Delete budget");
console.log("");
console.log("🏠 Home & Analytics:");
console.log(
  "  GET    /protected/api/v1/home             - Get home dashboard data"
);
console.log(
  "  GET    /protected/api/v1/recent-transactions - Get recent transactions"
);
console.log(
  "  GET    /protected/api/v1/analytics/summary - Get analytics summary"
);
console.log(
  "  GET    /protected/api/v1/analytics/by-category - Get analytics by category"
);
console.log("  GET    /protected/api/v1/analytics/flow   - Get analytics flow");
console.log("");
console.log("� User Management (Admin Only):");
console.log("  GET    /protected/api/v1/users           - Get all users (with search & pagination)");
console.log("  GET    /protected/api/v1/users/:id       - Get user by ID (with stats)");
console.log("  DELETE /protected/api/v1/users/:id       - Delete user account");
console.log("");
console.log("�📖 API Documentation:");
console.log(
  `  OpenAPI JSON: http://${app.server?.hostname}:${app.server?.port}/openapi`
);
