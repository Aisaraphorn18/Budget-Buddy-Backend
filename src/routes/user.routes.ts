import { Elysia, t } from "elysia";
import { UserController } from "../controllers/user.controller";
import {
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
  UserIdParamSchema,
  GetAllUsersResponseSchema,
  GetUserByIdResponseSchema,
  CreateUserResponseSchema,
  UpdateUserResponseSchema,
  DeleteUserResponseSchema,
  ErrorResponseSchema
} from "../schemas/user.schema";

export const userRoutes = new Elysia({ prefix: "/api/v1/account" })
  .get("/GetAllUser", UserController.getAllUsers, {
    detail: {
      tags: ["Users"],
      summary: "Get All Users",
      description: "Retrieve a list of all users"
    },
    response: {
      200: GetAllUsersResponseSchema
    }
  })
  .get("/user/:id", UserController.getUserById, {
    params: UserIdParamSchema,
    detail: {
      tags: ["Users"],
      summary: "Get User by ID",
      description: "Retrieve a specific user by ID"
    },
    response: {
      200: GetUserByIdResponseSchema,
      404: ErrorResponseSchema
    }
  })
  .post("/user", UserController.createUser, {
    body: CreateUserRequestSchema,
    detail: {
      tags: ["Users"],
      summary: "Create User",
      description: "Create a new user account"
    },
    response: {
      201: CreateUserResponseSchema,
      409: ErrorResponseSchema
    }
  })
  .put("/user/:id", UserController.updateUser, {
    params: UserIdParamSchema,
    body: UpdateUserRequestSchema,
    detail: {
      tags: ["Users"],
      summary: "Update User",
      description: "Update an existing user"
    },
    response: {
      200: UpdateUserResponseSchema,
      404: ErrorResponseSchema,
      409: ErrorResponseSchema
    }
  })
  .delete("/user/:id", UserController.deleteUser, {
    params: UserIdParamSchema,
    detail: {
      tags: ["Users"],
      summary: "Delete User",
      description: "Delete a user from the system"
    },
    response: {
      200: DeleteUserResponseSchema,
      404: ErrorResponseSchema
    }
  });
