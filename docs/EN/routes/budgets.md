# 📊 Budgets API

## Overview

Create and track monthly budgets with spending comparison.

**Base Path**: `/protected/api/v1/budgets`

**Authentication**: Required (JWT Bearer Token)

## Endpoints

### Create Budget

**POST** `/protected/api/v1/budgets`

**Request Body**:

```json
{
  "category_id": 1,
  "month": "2024-03",
  "budget_amount": 5000
}
```

### Get Budgets (with filters)

**GET** `/protected/api/v1/budgets`

**Query Parameters**:

- `month` (optional): Filter by month (YYYY-MM)
- `category_id` (optional): Filter by category

### Get Budget by ID

**GET** `/protected/api/v1/budgets/:id`

### Update Budget

**PUT** `/protected/api/v1/budgets/:id`

### Delete Budget

**DELETE** `/protected/api/v1/budgets/:id`

## Response Format

```json
{
  "success": true,
  "message": "Budgets retrieved successfully",
  "data": [
    {
      "budget_id": 1,
      "category_id": 1,
      "category_name": "Food",
      "month": "2024-03",
      "budget_amount": 5000,
      "spent_amount": 3200,
      "remaining_amount": 1800,
      "percentage_used": 64
    }
  ]
}
```

---

[← Back to API Documentation](../README.md)
