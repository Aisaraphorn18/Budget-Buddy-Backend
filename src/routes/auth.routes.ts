import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import { AuthController } from "../controllers/auth.controller";
import {
  LoginRequestSchema,
  RegisterRequestSchema
} from "../schemas/auth.schema";

const authController = new AuthController();

export const authRoutes = new Elysia({ prefix: "/api/v1/auth" })
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'budget-buddy-secret-key-2024'
  }))
  .use(bearer())
  .post("/register", 
    async (context) => await authController.register(context),
    {
      body: RegisterRequestSchema,
      detail: {
        tags: ["Authentication"],
        summary: "Register new user",
        description: "Create a new user account with hashed password"
      }
    }
  )
  .post("/login", 
    async (context) => await authController.login(context),
    {
      body: LoginRequestSchema,
      detail: {
        tags: ["Authentication"],
        summary: "User login",
        description: "Authenticate user and return JWT token"
      }
    }
  )
  .post("/logout", 
    async (context) => await authController.logout(context),
    {
      detail: {
        tags: ["Authentication"],
        summary: "User logout",
        description: "Logout user (client-side token removal)"
      }
    }
  )
  .get("/profile", 
    async (context) => await authController.getProfile(context),
    {
      headers: t.Object({
        authorization: t.String({ description: "Bearer JWT token" })
      }),
      detail: {
        tags: ["Authentication"],
        summary: "Get user profile",
        description: "Get current user profile information (requires JWT token)",
        security: [{ bearerAuth: [] }]
      }
    }
  );