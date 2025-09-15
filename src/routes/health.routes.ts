import { Elysia } from "elysia";

export const healthRoutes = new Elysia()
  .get("/", () => ({
    message: "Budget Buddy Backend API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  }), {
    detail: {
      tags: ['Health'],
      summary: 'Health Check',
      description: 'Returns API status information'
    }
  })
  .get("/health", () => ({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  }), {
    detail: {
      tags: ['Health'],
      summary: 'Health Status',
      description: 'Returns detailed health status information'
    }
  });