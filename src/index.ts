import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import { 
  authRoutes, 
  healthRoutes, 
  categoryRoutes, 
  transactionRoutes, 
  budgetRoutes, 
  homeRoutes 
} from "./routes";
import { jwtMiddleware } from "./middleware/jwt.middleware";

const app = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'budget-buddy-secret-key-2024'
    })
  )
  .use(bearer())
  .use(
    openapi({
      documentation: {
        info: {
          title: "Budget Buddy Backend API",
          version: "1.0.0",
          description: "RESTful API for Budget Buddy application with JWT Authentication"
        },
        tags: [
          { name: "Health", description: "Health check operations" },
          { name: "Authentication", description: "User authentication and authorization" },
          { name: "Categories", description: "Category management operations" },
          { name: "Transactions", description: "Transaction management operations" },
          { name: "Budgets", description: "Budget management operations" },
          { name: "Home & Analytics", description: "Dashboard and analytics operations" }
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        }
      }
    })
  )
  .use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    })
  )

  // Register Routes
  .use(healthRoutes)
  .use(authRoutes)
  .use(categoryRoutes)
  .group("/protected", (app) => 
    app
      .use(jwtMiddleware)
      .use(transactionRoutes)
      .use(budgetRoutes)
      .use(homeRoutes)
  )

  // Error Handling
  .onError(({ error, code, set }) => {
    console.error("API Error:", error);

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

    set.status = 500;
    return {
      success: false,
      message: "Internal server error",
      data: null
    };
  })

  .listen(3000);

console.log(
  `🦊 Budget Buddy Backend is running at ${app.server?.hostname}:${app.server?.port}`
);

console.log("📚 Available API Endpoints:");
console.log("🔓 Public Routes:");
console.log("  GET    /health                     - Health check");
console.log("  POST   /api/v1/auth/register       - Register new user");
console.log("  POST   /api/v1/auth/login          - User login");
console.log("  POST   /api/v1/auth/logout         - User logout");
console.log("  GET    /api/v1/auth/profile        - Get user profile");
console.log("  GET    /api/v1/categories          - Get all categories");
console.log("  GET    /api/v1/categories/:id      - Get category by ID");
console.log("");
console.log("🔒 Protected Routes (Require JWT Token):");
console.log("💸 Transactions:");
console.log("  POST   /protected/api/v1/transactions     - Create transaction");
console.log("  GET    /protected/api/v1/transactions     - Get transactions (with filters)");
console.log("  GET    /protected/api/v1/transactions/:id - Get transaction by ID");
console.log("  PATCH  /protected/api/v1/transactions/:id - Update transaction");
console.log("  DELETE /protected/api/v1/transactions/:id - Delete transaction");
console.log("");
console.log("📊 Budgets:");
console.log("  POST   /protected/api/v1/budgets          - Create budget");
console.log("  GET    /protected/api/v1/budgets          - Get budgets (with filters)");
console.log("  GET    /protected/api/v1/budgets/:id      - Get budget by ID");
console.log("  PATCH  /protected/api/v1/budgets/:id     - Update budget");
console.log("  DELETE /protected/api/v1/budgets/:id     - Delete budget");
console.log("");
console.log("🏠 Home & Analytics:");
console.log("  GET    /protected/api/v1/home             - Get home dashboard data");
console.log("  GET    /protected/api/v1/recent-transactions - Get recent transactions");
console.log("  GET    /protected/api/v1/analytics/summary - Get analytics summary");
console.log("  GET    /protected/api/v1/analytics/by-category - Get analytics by category");
console.log("  GET    /protected/api/v1/analytics/flow   - Get analytics flow");
console.log("");
console.log("📖 API Documentation:");
console.log(
  `  OpenAPI JSON: http://${app.server?.hostname}:${app.server?.port}/openapi`
);
