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
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

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
    if (cookie.session_id) {
      cookie.session_id.value = sessionId;
      cookie.session_id.httpOnly = true;
      cookie.session_id.secure = process.env.NODE_ENV === 'production';
      cookie.session_id.sameSite = process.env.NODE_ENV === 'production' ? 'none' : 'lax'; // 'none' for cross-site with HTTPS
      cookie.session_id.maxAge = 60 * 60; // 1 hour
    }

    const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'uat';

    // Set session cookie using Elysia cookie API
    cookie.session_id.set({
      value: sessionId,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
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
  .derive(({ request, cookie, headers }) => {
    const method = request.method;

    // Skip CSRF check for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return {};
    }

    const url = new globalThis.URL(request.url);
    const pathname = url.pathname;

    // Skip CSRF check for health endpoint
    if (pathname === '/health') {
      return {};
    }

    // Skip CSRF only when NOT in production or UAT
    // Only local/dev environments skip CSRF, production/UAT must use CSRF
    const nodeEnv = process.env.NODE_ENV?.toLowerCase();
    const isProduction = nodeEnv === 'production' || nodeEnv === 'uat';

    if (!isProduction) {
      return {};
    }

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

    return {};
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
