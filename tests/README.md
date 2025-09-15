# Testing Guide

## Overview
Budget Buddy Backend uses Bun's built-in test framework for testing. All tests are designed to run without real database connections, using mocks and stubs instead.

## Test Structure

```
tests/
├── unit/                          # Unit tests for individual components
│   └── category.service.bun.test.ts   # CategoryService business logic tests
├── integration/                   # Integration tests for API endpoints  
│   └── category.api.test.ts           # Category API endpoint tests
├── mocks/                        # Mock implementations
│   ├── supabase.mock.ts              # Original Supabase mock
│   └── supabase-simple.mock.ts       # Simplified Supabase mock
└── utils/                        # Test utilities
    └── test-utils.ts                 # Helper functions and assertions
```

## Test Types

### Unit Tests
- Test individual service methods in isolation
- Use mocked dependencies (no database calls)
- Focus on business logic validation
- Located in `tests/unit/`

### Integration Tests
- Test API endpoints end-to-end
- Mock authentication and database responses
- Validate HTTP status codes and response formats
- Located in `tests/integration/`

## Running Tests

### All Tests
```bash
bun test
```

### Unit Tests Only
```bash
bun test tests/unit/
```

### Integration Tests Only
```bash
bun test tests/integration/
```

### Watch Mode
```bash
bun test --watch
```

### With Coverage
```bash
bun test --coverage
```

## Test Features

### CategoryService Tests
- ✅ getAllCategories() - Retrieve all categories
- ✅ getCategoryById() - Get specific category
- ✅ createCategory() - Create new category
- ✅ updateCategory() - Update existing category  
- ✅ deleteCategory() - Delete category with dependency checks
- ✅ Error handling for not found scenarios
- ✅ Business logic validation

### Category API Tests
- ✅ GET /api/categories - List all categories
- ✅ GET /api/categories/:id - Get specific category
- ✅ POST /api/categories - Create new category
- ✅ PUT /api/categories/:id - Update category
- ✅ DELETE /api/categories/:id - Delete category
- ✅ Authentication validation (401 responses)
- ✅ Error handling (404, 409 responses)
- ✅ Response format consistency

## Mock Strategy

### No Database Operations
- All tests use mocked Supabase client
- No real INSERT/UPDATE/DELETE operations
- Controlled responses for different scenarios
- Fast execution without network calls

### Authentication Mocking
- Mock JWT tokens for protected routes
- Test both authenticated and unauthenticated scenarios
- Validate proper authorization handling

### Response Mocking
- Consistent API response formats
- Mock error scenarios (not found, validation errors)
- Test dependency constraint violations

## Test Data

### Mock Categories
```typescript
const mockCategories = [
  { category_id: 1, category_name: 'Food', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { category_id: 2, category_name: 'Transport', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
];
```

### Test Scenarios
- Success cases with valid data
- Error cases (not found, validation failures)
- Edge cases (empty data, dependencies)
- Authentication/authorization scenarios

## Best Practices

1. **Isolation**: Each test is independent and doesn't affect others
2. **Mocking**: No real database or external service calls
3. **Coverage**: Test both success and error scenarios
4. **Consistency**: Follow established patterns for new tests
5. **Documentation**: Clear test descriptions and expected outcomes

## Adding New Tests

### For Services
1. Create test file in `tests/unit/`
2. Import from `bun:test` 
3. Create mock implementation
4. Test all public methods
5. Include error scenarios

### For API Endpoints
1. Create test file in `tests/integration/`
2. Mock HTTP requests/responses
3. Test all HTTP methods
4. Validate authentication
5. Check response formats

## Example Test Structure

```typescript
import { describe, it, expect, beforeEach } from "bun:test";

describe("Component Name", () => {
  let component: MockComponent;

  beforeEach(() => {
    component = new MockComponent();
  });

  describe("method name", () => {
    it("should handle success case", async () => {
      const result = await component.method();
      expect(result).toBeDefined();
    });

    it("should handle error case", async () => {
      expect(async () => {
        await component.methodWithError();
      }).toThrow("Expected error message");
    });
  });
});
```

## Notes

- Tests run in isolation without affecting the database
- Mock implementations provide controlled, predictable responses  
- All HTTP status codes and error messages are validated
- Authentication is mocked to test protected route behavior
- Business logic validation ensures data integrity rules are enforced