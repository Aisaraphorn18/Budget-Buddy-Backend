# 📖 Budget Buddy API Documentation (English)

## Overview

Budget Buddy Backend is a RESTful API built with ElysiaJS and TypeScript for personal financial management

## 🌐 Base URL

```
http://localhost:3000
```

## 🔐 Authentication

The API uses JWT (JSON Web Token) for authentication:

```
Authorization: Bearer <your-jwt-token>
```

## 📋 API Routes Documentation

### 🔓 Public Routes (No Authentication Required)

#### 🏥 [Health Check](routes/health.md)

- Server status and health monitoring

#### 🔑 [Authentication](routes/auth.md)

- User registration, login, logout
- Profile management

### 🔒 Protected Routes (Authentication Required)

#### 📂 [Categories](routes/categories.md)

- Manage income/expense categories
- CRUD operations for categories

#### 💸 [Transactions](routes/transactions.md)

- Record and manage financial transactions
- Advanced filtering and search

#### 📊 [Budgets](routes/budgets.md)

- Create and track monthly budgets
- Compare budgets vs actual spending

#### 📈 [Reports & Analytics](routes/reports.md)

- Monthly financial summary
- Recent transactions
- Income vs expense analysis
- Expense analysis by category
- Monthly close reports

#### 👥 [User Management](routes/users.md)

- Admin only features
- User account management and statistics

## 🛠️ Usage

### Quick Start

1. [Register](routes/auth.md#register) for a new account
2. [Login](routes/auth.md#login) to get JWT token
3. Include token in Authorization header
4. Start using [Protected Routes](#🔒-protected-routes-authentication-required)

### Error Handling

- **200** - Success
- **400** - Bad Request
- **401** - Unauthorized
- **404** - Not Found
- **500** - Internal Server Error

## 🔗 Additional Resources

- **[Interactive API Explorer](http://localhost:3000/openapi)** - Real-time API testing
- **[Thai Documentation](../TH/README.md)** - เอกสารภาษาไทย

---

For questions or support, please contact the development team
