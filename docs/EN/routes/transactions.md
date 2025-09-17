# 💸 Transactions API

## Overview

Record and manage financial transactions with advanced filtering and search capabilities.

**Base Path**: `/protected/api/v1/transactions`

**Authentication**: Required (JWT Bearer Token)

## Endpoints

### Create Transaction

**POST** `/protected/api/v1/transactions`

**Request Body**:

```json
{
  "category_id": 1,
  "type": "expense",
  "amount": 150.5,
  "date": "2024-03-15",
  "note": "Lunch at restaurant"
}
```

### Get Transactions (with filters)

**GET** `/protected/api/v1/transactions`

**Query Parameters**:

- `page` (optional): Page number for pagination
- `limit` (optional): Items per page
- `type` (optional): "income" or "expense"
- `category_id` (optional): Filter by category
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

### Get Transaction by ID

**GET** `/protected/api/v1/transactions/:id`

### Update Transaction

**PUT** `/protected/api/v1/transactions/:id`

**Request Body** (partial update):

```json
{
  "amount": 200.0,
  "note": "Updated lunch expense"
}
```

### Delete Transaction

**DELETE** `/protected/api/v1/transactions/:id`

## Response Format

```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": [
    {
      "transaction_id": 1,
      "category_id": 1,
      "category_name": "Food",
      "type": "expense",
      "amount": 150.5,
      "date": "2024-03-15",
      "note": "Lunch",
      "created_date": "2024-03-15T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 48
  }
}
```

## Usage Examples

### Create Expense Transaction

```bash
curl -X POST "http://localhost:3000/protected/api/v1/transactions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "type": "expense",
    "amount": 150.50,
    "date": "2024-03-15",
    "note": "Lunch"
  }'
```

### Filter Transactions by Date Range

```bash
curl -X GET "http://localhost:3000/protected/api/v1/transactions?start_date=2024-03-01&end_date=2024-03-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

[← Back to API Documentation](../README.md)
