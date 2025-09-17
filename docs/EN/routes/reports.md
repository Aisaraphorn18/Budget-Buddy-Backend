# 📈 Reports & Analytics API

## Overview

Comprehensive financial reporting and analytics endpoints for Budget Buddy users with enhanced dashboard support.

**Base Path**: `/protected/api/v1/reports`

**Authentication**: Required (JWT Bearer Token)

## Endpoints

### 1. Dashboard Summary (NEW!)

**GET** `/protected/api/v1/reports/dashboard`

**Description**: Get dashboard cards for home page including income, expenses, and balance cards

**Headers**:

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Query Parameters**:

| Parameter | Type   | Required | Description                                | Example       |
| --------- | ------ | -------- | ------------------------------------------ | ------------- |
| `month`   | string | No       | Format YYYY-MM for specific month          | "2024-03"     |
| `user_id` | string | No       | UUID for admin access to other user's data | "uuid-string" |

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Dashboard summary retrieved successfully",
  "data": {
    "cards": [
      {
        "type": "income",
        "title": "Income",
        "amount": 8900,
        "formatted_amount": "8,900 B",
        "color": "#10B981"
      },
      {
        "type": "expense",
        "title": "Expenses",
        "amount": 2000,
        "formatted_amount": "2,000 B",
        "color": "#EF4444"
      },
      {
        "type": "balance",
        "title": "Balance",
        "amount": 6900,
        "formatted_amount": "6,900 B",
        "color": "#3B82F6"
      }
    ],
    "summary": {
      "total_income": 8900,
      "total_expense": 2000,
      "net_balance": 6900,
      "as_of": "2024-03"
    }
  }
}
```

**Error Responses**:

**400 Bad Request**:

```json
{
  "success": false,
  "message": "Invalid month format. Expected YYYY-MM",
  "error": "INVALID_DATE_FORMAT"
}
```

**401 Unauthorized**:

```json
{
  "success": false,
  "message": "Authentication required",
  "error": "UNAUTHORIZED"
}
```

**500 Internal Server Error**:

```json
{
  "success": false,
  "message": "Internal server error occurred",
  "error": "INTERNAL_ERROR"
}
```

### 2. Enhanced Financial Summary

**GET** `/protected/api/v1/reports/summary`

**Description**: Get financial summary with support for both monthly and annual breakdowns

**Headers**:

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Query Parameters**:

| Parameter | Type   | Required | Description                        | Example       |
| --------- | ------ | -------- | ---------------------------------- | ------------- |
| `month`   | string | No       | Format YYYY-MM for monthly summary | "2024-03"     |
| `range`   | string | No       | "year" for annual breakdown        | "year"        |
| `year`    | string | No       | Format YYYY for annual data        | "2024"        |
| `user_id` | string | No       | UUID for admin access              | "uuid-string" |

- `month` (optional): Format YYYY-MM for monthly summary, e.g., "2024-03"
- `range` (optional): "year" for annual breakdown
- `year` (optional): Format YYYY for annual data, e.g., "2024"
- `user_id` (optional): For admin users to access other user's data

**Monthly Response**:

```json
{
  "success": true,
  "message": "Summary report retrieved successfully",
  "data": {
    "type": "monthly",
    "total_income": 50000,
    "total_expense": 35000,
    "balance": 15000,
    "as_of": "2024-03"
  }
}
```

**Annual Response**:

```json
{
  "success": true,
  "message": "Annual summary retrieved successfully",
  "data": {
    "type": "annual",
    "year": "2024",
    "monthly_breakdown": [
      {
        "month": "2024-01",
        "month_name": "January",
        "total_income": 25000,
        "total_expense": 18500,
        "net_balance": 6500
      }
      // ... 12 months
    ],
    "year_totals": {
      "total_income": 300000,
      "total_expense": 222000,
      "net_balance": 78000
    }
  }
}
```

### 3. Enhanced Recent Transactions

**GET** `/protected/api/v1/reports/recent-transactions`

**Description**: Get paginated list of recent transactions with enhanced formatting

**Query Parameters**:

- `limit` (optional): Number of transactions to return (default: 10)

### 3. Enhanced Recent Transactions

**GET** `/protected/api/v1/reports/recent-transactions`

**Description**: Get paginated list of recent transactions with enhanced formatting

**Headers**:

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Query Parameters**:

| Parameter | Type   | Required | Description                                    | Example       |
| --------- | ------ | -------- | ---------------------------------------------- | ------------- |
| `limit`   | number | No       | Number of transactions (default: 10, max: 100) | 10            |
| `page`    | number | No       | Page number for pagination (default: 1)        | 1             |
| `user_id` | string | No       | UUID for admin access to other user's data     | "uuid-string" |

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Recent transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "transaction_id": 1,
        "category_name": "Food",
        "category_note": "Lunch at restaurant",
        "type": "expense",
        "amount": 350,
        "formatted_amount": "-350 Baht",
        "amount_color": "#EF4444",
        "date": "2024-03-15",
        "formatted_date": "Mar 15, 2024",
        "note": "Lunch at restaurant"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 50,
      "limit": 10,
      "has_next": true,
      "has_previous": false
    },
    "summary": {
      "showing": 10,
      "total": 50
    }
  }
}
```

**Error Responses**:

**400 Bad Request**:

```json
{
  "success": false,
  "message": "Invalid pagination parameters",
  "error": "INVALID_PAGINATION"
}
```

**401 Unauthorized**:

```json
{
  "success": false,
  "message": "Authentication required",
  "error": "UNAUTHORIZED"
}
```

        "note": "Lunch at restaurant"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 50,
      "limit": 10,
      "has_next": true,
      "has_previous": false
    },
    "summary": {
      "showing": 10,
      "total": 50
    }

}
}

````

### 4. Income vs Expense Analysis

**GET** `/protected/api/v1/reports/income-vs-expense`

**Description**: Comparative analysis of income vs expense

**Query Parameters**:

- `period` (optional): "year" or "month"
- `year` (optional): Year, e.g., "2024"
- `month` (optional): Month in YYYY-MM format
- `user_id` (optional): For admin users

**Response**:

```json
{
  "success": true,
  "message": "Income vs expense report retrieved successfully",
  "data": [
    {
      "label": "Income",
      "income": 50000,
      "expense": 35000
    }
  ]
}
````

### 5. Enhanced Expenses by Category

**GET** `/protected/api/v1/reports/expenses-by-category`

**Description**: Enhanced breakdown of expenses by category with colors and structured data for pie charts

**Headers**:

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Query Parameters**:

| Parameter | Type   | Required | Description                                | Example       |
| --------- | ------ | -------- | ------------------------------------------ | ------------- |
| `month`   | string | No       | Format YYYY-MM for specific month          | "2024-03"     |
| `user_id` | string | No       | UUID for admin access to other user's data | "uuid-string" |

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Expenses by category report retrieved successfully",
  "data": {
    "breakdown": [
      {
        "category_name": "Food",
        "amount": 12500,
        "percent": 41.67,
        "color": "#FF6384"
      },
      {
        "category_name": "Transport",
        "amount": 8750,
        "percent": 29.17,
        "color": "#36A2EB"
      },
      {
        "category_name": "Shopping",
        "amount": 8750,
        "percent": 29.17,
        "color": "#FFCE56"
      }
    ],
    "total_expenses": 30000,
    "summary": {
      "total_amount": 30000,
      "currency": "Baht",
      "categories_count": 3
    }
  }
}
```

**Error Responses**:

**400 Bad Request**:

```json
{
  "success": false,
  "message": "Invalid month format. Expected YYYY-MM",
  "error": "INVALID_DATE_FORMAT"
}
```

**401 Unauthorized**:

```json
{
  "success": false,
  "message": "Authentication required",
  "error": "UNAUTHORIZED"
}
```

"data": {
"breakdown": [
{
"category_name": "Food",
"amount": 12500,
"percent": 41.67,
"color": "#FF6384"
},
{
"category_name": "Transport",
"amount": 8750,
"percent": 29.17,
"color": "#36A2EB"
},
{
"category_name": "Shopping",
"amount": 8750,
"percent": 29.17,
"color": "#FFCE56"
}
],
"total_expenses": 30000,
"summary": {
"total_amount": 30000,
"currency": "Baht",
"categories_count": 3
}
}
}

````

### 6. Monthly Close Report

**GET** `/protected/api/v1/reports/monthly-close`

**Description**: Complete monthly financial summary for closing

**Query Parameters**:

- `month` (optional): Format YYYY-MM
- `user_id` (optional): For admin users

**Response**:

```json
{
  "success": true,
  "message": "Monthly close report retrieved successfully",
  "data": {
    "month": "2024-03",
    "total_income": 50000,
    "total_expense": 35000,
    "net_balance": 15000
  }
}
````

## Admin Features

Admin users can access other users' reports by including the `user_id` parameter:

```bash
GET /protected/api/v1/reports/summary?user_id=123&month=2024-03
```

## Usage Examples

### Get Current Month Summary

```bash
curl -X GET "http://localhost:3000/protected/api/v1/reports/summary" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Specific Month Summary

```bash
curl -X GET "http://localhost:3000/protected/api/v1/reports/summary?month=2024-03" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Recent Transactions (Limited)

```bash
curl -X GET "http://localhost:3000/protected/api/v1/reports/recent-transactions?limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Admin Access to User Data

```bash
curl -X GET "http://localhost:3000/protected/api/v1/reports/summary?user_id=123" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## Error Responses

### 400 Bad Request - Invalid Month Format

```json
{
  "success": false,
  "message": "Invalid month format. Expected YYYY-MM",
  "data": null
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authorization token required",
  "data": null
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to retrieve summary report",
  "data": null
}
```

## Notes

- All date parameters should be in YYYY-MM format
- Admin access requires proper role validation (to be implemented)
- Default period is current month if not specified
- All monetary values are in the user's base currency

---

[← Back to API Documentation](../README.md)
