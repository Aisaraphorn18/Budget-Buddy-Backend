# 📂 Categories API

## Overview

Manage income and expense categories for organizing transactions.

**Base Path**: `/protected/api/v1/categories`

**Authentication**: Required (JWT Bearer Token)

## Endpoints

### Get All Categories

**GET** `/protected/api/v1/categories`

**Description**: Retrieve all available categories

### Get Category by ID

**GET** `/protected/api/v1/categories/:id`

**Description**: Get specific category details

### Create New Category

**POST** `/protected/api/v1/categories`

**Request Body**:

```json
{
  "category_name": "Groceries"
}
```

### Update Category

**PUT** `/protected/api/v1/categories/:id`

**Request Body**:

```json
{
  "category_name": "Food & Dining"
}
```

### Delete Category

**DELETE** `/protected/api/v1/categories/:id`

**Description**: Remove category (only if not used in transactions)

## Response Format

```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "category_id": 1,
    "category_name": "Food",
    "created_date": "2024-03-15T10:30:00Z"
  }
}
```

---

[← Back to API Documentation](../README.md)
