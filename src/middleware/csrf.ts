/**
 * CSRF Protection Middleware
 *
 * Implements Double Submit Cookie pattern for CSRF protection.
 * Frontend must:
 * 1. Call /api/v1/csrf-token to get token
 * 2. Include token in X-CSRF-Token header for state-changing requests
 */

import { Elysia } from 'elysia';
import crypto from 'crypto';
import logger from '../utils/logger';

// Use Bun's global timer
declare const setInterval: (
  // eslint-disable-next-line no-unused-vars
  callback: () => void,
  // eslint-disable-next-line no-unused-vars
  ms: number
) => unknown;

// Generate a random CSRF token
export const generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Store for CSRF tokens (in production, use Redis or database)
export const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

// Cleanup expired tokens every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of csrfTokens.entries()) {
      if (value.expiresAt < now) {
        csrfTokens.delete(key);
      }
    }
  },
  5 * 60 * 1000
);

export const csrfPlugin = new Elysia({ name: 'csrf' })
  // Endpoint to generate CSRF token
  .get('/api/v1/csrf-token', ({ cookie }) => {
    const token = generateCsrfToken();
    const sessionId = cookie.session_id?.value || generateCsrfToken();

    // Store token with 1 hour expiration
    csrfTokens.set(sessionId as string, {
      token,
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    // Set session cookie
    // if (cookie.session_id) {
    //   cookie.session_id.value = sessionId;
    //   cookie.session_id.httpOnly = true;
    //   cookie.session_id.secure = process.env.NODE_ENV === 'production';
    //   cookie.session_id.sameSite = process.env.NODE_ENV === 'production' ? 'none' : 'lax'; // 'none' for cross-site with HTTPS
    //   cookie.session_id.maxAge = 60 * 60; // 1 hour
    // }

    const isLocal =
      process.env.NODE_ENV?.toLowerCase() === 'development' ||
      process.env.NODE_ENV?.toLowerCase() === 'local';

    // Set session cookie using Elysia cookie API
    cookie.session_id.set({
      value: sessionId,
      httpOnly: true,
      secure: !isLocal, // Secure in production/deployment
      sameSite: !isLocal ? 'none' : 'lax', // 'none' for cross-site in production
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return {
      success: true,
      csrfToken: token,
      message: 'CSRF token generated. Include this in X-CSRF-Token header for protected requests.',
    };
  })

  // Middleware to verify CSRF token for state-changing methods
  .onBeforeHandle(({ request, cookie, headers }) => {
    const method = request.method;
    const url = new globalThis.URL(request.url);
    const pathname = url.pathname;

    // Debug log
    logger.info('🛡️ CSRF Middleware:', {
      method,
      pathname,
      nodeEnv: process.env.NODE_ENV,
      hasCSRFHeader: !!headers['x-csrf-token'],
      hasSessionCookie: !!cookie.session_id?.value,
    });

    // Skip CSRF check for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      logger.info('✅ CSRF Skip: Safe method');
      return; // Return void to continue
    }

    // Skip CSRF check for health endpoint
    if (pathname === '/health') {
      logger.info('✅ CSRF Skip: Health endpoint');
      return;
    }

    // Skip CSRF check for CSRF token endpoint itself
    if (pathname === '/api/v1/csrf-token') {
      logger.info('✅ CSRF Skip: CSRF token endpoint');
      return;
    }

    // Skip CSRF only in development/local environment
    // Railway and Vercel deployments MUST use CSRF protection
    const nodeEnv = process.env.NODE_ENV?.toLowerCase();
    const isLocal = nodeEnv === 'development' || nodeEnv === 'local';

    logger.info('🔍 CSRF Check:', { nodeEnv, isLocal });

    if (isLocal) {
      logger.info('✅ CSRF Skip: Local development');
      return; // Only skip CSRF in local development
    }

    // For Railway and Vercel (production/uat/undefined), require CSRF
    logger.info('🔒 CSRF Required for production/deployment');

    const csrfToken = headers['x-csrf-token'];
    const sessionId = cookie.session_id?.value as string | undefined;

    if (!csrfToken || !sessionId) {
      throw new Error('CSRF token required');
    }

    const storedToken = csrfTokens.get(sessionId);

    if (!storedToken) {
      throw new Error('Invalid or expired CSRF token');
    }

    if (storedToken.expiresAt < Date.now()) {
      csrfTokens.delete(sessionId);
      throw new Error('CSRF token expired');
    }

    if (storedToken.token !== csrfToken) {
      throw new Error('Invalid CSRF token');
    }

    // Token is valid, continue
    return;
  })

  .onError(({ error, set }) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('CSRF')) {
      set.status = 403;
      return {
        success: false,
        message: errorMessage,
        code: 'CSRF_ERROR',
      };
    }
  });
