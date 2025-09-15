import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import { authRoutes, healthRoutes } from "./routes";

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
          { name: "Authentication", description: "User authentication and authorization" }
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
console.log("  POST   /api/v1/auth/register       - Register new user");
console.log("  POST   /api/v1/auth/login          - User login");
console.log("  POST   /api/v1/auth/logout         - User logout");
console.log("  GET    /api/v1/auth/profile        - Get user profile");
console.log("");
console.log("📖 API Documentation:");
console.log(
  `  OpenAPI JSON: http://${app.server?.hostname}:${app.server?.port}/openapi`
);
