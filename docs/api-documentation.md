# 🌐 API Documentation

## Public Endpoints (No Authentication Required)

### 🔓 Health Check

- **GET** `/health` - API health status

### 🔓 Authentication

- **POST** `/api/v1/auth/register` - Register new user
- **POST** `/api/v1/auth/login` - User login

## Protected Endpoints (JWT Authentication Required)

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 🔒 User Management

- **GET** `/api/v1/auth/profile` - Get user profile
- **PUT** `/api/v1/auth/profile` - Update user profile
- **DELETE** `/api/v1/auth/logout` - User logout
- **GET** `/api/v1/auth/users/:id` - Get user by ID (admin only)

### 🔒 Categories

- **GET** `/api/v1/categories` - Get all categories
- **GET** `/api/v1/categories/:id` - Get category by ID
- **POST** `/api/v1/categories` - Create new category
- **PUT** `/api/v1/categories/:id` - Update category
- **DELETE** `/api/v1/categories/:id` - Delete category

### 🔒 Transactions

- **GET** `/api/v1/transactions` - Get paginated transactions
- **GET** `/api/v1/transactions/:id` - Get transaction by ID
- **POST** `/api/v1/transactions` - Create new transaction
- **PUT** `/api/v1/transactions/:id` - Update transaction
- **DELETE** `/api/v1/transactions/:id` - Delete transaction
- **GET** `/api/v1/transactions/recent` - Get recent transactions
- **GET** `/api/v1/transactions/summary` - Get transactions summary

### 🔒 Budgets

- **GET** `/api/v1/budgets` - Get all budgets
- **GET** `/api/v1/budgets/:id` - Get budget by ID
- **POST** `/api/v1/budgets` - Create new budget
- **PUT** `/api/v1/budgets/:id` - Update budget
- **DELETE** `/api/v1/budgets/:id` - Delete budget
- **GET** `/api/v1/budgets/spending/:cycleMonth` - Get spending analysis
- **GET** `/api/v1/budgets/overview` - Get budget overview

### 🔒 Reports & Analytics

- **GET** `/api/v1/reports/summary` - Financial summary
- **GET** `/api/v1/reports/recent-transactions` - Recent transactions report
- **GET** `/api/v1/reports/income-vs-expense` - Income vs expense analysis
- **GET** `/api/v1/reports/expenses-by-category` - Expenses by category
- **GET** `/api/v1/reports/monthly-close` - Monthly close report

### 🔒 User Management (Admin Only)

- **GET** `/api/v1/users` - Get all users with pagination
- **GET** `/api/v1/users/:id` - Get user by ID with statistics
- **DELETE** `/api/v1/users/:id` - Delete user

## Query Parameters

### Pagination

```
?page=1&limit=20
```

### Filtering

```
?type=expense&category_id=uuid&start_date=2024-01-01&end_date=2024-12-31
```

### Example Usage

```bash
GET /protected/api/v1/transactions?page=1&limit=20&type=expense&category_id=uuid&start_date=2024-01-01&end_date=2024-12-31
```

## Authentication

### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

## Example API Calls

### Create a Transaction

```bash
curl -X POST http://localhost:3000/protected/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_id": "category-uuid-here",
    "amount": 50.00,
    "type": "expense",
    "description": "Lunch at restaurant",
    "date": "2024-01-15"
  }'
```

### Create a Budget

```bash
curl -X POST http://localhost:3000/protected/api/v1/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_id": "category-uuid-here",
    "amount": 1000.00,
    "period": "monthly",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }'
```

### Get Financial Summary

```bash
curl -X GET http://localhost:3000/protected/api/v1/reports/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Response Formats

### Success Response

```json
{
  "success": true,
  "data": {
    // Resource data
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "error": "Error message description",
  "details": {
    // Additional error details
  }
}
```

## Status Codes

- `200` - OK (Successful GET, PUT)
- `201` - Created (Successful POST)
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Duplicate resources)
- `500` - Internal Server Error

For more detailed API testing information, see [Testing Documentation](../tests/README.md).
