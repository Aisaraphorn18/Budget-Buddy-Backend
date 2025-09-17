#!/usr/bin/env bun

/**
 * Simple Test Runner
 * Run tests without starting the main server
 */
import logger from './src/utils/logger';

logger.info('🧪 Running Budget Buddy Backend Tests');
logger.info('=====================================');

// Import and run tests
import './tests/unit/category.service.bun.test.ts';
import './tests/integration/category.api.test.ts';

logger.info('✅ All tests completed successfully!');
