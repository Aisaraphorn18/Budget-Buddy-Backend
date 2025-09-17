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

#### Dashboard Summary Cards

- **GET** `/api/v1/reports/dashboard` - Get dashboard summary cards for home page

**Query Parameters:**

- `month` (optional): Format YYYY-MM, e.g., "2024-03"
- `user_id` (optional): UUID for admin access to other user's data

**Responses:**

- **200** Success - Dashboard cards retrieved successfully
- **400** Bad Request - Invalid month format or parameters
- **401** Unauthorized - Invalid or missing JWT token
- **500** Internal Server Error

#### Enhanced Financial Summary

- **GET** `/api/v1/reports/summary` - Get financial summary with annual breakdown support

**Query Parameters:**

- `month` (optional): Format YYYY-MM for monthly summary
- `range` (optional): "year" for annual breakdown suitable for bar charts
- `year` (optional): Format YYYY for annual data, e.g., "2024"
- `user_id` (optional): UUID for admin access to other user's data

**Responses:**

- **200** Success - Financial summary retrieved successfully
- **400** Bad Request - Invalid date format or parameters
- **401** Unauthorized - Invalid or missing JWT token
- **500** Internal Server Error

#### Recent Transactions Report

- **GET** `/api/v1/reports/recent-transactions` - Get paginated recent transactions with formatting

**Query Parameters:**

- `limit` (optional): Number of transactions to return (default: 10, max: 100)
- `page` (optional): Page number for pagination (default: 1)
- `user_id` (optional): UUID for admin access to other user's data

**Responses:**

- **200** Success - Recent transactions retrieved successfully
- **400** Bad Request - Invalid pagination parameters
- **401** Unauthorized - Invalid or missing JWT token
- **500** Internal Server Error

#### Income vs Expense Analysis

- **GET** `/api/v1/reports/income-vs-expense` - Get income vs expense comparison

**Query Parameters:**

- `year` (optional): Format YYYY for yearly analysis
- `month` (optional): Format YYYY-MM for monthly analysis
- `user_id` (optional): UUID for admin access to other user's data

**Responses:**

- **200** Success - Income vs expense analysis retrieved successfully
- **400** Bad Request - Invalid date format
- **401** Unauthorized - Invalid or missing JWT token
- **500** Internal Server Error

#### Expenses by Category Analysis

- **GET** `/api/v1/reports/expenses-by-category` - Get expenses breakdown by category with colors

**Query Parameters:**

- `month` (optional): Format YYYY-MM for specific month analysis
- `user_id` (optional): UUID for admin access to other user's data

**Responses:**

- **200** Success - Expenses by category retrieved successfully
- **400** Bad Request - Invalid month format
- **401** Unauthorized - Invalid or missing JWT token
- **500** Internal Server Error

#### Monthly Close Report

- **GET** `/api/v1/reports/monthly-close` - Get monthly closing report

**Query Parameters:**

- `month` (required): Format YYYY-MM for the month to close
- `user_id` (optional): UUID for admin access to other user's data

**Responses:**

- **200** Success - Monthly close report retrieved successfully
- **400** Bad Request - Missing or invalid month parameter
- **401** Unauthorized - Invalid or missing JWT token
- **500** Internal Server Error

```
?month=2024-03&user_id=uuid
```

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
