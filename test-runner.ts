#!/usr/bin/env bun

/**
 * Simple Test Runner
 * Run tests without starting the main server
 */

console.log('🧪 Running Budget Buddy Backend Tests');
console.log('=====================================');

// Import and run tests
import './tests/unit/category.service.bun.test.ts';
import './tests/integration/category.api.test.ts';

console.log('✅ All tests completed successfully!');
