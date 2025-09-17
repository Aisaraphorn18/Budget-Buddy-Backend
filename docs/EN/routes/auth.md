# 🔑 Authentication API

## Overview

Handle user registration, login, logout, and profile management.

## Endpoints

### Register New User {#register}

**POST** `/api/v1/auth/register`

**Description**: Create a new user account

**Request Body**:

```json
{
  "username": "john_doe",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securePassword123"
}
```

**Response**:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "user_id": 1,
      "username": "john_doe",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

### User Login {#login}

**POST** `/api/v1/auth/login`

**Description**: Authenticate user and receive JWT token

**Request Body**:

```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "username": "john_doe",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

### User Logout

**POST** `/api/v1/auth/logout`

**Description**: Logout user (invalidate token)

**Headers**:

```
Authorization: Bearer <token>
```

**Response**:

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Get User Profile

**GET** `/api/v1/auth/profile`

**Description**: Get current user profile information

**Headers**:

```
Authorization: Bearer <token>
```

**Response**:

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user_id": 1,
    "username": "john_doe",
    "first_name": "John",
    "last_name": "Doe",
    "created_date": "2024-03-15T10:30:00Z"
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Username already exists",
  "data": null
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid username or password",
  "data": null
}
```

## Usage Examples

### Register and Login Flow

```bash
# 1. Register
curl -X POST "http://localhost:3000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securePassword123"
  }'

# 2. Login
curl -X POST "http://localhost:3000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'

# 3. Use token in subsequent requests
curl -X GET "http://localhost:3000/api/v1/auth/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

[← Back to API Documentation](../README.md)
