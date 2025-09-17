# 📈 Reports & Analytics API

## Overview

Comprehensive financial reporting and analytics endpoints for Budget Buddy users.

**Base Path**: `/protected/api/v1/reports`

**Authentication**: Required (JWT Bearer Token)

## Endpoints

### 1. Financial Summary

**GET** `/protected/api/v1/reports/summary`

**Description**: Get monthly financial summary including total income, expenses, and balance

**Query Parameters**:

- `month` (optional): Format YYYY-MM, e.g., "2024-03"
- `user_id` (optional): For admin users to access other user's data

**Response**:

```json
{
  "success": true,
  "message": "Summary report retrieved successfully",
  "data": {
    "total_income": 50000,
    "total_expense": 35000,
    "balance": 15000,
    "as_of": "2024-03"
  }
}
```

### 2. Recent Transactions

**GET** `/protected/api/v1/reports/recent-transactions`

**Description**: Get list of recent transactions with details

**Query Parameters**:

- `limit` (optional): Number of transactions to return (default: 10)
- `user_id` (optional): For admin users

**Response**:

```json
{
  "success": true,
  "message": "Recent transactions report retrieved successfully",
  "data": [
    {
      "transaction_id": 1,
      "category_name": "Food",
      "type": "expense",
      "amount": 150,
      "date": "2024-03-15",
      "note": "Lunch"
    }
  ]
}
```

### 3. Income vs Expense Analysis

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
```

### 4. Expenses by Category

**GET** `/protected/api/v1/reports/expenses-by-category`

**Description**: Breakdown of expenses by category with percentages

**Query Parameters**:

- `month` (optional): Format YYYY-MM
- `user_id` (optional): For admin users

**Response**:

```json
{
  "success": true,
  "message": "Expenses by category report retrieved successfully",
  "data": [
    {
      "category_id": 1,
      "category_name": "Food",
      "amount": 8000,
      "percent": 23
    },
    {
      "category_id": 2,
      "category_name": "Transportation",
      "amount": 5000,
      "percent": 14
    }
  ]
}
```

### 5. Monthly Close Report

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
```

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
