/**
 * Health Check Routes
 *
 * Provides simple health check endpoints for Budget Buddy API monitoring.
 * These endpoints are used to verify that the API server is running
 * and responding to requests properly.
 *
 * Routes:
 * - GET / - Basic API status and version information
 * - GET /health - Detailed health status with uptime and environment
 *
 * Features:
 * - No authentication required (public endpoints)
 * - JSON response format
 * - Server uptime information
 * - Environment status
 * - Timestamp for monitoring
 * - OpenAPI documentation integration
 *
 * Usage:
 * - Load balancer health checks
 * - Monitoring system integration
 * - Development environment verification
 * - Deployment validation
 */

import { Elysia } from 'elysia';

export const healthRoutes = new Elysia()
  // Root endpoint - Basic API information
  .get(
    '/',
    () => ({
      message: 'Budget Buddy Backend API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    }),
    {
      detail: {
        tags: ['Health'],
        summary: 'Health Check',
        description: 'Returns API status information',
      },
    }
  )

  // Detailed health endpoint - Server status and metrics
  .get(
    '/health',
    () => ({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    }),
    {
      detail: {
        tags: ['Health'],
        summary: 'Health Status',
        description: 'Returns detailed health status information',
      },
    }
  );
