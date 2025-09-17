/**
 * Routes Index
 *
 * Central export file for all route modules in Budget Buddy API.
 * This file aggregates and exports all route definitions for easy
 * import and organization in the main application file.
 *
 * Route Categories:
 * - healthRoutes: API health check and status endpoints
 * - authRoutes: User authentication and authorization endpoints
 * - categoryRoutes: Transaction category management endpoints (public)
 * - transactionRoutes: Financial transaction CRUD endpoints (protected)
 * - budgetRoutes: Budget management endpoints (protected)
 * - homeRoutes: Dashboard and analytics endpoints (protected)
 *
 * Usage:
 * This barrel export pattern allows clean imports in the main app:
 * import { authRoutes, transactionRoutes } from "./routes";
 *
 * Route Organization:
 * - Public routes: health, auth, categories (no JWT required)
 * - Protected routes: transactions, budgets, home (JWT required)
 */

import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';
import { categoryRoutes } from './category.routes';
import { transactionRoutes } from './transaction.routes';
import { budgetRoutes } from './budget.routes';
import { homeRoutes } from './home.routes';
import { userRoutes } from './user.routes';

export {
  healthRoutes,
  authRoutes,
  categoryRoutes,
  transactionRoutes,
  budgetRoutes,
  homeRoutes,
  userRoutes,
};
