/**
 * Winston Logger Configuration
 *
 * Centralized logging configuration for Budget Buddy Backend.
 * Provides different log levels and formats for development and production.
 *
 * Log Levels:
 * - error: Error conditions
 * - warn: Warning conditions
 * - info: Informational messages
 * - debug: Debug-level messages
 *
 * Features:
 * - Console logging with colors in development
 * - File logging for production
 * - Timestamp and structured formatting
 * - Different log levels for different environments
 */

import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'budget-buddy-backend' },
  transports: [
    // Console transport with colors for development
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    }),
  ],
});

// Add file transport for production
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    })
  );

  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
    })
  );
}

export default logger;
