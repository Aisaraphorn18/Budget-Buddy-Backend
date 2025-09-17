/**
 * Supabase Database Configuration
 *
 * Configuration file for Supabase client initialization in Budget Buddy.
 * Supabase provides the PostgreSQL database backend with real-time capabilities,
 * authentication, and API generation for the Budget Buddy application.
 *
 * Key Features:
 * - Environment variable validation with error handling
 * - Secure credential management
 * - Single client instance for optimal performance
 * - Type-safe client configuration
 * - Connection error prevention
 *
 * Environment Variables Required:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_ANON_KEY: Your Supabase anonymous/public API key
 *
 * Database Tables:
 * - User: User accounts and authentication
 * - Category: Transaction categories
 * - Transaction: Financial transactions
 * - Budget: Budget planning and tracking
 *
 * Security:
 * - Row Level Security (RLS) policies should be configured in Supabase
 * - API keys should be kept secure and not committed to version control
 * - Use service role key for admin operations (if needed)
 */

import { createClient } from '@supabase/supabase-js';

// Validate and retrieve Supabase configuration from environment variables
const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  (() => {
    throw new Error('SUPABASE_URL is not defined in environment variables');
  })();

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ??
  (() => {
    throw new Error('SUPABASE_ANON_KEY is not defined in environment variables');
  })();

/**
 * Supabase client instance
 *
 * Configured with URL and anonymous key for database operations.
 * This client is used throughout the application for all database
 * interactions including CRUD operations and real-time subscriptions.
 *
 * Usage:
 * - Import and use this client in service files
 * - Perform database queries with TypeScript support
 * - Handle authentication and user management
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
