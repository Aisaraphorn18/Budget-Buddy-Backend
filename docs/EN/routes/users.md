# 👥 User Management API

## Overview

Admin-only endpoints for user account management and statistics.

**Base Path**: `/protected/api/v1/users`

**Authentication**: Required (JWT Bearer Token + Admin Role)

## Endpoints

### Get All Users

**GET** `/protected/api/v1/users`

**Description**: Get all users with search and pagination

**Query Parameters**:

- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search by username or name

### Get User by ID

**GET** `/protected/api/v1/users/:id`

**Description**: Get specific user details with statistics

### Delete User Account

**DELETE** `/protected/api/v1/users/:id`

**Description**: Permanently delete user account and all associated data

## Response Format

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "user_id": 1,
      "username": "john_doe",
      "first_name": "John",
      "last_name": "Doe",
      "created_date": "2024-03-15T10:30:00Z",
      "stats": {
        "total_transactions": 45,
        "total_budgets": 3,
        "last_login": "2024-03-20T14:22:00Z"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 48
  }
}
```

## Admin Access Required

⚠️ **Important**: These endpoints require admin role validation. Regular users cannot access user management features.

---

[← Back to API Documentation](../README.md)
