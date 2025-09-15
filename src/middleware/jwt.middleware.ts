/**
 * JWT Authentication Middleware
 * 
 * Provides JWT token validation for protected routes in the Budget Buddy API.
 * This middleware:
 * - Extracts Bearer tokens from Authorization headers
 * - Validates JWT tokens using the configured secret
 * - Attaches user payload to the request context
 * - Handles authentication errors with proper HTTP status codes
 * 
 * Usage: Apply to route groups that require authentication
 * The middleware will automatically reject requests without valid tokens
 * and attach user information for authenticated requests.
 */

import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";

// JWT Middleware Configuration
export const jwtMiddleware = new Elysia()
  // Configure JWT with secret key (use environment variable in production)
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'budget-buddy-secret-key-2024'
  }))
  // Enable Bearer token extraction from Authorization header
  .use(bearer())
  // Derive user information from validated JWT token
  .derive(async ({ bearer, jwt }) => {
    // Check if Authorization Bearer token is present
    if (!bearer) {
      throw new Error('Authorization token required');
    }

    // Verify and decode the JWT token
    const payload = await jwt.verify(bearer);
    if (!payload) {
      throw new Error('Invalid token');
    }

    // Attach user information to request context for use in protected routes
    return {
      user: payload
    };
  })
  // Handle authentication errors with appropriate HTTP responses
  .onError(({ error, code, set }) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage === 'Authorization token required' || 
        errorMessage === 'Invalid token') {
      set.status = 401;
      return {
        success: false,
        message: errorMessage
      };
    }
  });