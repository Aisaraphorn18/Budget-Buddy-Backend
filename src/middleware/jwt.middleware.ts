import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";

export const jwtMiddleware = new Elysia()
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'budget-buddy-secret-key-2024'
  }))
  .use(bearer())
  .derive(async ({ bearer, jwt }) => {
    if (!bearer) {
      throw new Error('Authorization token required');
    }

    const payload = await jwt.verify(bearer);
    if (!payload) {
      throw new Error('Invalid token');
    }

    return {
      user: payload
    };
  })
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