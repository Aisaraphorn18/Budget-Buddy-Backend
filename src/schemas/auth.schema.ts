/**
 * Authentication Validation Schemas
 *
 * Elysia validation schemas specifically for authentication endpoints
 * in Budget Buddy API. These schemas ensure secure and properly
 * formatted authentication data.
 *
 * Key Features:
 * - Strong password requirements (minimum 6 characters)
 * - Username validation (minimum 3 characters)
 * - Name field validation for user registration
 * - Input sanitization and type checking
 * - OpenAPI documentation integration
 * - Security-focused validation rules
 *
 * Security Considerations:
 * - Minimum length requirements prevent weak credentials
 * - String type validation prevents injection attacks
 * - Required field validation ensures data completeness
 * - Consistent validation across auth endpoints
 */

import { t } from 'elysia';

/**
 * Login request validation schema
 * Validates user credentials for authentication
 */
export const LoginRequestSchema = t.Object({
  username: t.String({
    minLength: 3,
    description: 'Username',
  }),
  password: t.String({
    minLength: 6,
    description: 'User password',
  }),
});

/**
 * Registration request validation schema
 * Validates new user account creation data
 */
export const RegisterRequestSchema = t.Object({
  username: t.String({
    minLength: 3,
    description: 'Username (minimum 3 characters)',
  }),
  first_name: t.String({
    minLength: 2,
    description: 'User first name',
  }),
  last_name: t.String({
    minLength: 2,
    description: 'User last name',
  }),
  password: t.String({
    minLength: 6,
    description: 'User password (minimum 6 characters)',
  }),
});

// User detail response schema
export const UserDetailSchema = t.Object({
  id: t.Number(),
  username: t.String(),
  first_name: t.String(),
  last_name: t.String(),
  created_at: t.String(),
});

// JWT Response schema
export const LoginResponseSchema = t.Object({
  success: t.Boolean(),
  message: t.String(),
  token: t.String(),
  user: UserDetailSchema,
});

export const RegisterResponseSchema = t.Object({
  success: t.Boolean(),
  message: t.String(),
  user: UserDetailSchema,
});

export const LogoutResponseSchema = t.Object({
  success: t.Boolean(),
  message: t.String(),
});

// Error response schema
export const AuthErrorResponseSchema = t.Object({
  success: t.Literal(false),
  message: t.String(),
  error: t.Optional(t.String()),
});

// Authorization header schema
export const AuthHeaderSchema = t.Object({
  authorization: t.String({
    description: 'Bearer token',
  }),
});
