/**
 * User Validation Schemas
 * 
 * Elysia validation schemas for user-related data structures in Budget Buddy.
 * These schemas define validation rules for user authentication, registration,
 * and profile management endpoints.
 * 
 * Key Features:
 * - Strong typing for user data validation
 * - Separate schemas for requests and responses
 * - Password field exclusion in response schemas for security
 * - Detailed field descriptions for OpenAPI documentation
 * - Generic response wrappers for consistent API format
 * 
 * Security Considerations:
 * - Password fields are included only in request schemas
 * - Response schemas exclude sensitive information
 * - Consistent validation across all user-related endpoints
 * - Type safety for authentication flows
 */

import { t, type TSchema } from "elysia";

// ==================== USER SCHEMAS ====================

/**
 * Complete user data schema (internal use)
 * Includes all user fields including sensitive data like password
 */
export const UserSchema = t.Object({
  user_id: t.Number({ description: "Unique identifier for the user" }),
  username: t.String({ description: "Username of the user" }),
  first_name: t.String({ description: "First name of the user" }),
  last_name: t.String({ description: "Last name of the user" }),
  password: t.String({ description: "User password (hashed)" }),
  created_date: t.String({
    description: "Date when user was created (ISO string)"
  })
});

/**
 * User response schema (API responses)
 * Excludes sensitive information like password for security
 */
export const UserResponseSchema = t.Object({
  user_id: t.Number({ description: "Unique identifier for the user" }),
  username: t.String({ description: "Username of the user" }),
  first_name: t.String({ description: "First name of the user" }),
  last_name: t.String({ description: "Last name of the user" }),
  created_date: t.String({
    description: "Date when user was created (ISO string)"
  })
});

export const CreateUserRequestSchema = t.Object({
  username: t.String({
    description: "Username for the new user",
    minLength: 3,
    maxLength: 50
  }),
  first_name: t.String({
    description: "First name of the user",
    minLength: 1,
    maxLength: 100
  }),
  last_name: t.String({
    description: "Last name of the user",
    minLength: 1,
    maxLength: 100
  }),
  password: t.String({
    description: "Password for the user",
    minLength: 6
  })
});

export const UpdateUserRequestSchema = t.Object({
  username: t.Optional(
    t.String({
      description: "Username for the user",
      minLength: 3,
      maxLength: 50
    })
  ),
  first_name: t.Optional(
    t.String({
      description: "First name of the user",
      minLength: 1,
      maxLength: 100
    })
  ),
  last_name: t.Optional(
    t.String({
      description: "Last name of the user",
      minLength: 1,
      maxLength: 100
    })
  ),
  password: t.Optional(
    t.String({
      description: "Password for the user",
      minLength: 6
    })
  )
});

// API Response Schemas
export const ApiResponseSchema = <T extends TSchema>(dataSchema: T) =>
  t.Object({
    success: t.Boolean({
      description: "Indicates if the request was successful"
    }),
    message: t.String({ description: "Response message" }),
    data: dataSchema
  });

export const ErrorResponseSchema = t.Object({
  success: t.Boolean({
    description: "Always false for error responses"
  }),
  message: t.String({ description: "Error message" }),
  data: t.Null({ description: "No data in error responses" })
});

// Specific Response Schemas
export const GetAllUsersResponseSchema = ApiResponseSchema(
  t.Array(UserResponseSchema, { description: "Array of user objects" })
);

export const GetUserByIdResponseSchema = ApiResponseSchema(UserResponseSchema);

export const CreateUserResponseSchema = ApiResponseSchema(UserResponseSchema);

export const UpdateUserResponseSchema = ApiResponseSchema(UserResponseSchema);

export const DeleteUserResponseSchema = ApiResponseSchema(
  t.Null({ description: "No data returned for delete operations" })
);

// Parameter Schemas
export const UserIdParamSchema = t.Object({
  id: t.Numeric({
    description: "User ID",
    minimum: 1
  })
});
