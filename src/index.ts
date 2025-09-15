import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { userRoutes, healthRoutes } from "./routes";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: "Budget Buddy Backend API",
          version: "1.0.0",
          description: "RESTful API for Budget Buddy application"
        },
        tags: [
          { name: "Health", description: "Health check operations" },
          { name: "Users", description: "User management operations" }
        ]
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
  .use(userRoutes)

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
console.log("  GET    /api/v1/account/GetAllUser    - Get all users");
console.log("  GET    /api/v1/account/user/:id     - Get user by ID");
console.log("  POST   /api/v1/account/user         - Create new user");
console.log("  PUT    /api/v1/account/user/:id     - Update user");
console.log("  DELETE /api/v1/account/user/:id     - Delete user");
console.log("");
console.log("📖 API Documentation:");
console.log(
  `  OpenAPI JSON: http://${app.server?.hostname}:${app.server?.port}/openapi`
);
