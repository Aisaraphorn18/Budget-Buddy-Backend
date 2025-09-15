# Budget Buddy API Documentation 📖

> 📋 Complete API Reference for Budget Buddy Backend - ElysiaJS TypeScript API

[![API Version](https://img.shields.io/badge/API%20Version-v1-blue.svg)]()
[![ElysiaJS](https://img.shields.io/badge/Framework-ElysiaJS-ff6b9d.svg)](https://elysiajs.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)

## 🌏 Language Versions

- **🇺🇸 English** - Current
- **[🇹🇭 ไทย (Thai Version)](API_DOCUMENTATION_TH.md)** - เอกสาร API ภาษาไทย

---

## 📚 Table of Contents

- [🌐 Base URL](#-base-url)
- [🔐 Authentication](#-authentication)
- [📊 Response Format](#-response-format)
- [❌ Error Codes](#-error-codes)
- [🏥 Health Check API](#-health-check-api)
- [👤 Authentication APIs](#-authentication-apis)
- [🏷️ Category APIs](#️-category-apis)
- [💸 Transaction APIs](#-transaction-apis)
- [📊 Budget APIs](#-budget-apis)
- [🏠 Home & Analytics APIs](#-home--analytics-apis)

---

## 🌐 Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## 🔐 Authentication

Some API endpoints require JWT token in header:

```http
Authorization: Bearer <your-jwt-token>
```

**Token obtained from:** `/api/v1/auth/login` endpoint

---

## 📊 Response Format

### ✅ Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### ❌ Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

---

## ❌ Error Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Missing/Invalid token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Resource already exists |
| `500` | Internal Server Error |

---

## 🏥 Health Check API

### GET `/health`

Check API server status

#### 📥 Request
```http
GET /health
Content-Type: application/json
```

#### 🔑 Headers Required
- None

#### 📤 Response
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2024-01-15T10:30:00Z",
    "uptime": "2h 30m 15s"
  },
  "message": "Server is healthy"
}
```

---

## 👤 Authentication APIs

### POST `/api/v1/auth/register`

Register new user

#### 📥 Request
```http
POST /api/v1/auth/register
Content-Type: application/json
```

#### 🔑 Headers Required
- `Content-Type: application/json`

#### 📋 Request Body
```json
{
  "username": "johndoe",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### 📝 Request Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | ✅ | Username (must be unique) |
| `password` | string | ✅ | Password (minimum 6 characters) |
| `first_name` | string | ❌ | First name |
| `last_name` | string | ❌ | Last name |

#### 📤 Response (201 Created)
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

#### ❌ Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Username already exists",
  "details": {
    "field": "username",
    "code": "DUPLICATE_USERNAME"
  }
}
```

---

### POST `/api/v1/auth/login`

User login

#### 📥 Request
```http
POST /api/v1/auth/login
Content-Type: application/json
```

#### 🔑 Headers Required
- `Content-Type: application/json`

#### 📋 Request Body
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### 📝 Request Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | ✅ | Username |
| `password` | string | ✅ | Password |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": "24h"
  },
  "message": "Login successful"
}
```

#### ❌ Error Response (401 Unauthorized)
```json
{
  "success": false,
  "error": "Invalid username or password",
  "details": {
    "code": "INVALID_CREDENTIALS"
  }
}
```

---

### POST `/api/v1/auth/logout`

User logout

#### 📥 Request
```http
POST /api/v1/auth/logout
Content-Type: application/json
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

#### 📋 Request Body
```json
{}
```

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {},
  "message": "Logout successful"
}
```

---

### GET `/api/v1/auth/profile`

Get user profile

#### 📥 Request
```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Profile retrieved successfully"
}
```

---

## 🏷️ Category APIs

### GET `/api/v1/categories`

Get all categories

#### 📥 Request
```http
GET /api/v1/categories
```

#### 🔑 Headers Required
- None

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category_id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Food & Dining",
        "type": "expense",
        "color": "#FF6B6B",
        "icon": "🍔",
        "created_at": "2024-01-15T10:30:00Z"
      },
      {
        "category_id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Salary",
        "type": "income",
        "color": "#54A0FF",
        "icon": "💼",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "message": "Categories retrieved successfully"
}
```

---

### GET `/api/v1/categories/:id`

Get category by ID

#### 📥 Request
```http
GET /api/v1/categories/550e8400-e29b-41d4-a716-446655440001
```

#### 🔑 Headers Required
- None

#### 📝 URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | ✅ | Category ID |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "category": {
      "category_id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Food & Dining",
      "type": "expense",
      "color": "#FF6B6B",
      "icon": "🍔",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Category retrieved successfully"
}
```

#### ❌ Error Response (404 Not Found)
```json
{
  "success": false,
  "error": "Category not found",
  "details": {
    "category_id": "550e8400-e29b-41d4-a716-446655440001",
    "code": "CATEGORY_NOT_FOUND"
  }
}
```

---

## 💸 Transaction APIs

### POST `/protected/api/v1/transactions`

Create new transaction

#### 📥 Request
```http
POST /protected/api/v1/transactions
Content-Type: application/json
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

#### 📋 Request Body
```json
{
  "category_id": "550e8400-e29b-41d4-a716-446655440001",
  "amount": 250.50,
  "type": "expense",
  "description": "Lunch at restaurant",
  "date": "2024-01-15"
}
```

#### 📝 Request Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category_id` | UUID | ✅ | Category ID |
| `amount` | number | ✅ | Amount (positive) |
| `type` | string | ✅ | Type: "income" or "expense" |
| `description` | string | ❌ | Transaction description |
| `date` | string | ✅ | Date (YYYY-MM-DD) |

#### 📤 Response (201 Created)
```json
{
  "success": true,
  "data": {
    "transaction": {
      "transaction_id": "550e8400-e29b-41d4-a716-446655440003",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "category_id": "550e8400-e29b-41d4-a716-446655440001",
      "amount": 250.50,
      "type": "expense",
      "description": "Lunch at restaurant",
      "date": "2024-01-15",
      "created_at": "2024-01-15T10:30:00Z",
      "category": {
        "name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B"
      }
    }
  },
  "message": "Transaction created successfully"
}
```

---

### GET `/protected/api/v1/transactions`

Get all transactions (with filtering and pagination)

#### 📥 Request
```http
GET /protected/api/v1/transactions?page=1&limit=10&type=expense&category_id=550e8400-e29b-41d4-a716-446655440001&start_date=2024-01-01&end_date=2024-01-31&min_amount=100&max_amount=1000
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📝 Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | ❌ | Page number (default: 1) |
| `limit` | number | ❌ | Items per page (default: 10, max: 100) |
| `type` | string | ❌ | Filter by type: "income" or "expense" |
| `category_id` | UUID | ❌ | Filter by category ID |
| `start_date` | string | ❌ | Start date (YYYY-MM-DD) |
| `end_date` | string | ❌ | End date (YYYY-MM-DD) |
| `min_amount` | number | ❌ | Minimum amount |
| `max_amount` | number | ❌ | Maximum amount |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "transaction_id": "550e8400-e29b-41d4-a716-446655440003",
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "category_id": "550e8400-e29b-41d4-a716-446655440001",
        "amount": 250.50,
        "type": "expense",
        "description": "Lunch at restaurant",
        "date": "2024-01-15",
        "created_at": "2024-01-15T10:30:00Z",
        "category": {
          "name": "Food & Dining",
          "icon": "🍔",
          "color": "#FF6B6B"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 47,
      "limit": 10,
      "has_next": true,
      "has_prev": false
    }
  },
  "message": "Transactions retrieved successfully"
}
```

---

### GET `/protected/api/v1/transactions/:id`

Get transaction by ID

#### 📥 Request
```http
GET /protected/api/v1/transactions/550e8400-e29b-41d4-a716-446655440003
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📝 URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | ✅ | Transaction ID |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "transaction": {
      "transaction_id": "550e8400-e29b-41d4-a716-446655440003",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "category_id": "550e8400-e29b-41d4-a716-446655440001",
      "amount": 250.50,
      "type": "expense",
      "description": "Lunch at restaurant",
      "date": "2024-01-15",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "category": {
        "name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B"
      }
    }
  },
  "message": "Transaction retrieved successfully"
}
```

---

### PATCH `/protected/api/v1/transactions/:id`

Update transaction

#### 📥 Request
```http
PATCH /protected/api/v1/transactions/550e8400-e29b-41d4-a716-446655440003
Content-Type: application/json
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

#### 📝 URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | ✅ | Transaction ID |

#### 📋 Request Body
```json
{
  "amount": 300.00,
  "description": "Dinner at fancy restaurant",
  "date": "2024-01-16"
}
```

#### 📝 Request Body Parameters (all optional)
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category_id` | UUID | ❌ | Category ID |
| `amount` | number | ❌ | Amount |
| `type` | string | ❌ | Type: "income" or "expense" |
| `description` | string | ❌ | Transaction description |
| `date` | string | ❌ | Date (YYYY-MM-DD) |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "transaction": {
      "transaction_id": "550e8400-e29b-41d4-a716-446655440003",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "category_id": "550e8400-e29b-41d4-a716-446655440001",
      "amount": 300.00,
      "type": "expense",
      "description": "Dinner at fancy restaurant",
      "date": "2024-01-16",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-16T14:20:00Z",
      "category": {
        "name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B"
      }
    }
  },
  "message": "Transaction updated successfully"
}
```

---

### DELETE `/protected/api/v1/transactions/:id`

Delete transaction

#### 📥 Request
```http
DELETE /protected/api/v1/transactions/550e8400-e29b-41d4-a716-446655440003
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📝 URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | ✅ | Transaction ID |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "deleted_transaction_id": "550e8400-e29b-41d4-a716-446655440003"
  },
  "message": "Transaction deleted successfully"
}
```

---

## 📊 Budget APIs

### POST `/protected/api/v1/budgets`

Create new budget

#### 📥 Request
```http
POST /protected/api/v1/budgets
Content-Type: application/json
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

#### 📋 Request Body
```json
{
  "category_id": "550e8400-e29b-41d4-a716-446655440001",
  "amount": 1500.00,
  "period": "monthly",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

#### 📝 Request Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category_id` | UUID | ✅ | Category ID |
| `amount` | number | ✅ | Budget amount |
| `period` | string | ✅ | Budget period: "weekly", "monthly", "yearly" |
| `start_date` | string | ✅ | Start date (YYYY-MM-DD) |
| `end_date` | string | ✅ | End date (YYYY-MM-DD) |

#### 📤 Response (201 Created)
```json
{
  "success": true,
  "data": {
    "budget": {
      "budget_id": "550e8400-e29b-41d4-a716-446655440004",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "category_id": "550e8400-e29b-41d4-a716-446655440001",
      "amount": 1500.00,
      "period": "monthly",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "created_at": "2024-01-15T10:30:00Z",
      "category": {
        "name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B"
      },
      "usage": {
        "spent": 650.50,
        "remaining": 849.50,
        "percentage": 43.37
      }
    }
  },
  "message": "Budget created successfully"
}
```

---

### GET `/protected/api/v1/budgets`

Get all budgets

#### 📥 Request
```http
GET /protected/api/v1/budgets?page=1&limit=10&period=monthly&category_id=550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📝 Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | ❌ | Page number (default: 1) |
| `limit` | number | ❌ | Items per page (default: 10, max: 100) |
| `period` | string | ❌ | Filter by period: "weekly", "monthly", "yearly" |
| `category_id` | UUID | ❌ | Filter by category ID |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "budgets": [
      {
        "budget_id": "550e8400-e29b-41d4-a716-446655440004",
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "category_id": "550e8400-e29b-41d4-a716-446655440001",
        "amount": 1500.00,
        "period": "monthly",
        "start_date": "2024-01-01",
        "end_date": "2024-01-31",
        "created_at": "2024-01-15T10:30:00Z",
        "category": {
          "name": "Food & Dining",
          "icon": "🍔",
          "color": "#FF6B6B"
        },
        "usage": {
          "spent": 650.50,
          "remaining": 849.50,
          "percentage": 43.37
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_items": 12,
      "limit": 10,
      "has_next": true,
      "has_prev": false
    }
  },
  "message": "Budgets retrieved successfully"
}
```

---

### GET `/protected/api/v1/budgets/:id`

Get budget by ID

#### 📥 Request
```http
GET /protected/api/v1/budgets/550e8400-e29b-41d4-a716-446655440004
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📝 URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | ✅ | Budget ID |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "budget": {
      "budget_id": "550e8400-e29b-41d4-a716-446655440004",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "category_id": "550e8400-e29b-41d4-a716-446655440001",
      "amount": 1500.00,
      "period": "monthly",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "category": {
        "name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B"
      },
      "usage": {
        "spent": 650.50,
        "remaining": 849.50,
        "percentage": 43.37,
        "daily_average": 21.68,
        "projected_total": 671.08
      },
      "transactions": [
        {
          "transaction_id": "550e8400-e29b-41d4-a716-446655440003",
          "amount": 250.50,
          "description": "Lunch at restaurant",
          "date": "2024-01-15"
        }
      ]
    }
  },
  "message": "Budget retrieved successfully"
}
```

---

### PATCH `/protected/api/v1/budgets/:id`

Update budget

#### 📥 Request
```http
PATCH /protected/api/v1/budgets/550e8400-e29b-41d4-a716-446655440004
Content-Type: application/json
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

#### 📝 URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | ✅ | Budget ID |

#### 📋 Request Body
```json
{
  "amount": 2000.00,
  "end_date": "2024-02-29"
}
```

#### 📝 Request Body Parameters (all optional)
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category_id` | UUID | ❌ | Category ID |
| `amount` | number | ❌ | Budget amount |
| `period` | string | ❌ | Budget period: "weekly", "monthly", "yearly" |
| `start_date` | string | ❌ | Start date (YYYY-MM-DD) |
| `end_date` | string | ❌ | End date (YYYY-MM-DD) |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "budget": {
      "budget_id": "550e8400-e29b-41d4-a716-446655440004",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "category_id": "550e8400-e29b-41d4-a716-446655440001",
      "amount": 2000.00,
      "period": "monthly",
      "start_date": "2024-01-01",
      "end_date": "2024-02-29",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-16T14:20:00Z",
      "category": {
        "name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B"
      },
      "usage": {
        "spent": 650.50,
        "remaining": 1349.50,
        "percentage": 32.53
      }
    }
  },
  "message": "Budget updated successfully"
}
```

---

### DELETE `/protected/api/v1/budgets/:id`

Delete budget

#### 📥 Request
```http
DELETE /protected/api/v1/budgets/550e8400-e29b-41d4-a716-446655440004
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📝 URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | ✅ | Budget ID |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "deleted_budget_id": "550e8400-e29b-41d4-a716-446655440004"
  },
  "message": "Budget deleted successfully"
}
```

---

## 🏠 Home & Analytics APIs

### GET `/protected/api/v1/home`

Get dashboard/home data

#### 📥 Request
```http
GET /protected/api/v1/home
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_income": 5000.00,
      "total_expense": 3250.75,
      "net_amount": 1749.25,
      "budget_usage": 65.02
    },
    "recent_transactions": [
      {
        "transaction_id": "550e8400-e29b-41d4-a716-446655440003",
        "amount": 250.50,
        "type": "expense",
        "description": "Lunch at restaurant",
        "date": "2024-01-15",
        "category": {
          "name": "Food & Dining",
          "icon": "🍔",
          "color": "#FF6B6B"
        }
      }
    ],
    "budget_alerts": [
      {
        "budget_id": "550e8400-e29b-41d4-a716-446655440004",
        "category_name": "Food & Dining",
        "used_percentage": 85.5,
        "remaining_amount": 217.50,
        "status": "warning"
      }
    ],
    "monthly_summary": {
      "current_month": "2024-01",
      "income": 5000.00,
      "expense": 3250.75,
      "savings": 1749.25,
      "savings_rate": 34.99
    }
  },
  "message": "Dashboard data retrieved successfully"
}
```

---

### GET `/protected/api/v1/recent-transactions`

Get recent transactions

#### 📥 Request
```http
GET /protected/api/v1/recent-transactions?limit=5
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📝 Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | ❌ | Number of items (default: 10, max: 50) |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "transaction_id": "550e8400-e29b-41d4-a716-446655440003",
        "amount": 250.50,
        "type": "expense",
        "description": "Lunch at restaurant",
        "date": "2024-01-15",
        "created_at": "2024-01-15T10:30:00Z",
        "category": {
          "name": "Food & Dining",
          "icon": "🍔",
          "color": "#FF6B6B"
        }
      }
    ]
  },
  "message": "Recent transactions retrieved successfully"
}
```

---

### GET `/protected/api/v1/analytics/summary`

Get financial summary

#### 📥 Request
```http
GET /protected/api/v1/analytics/summary?period=monthly&year=2024&month=1
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📝 Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period` | string | ❌ | Time period: "monthly", "yearly" (default: "monthly") |
| `year` | number | ❌ | Year (default: current year) |
| `month` | number | ❌ | Month 1-12 (used when period="monthly") |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "period": "2024-01",
    "summary": {
      "total_income": 5000.00,
      "total_expense": 3250.75,
      "net_amount": 1749.25,
      "savings_rate": 34.99,
      "transaction_count": 47
    },
    "comparison": {
      "previous_period": "2023-12",
      "income_change": 5.2,
      "expense_change": -12.5,
      "savings_change": 25.8
    },
    "top_categories": {
      "income": [
        {
          "category_name": "Salary",
          "amount": 4500.00,
          "percentage": 90.0
        }
      ],
      "expense": [
        {
          "category_name": "Food & Dining",
          "amount": 1250.50,
          "percentage": 38.5
        }
      ]
    }
  },
  "message": "Financial summary retrieved successfully"
}
```

---

### GET `/protected/api/v1/analytics/by-category`

Get analytics by category

#### 📥 Request
```http
GET /protected/api/v1/analytics/by-category?type=expense&period=monthly&year=2024&month=1
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📝 Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | ❌ | Type: "income", "expense" (default: "expense") |
| `period` | string | ❌ | Time period: "monthly", "yearly" (default: "monthly") |
| `year` | number | ❌ | Year (default: current year) |
| `month` | number | ❌ | Month 1-12 (used when period="monthly") |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "period": "2024-01",
    "type": "expense",
    "total_amount": 3250.75,
    "categories": [
      {
        "category_id": "550e8400-e29b-41d4-a716-446655440001",
        "category_name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B",
        "amount": 1250.50,
        "percentage": 38.5,
        "transaction_count": 15,
        "average_per_transaction": 83.37
      },
      {
        "category_id": "550e8400-e29b-41d4-a716-446655440002",
        "category_name": "Transportation",
        "icon": "🚗",
        "color": "#4ECDC4",
        "amount": 850.25,
        "percentage": 26.2,
        "transaction_count": 8,
        "average_per_transaction": 106.28
      }
    ]
  },
  "message": "Category analytics retrieved successfully"
}
```

---

### GET `/protected/api/v1/analytics/flow`

Get cash flow analytics

#### 📥 Request
```http
GET /protected/api/v1/analytics/flow?period=monthly&year=2024&months=6
Authorization: Bearer <token>
```

#### 🔑 Headers Required
- `Authorization: Bearer <token>`

#### 📝 Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period` | string | ❌ | Time period: "monthly", "daily" (default: "monthly") |
| `year` | number | ❌ | Year (default: current year) |
| `months` | number | ❌ | Number of months back (default: 6, max: 12) |
| `days` | number | ❌ | Number of days back (used when period="daily", max: 90) |

#### 📤 Response (200 OK)
```json
{
  "success": true,
  "data": {
    "period": "monthly",
    "range": "2023-08 to 2024-01",
    "flow_data": [
      {
        "period": "2023-08",
        "income": 4800.00,
        "expense": 3500.25,
        "net": 1299.75,
        "cumulative": 1299.75
      },
      {
        "period": "2023-09",
        "income": 4800.00,
        "expense": 3250.80,
        "net": 1549.20,
        "cumulative": 2848.95
      },
      {
        "period": "2024-01",
        "income": 5000.00,
        "expense": 3250.75,
        "net": 1749.25,
        "cumulative": 8749.25
      }
    ],
    "trends": {
      "income_trend": "increasing",
      "expense_trend": "decreasing",
      "savings_trend": "increasing",
      "average_monthly_savings": 1458.21
    }
  },
  "message": "Cash flow analytics retrieved successfully"
}
```

---

## 🔧 Development Notes

### 🚀 Quick Start for Testing

1. **Start server:**
   ```bash
   bun run dev
   ```

2. **Test Health Check:**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Register:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123","first_name":"Test","last_name":"User"}'
   ```

4. **Login and get Token:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123"}'
   ```

5. **Use Token for Protected APIs:**
   ```bash
   curl -X GET http://localhost:3000/protected/api/v1/transactions \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

### 📝 Notes
- All timestamps use ISO 8601 format (UTC)
- UUIDs use v4 format
- Amounts use 2 decimal places
- Dates use YYYY-MM-DD format
- Pagination starts from page 1
- Tokens expire in 24 hours

---

<div align="center">

### 📚 API Documentation Complete! 

Created by Budget Buddy Team with ❤️

**[🔙 Back to README](README.md)** • **[🇹🇭 Thai Version](API_DOCUMENTATION_TH.md)** • **[🌐 Test API](http://localhost:3000/openapi)**

</div>