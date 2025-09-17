# Budget Buddy Backend API 💰

> 🚀 Modern Personal Finance Management RESTful API built with ElysiaJS, TypeScript, and Supabase

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![ElysiaJS](https://img.shields.io/badge/ElysiaJS-Latest-ff6b9d.svg)](https://elysiajs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.io/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-yellow.svg)](https://bun.sh/)
[![Tests](https://img.shields.io/badge/Tests-323%20Passing-brightgreen.svg)](tests/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

| English                                      | ไทย                                               |
| -------------------------------------------- | ------------------------------------------------- |
| [✨ Features](#-features)                    | [✨ คุณสมบัติ](#-คุณสมบัติ)                       |
| [🚀 Quick Start](#-quick-start)              | [🚀 เริ่มต้นอย่างรวดเร็ว](#-เริ่มต้นอย่างรวดเร็ว) |
| [⚙️ Configuration](#️-configuration)         | [⚙️ การกำหนดค่า](#️-การกำหนดค่า)                  |
| [🌐 API Overview](#-api-overview)            | [🌐 ภาพรวม API](#-ภาพรวม-api)                     |
| [📝 API Examples](#-api-examples)            | [📝 ตัวอย่าง API](#-ตัวอย่าง-api)                 |
| [🧪 Testing](#-testing)                      | [🧪 การทดสอบ](#-การทดสอบ)                         |
| [🏗️ Project Structure](#️-project-structure) | [🏗️ โครงสร้างโปรเจค](#️-โครงสร้างโปรเจค)          |
| [🔒 Security](#-security)                    | [🔒 ความปลอดภัย](#-ความปลอดภัย)                   |
| [🚀 Deployment](#-deployment)                | [🚀 การ Deploy](#-การ-deploy)                     |
| [🛠️ Development](#️-development)             | [🛠️ การพัฒนา](#️-การพัฒนา)                        |
| [📊 Performance](#-performance)              | [📊 ประสิทธิภาพ](#-ประสิทธิภาพ)                   |
| [🔧 Troubleshooting](#-troubleshooting)      | [🔧 การแก้ไขปัญหา](#-การแก้ไขปัญหา)               |
| [📚 Documentation](#-documentation)          | [📚 เอกสาร](#-เอกสาร)                             |
| [🤝 Contributing](#-contributing)            | [🤝 การมีส่วนร่วม](#-การมีส่วนร่วม)               |

---

## ✨ Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 💰 **Transaction Management** - Complete CRUD operations for financial transactions
- 📊 **Budget Tracking** - Create and monitor budgets with spending analysis
- 📈 **Financial Reports** - Comprehensive analytics and reporting
- 🏷️ **Category Management** - Organize transactions with custom categories
- 👥 **User Management** - Admin features for user administration
- 🧪 **Comprehensive Testing** - 323 tests with 100% endpoint coverage
- ⚡ **High Performance** - Built with Bun and ElysiaJS for speed
- 🛡️ **Type Safety** - Full TypeScript implementation
- 🔒 **Security First** - Input validation, CORS, and secure practices

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) 1.0+ or Node.js 18+
- [Supabase](https://supabase.io/) account and project

### Installation

```bash
# Clone repository
git clone https://github.com/Aisaraphorn18/Budget-Buddy-Backend.git
cd Budget-Buddy-Backend

# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
bun run dev
```

### Environment Configuration

```bash
# .env file
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_256_bit_secret
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## ⚙️ Configuration

### Environment Variables

| Variable                    | Description                         | Required | Default       |
| --------------------------- | ----------------------------------- | -------- | ------------- |
| `SUPABASE_URL`              | Your Supabase project URL           | ✅       | -             |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key              | ✅       | -             |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key           | ✅       | -             |
| `JWT_SECRET`                | Secret key for JWT tokens (256-bit) | ✅       | -             |
| `NODE_ENV`                  | Environment mode                    | ❌       | `development` |
| `PORT`                      | Server port                         | ❌       | `3000`        |
| `CORS_ORIGIN`               | Allowed CORS origins                | ❌       | `*`           |

### Database Schema

The application uses Supabase PostgreSQL with the following main tables:

```sql
-- Users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  category_icon VARCHAR(50) DEFAULT '📁',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
  transaction_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  category_id INTEGER REFERENCES categories(category_id),
  transaction_type VARCHAR(10) CHECK (transaction_type IN ('income', 'expense')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  transaction_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE budgets (
  budget_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  category_id INTEGER REFERENCES categories(category_id),
  budget_amount DECIMAL(10,2) NOT NULL,
  cycle_month VARCHAR(7) NOT NULL, -- YYYY-MM format
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category_id, cycle_month)
);
```

## 🌐 API Overview

### Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

### Authentication

```bash
# Register
POST /api/v1/auth/register

# Login
POST /api/v1/auth/login

# Protected routes require Authorization header
Authorization: Bearer YOUR_JWT_TOKEN

# 🔒 Security Note: All protected endpoints automatically use user_id from JWT token
# No need to send user_id as parameter for regular operations
```

### Main Endpoints

- 🔒 **Auth**: `/api/v1/auth/*` - User authentication and profile management
- 🏷️ **Categories**: `/protected/api/v1/categories/*` - Category CRUD operations
- 💰 **Transactions**: `/protected/api/v1/transactions/*` - Transaction management
  - 👑 **Admin**: `/protected/api/v1/transactions/user/{user_id}` - Access any user's transactions
- 📊 **Budgets**: `/protected/api/v1/budgets/*` - Budget tracking and analysis
  - � **Admin**: `/protected/api/v1/budgets/user/{user_id}` - Access any user's budgets
- �📈 **Reports**: `/protected/api/v1/reports/*` - Financial analytics
- 👥 **Users**: `/protected/api/v1/users/*` - User management (admin only)

### Security Features

- ✅ **Token-based authentication** - User identity extracted from JWT
- ✅ **Automatic user isolation** - Data filtered by authenticated user
- ✅ **Admin-only endpoints** - Special routes for administrative access with `user_id` parameters
- ✅ **No user_id parameters** - Regular endpoints use token validation only

### Quick Test

```bash
# Health check
curl http://localhost:3000/health

# Response: {"status":"healthy","timestamp":"..."}
```

## 📝 API Examples

### Authentication Flow

#### 1. User Registration

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "password": "securepassword123"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": 1,
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe",
      "is_admin": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

#### 2. User Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

### Transaction Management

#### Create Transaction

```bash
curl -X POST http://localhost:3000/protected/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_id": 1,
    "transaction_type": "expense",
    "amount": 25.50,
    "description": "Coffee shop",
    "transaction_date": "2024-01-15"
  }'

# 🔒 Note: user_id is automatically extracted from JWT token
```

#### Get User Transactions

```bash
curl -X GET "http://localhost:3000/protected/api/v1/transactions?page=1&limit=10&type=expense" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 🔒 Security: Only returns transactions for authenticated user
```

### Budget Management

#### Create Budget

```bash
curl -X POST http://localhost:3000/protected/api/v1/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_id": 1,
    "budget_amount": 500.00,
    "cycle_month": "2024-01"
  }'

# 🔒 Note: user_id is automatically extracted from JWT token
```

#### Get Budget Overview

```bash
curl -X GET http://localhost:3000/protected/api/v1/budgets/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 🔒 Security: Only returns budgets for authenticated user
```

### Category Management

#### Create Category

```bash
curl -X POST http://localhost:3000/protected/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_name": "Transportation",
    "category_icon": "🚗"
  }'

# 🔒 Note: user_id is automatically extracted from JWT token
```

### 👑 Admin API Examples

#### Admin - Get User Transactions

```bash
# Get all transactions for a specific user (admin only)
curl -X GET "http://localhost:3000/protected/api/v1/transactions/user/123?type=expense&limit=10" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# 👑 Admin only: Access any user's transactions via user_id parameter
```

#### Admin - Get User Budgets

```bash
# Get all budgets for a specific user (admin only)
curl -X GET "http://localhost:3000/protected/api/v1/budgets/user/123?cycle_month=2024-03" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# 👑 Admin only: Access any user's budgets via user_id parameter
```

**Admin Response Example:**

```json
{
  "success": true,
  "message": "User budgets retrieved successfully",
  "data": [
    {
      "budget_id": 1,
      "user_id": 123,
      "category_name": "Food",
      "budget_amount": 5000,
      "cycle_month": "2024-03",
      "created_at": "2024-03-01T00:00:00Z"
    }
  ]
}
```

### Reports and Analytics

#### Dashboard Summary

```bash
# Get dashboard cards for home page
curl -X GET http://localhost:3000/protected/api/v1/reports/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by month
curl -X GET "http://localhost:3000/protected/api/v1/reports/dashboard?month=2024-03" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 🔒 Security: Only returns data for authenticated user
```

#### Financial Summary

```bash
# Get monthly summary
curl -X GET http://localhost:3000/protected/api/v1/reports/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get annual breakdown for charts
curl -X GET "http://localhost:3000/protected/api/v1/reports/summary?range=year&year=2024" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 🔒 Note: user_id is automatically extracted from JWT token
```

#### Recent Transactions

```bash
# Get recent transactions for table display
curl -X GET "http://localhost:3000/protected/api/v1/reports/recent-transactions?limit=10&page=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 🔒 Security: Only returns transactions for authenticated user
```

**Response:**

```json
{
  "success": true,
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

#### Enhanced Financial Summary

```bash
# Monthly summary
curl -X GET "http://localhost:3000/api/v1/reports/summary?month=2024-03" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Annual breakdown for bar charts
curl -X GET "http://localhost:3000/api/v1/reports/summary?range=year&year=2024" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Annual Response:**

```json
{
  "success": true,
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

#### Recent Transactions with Pagination

```bash
# Get recent transactions with pagination
curl -X GET "http://localhost:3000/api/v1/reports/recent-transactions?limit=10&page=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**

```json
{
  "success": true,
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
        "formatted_date": "Mar 15, 2024"
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

#### Enhanced Expenses by Category

```bash
# Get expenses with colors for pie charts
curl -X GET http://localhost:3000/api/v1/reports/expenses-by-category \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**

```json
{
  "success": true,
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

#### Income vs Expense Analysis

```bash
curl -X GET "http://localhost:3000/api/v1/reports/income-vs-expense?year=2024" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 Testing

### Comprehensive Test Suite

- **323 Total Tests** (174 Unit + 146 Integration + 3 Setup)
- **100% API Coverage** - All endpoints tested
- **Zero Database Dependencies** - Mock-based testing
- **Lightning Fast** - Complete suite runs in ~149ms

```bash
# Run all tests
bun test

# Run by category
bun test tests/unit/              # 174 unit tests
bun test tests/integration/       # 138 integration tests

# Run specific service tests
bun test tests/unit/auth.service.bun.test.ts        # 34 tests
bun test tests/unit/transaction.service.bun.test.ts # 36 tests

# Test with timeout
bun test --timeout 15000
```

### Test Features

- 🎭 **Mock HTTP Clients** - Realistic API simulation
- 🌐 **Thai Descriptions** - Integration tests with Thai language support
- 📋 **Emoji Organization** - Tests grouped by functionality
- ⚡ **Fast Execution** - No real database operations

## 🏗️ Project Structure

```
Budget-Buddy-Backend/
├── 📁 src/                          # Source code
│   ├── 📄 index.ts                  # Application entry point
│   ├── 📁 controllers/              # HTTP request handlers
│   │   ├── 📄 auth.controller.ts    # Authentication controller
│   │   ├── 📄 budget.controller.ts  # Budget controller
│   │   ├── 📄 category.controller.ts # Category controller
│   │   ├── 📄 reports.controller.ts # Reports controller
│   │   ├── 📄 transaction.controller.ts # Transaction controller
│   │   └── 📄 user.controller.ts    # User controller
│   ├── 📁 routes/                   # API route definitions
│   │   ├── 📄 auth.routes.ts        # Authentication routes
│   │   ├── 📄 budget.routes.ts      # Budget routes
│   │   ├── 📄 category.routes.ts    # Category routes
│   │   ├── 📄 health.routes.ts      # Health check routes
│   │   ├── 📄 reports.routes.ts     # Report routes
│   │   ├── 📄 transaction.routes.ts # Transaction routes
│   │   ├── 📄 user.routes.ts        # User management routes
│   │   └── 📄 index.ts              # Route aggregator
│   ├── 📁 services/                 # Business logic layer
│   │   ├── 📄 auth.service.ts       # Authentication service
│   │   ├── 📄 budget.service.ts     # Budget service
│   │   ├── 📄 category.service.ts   # Category service
│   │   ├── 📄 transaction.service.ts # Transaction service
│   │   └── 📄 user.service.ts       # User service
│   ├── 📁 models/                   # TypeScript interfaces/models
│   │   ├── 📄 budget.model.ts       # Budget data models
│   │   ├── 📄 category.model.ts     # Category models
│   │   ├── 📄 transaction.model.ts  # Transaction models
│   │   └── 📄 user.model.ts         # User models
│   ├── 📁 schemas/                  # Validation schemas
│   │   ├── 📄 api.schema.ts         # API validation schemas
│   │   ├── 📄 auth.schema.ts        # Authentication schemas
│   │   └── 📄 user.schema.ts        # User validation schemas
│   ├── 📁 config/                   # Configuration files
│   │   └── 📄 supabase.ts           # Supabase client configuration
│   ├── � types/                    # TypeScript type definitions
│   │   └── 📄 elysia.types.ts       # Elysia framework types
│   └── 📁 utils/                    # Utility functions
│       └── 📄 logger.ts             # Logging utilities
├── 📁 tests/                        # Test files
│   ├── 📄 README.md                # Testing documentation
│   ├── � setup.test.ts            # Test setup configuration
│   ├── 📄 package.json             # Test-specific dependencies
│   ├── �📁 unit/                    # Unit tests (174 tests)
│   │   ├── 📄 auth.service.bun.test.ts
│   │   ├── 📄 budget.service.bun.test.ts
│   │   ├── 📄 category.service.bun.test.ts
│   │   ├── 📄 transaction.service.bun.test.ts
│   │   └── 📄 user.service.bun.test.ts
│   ├── 📁 integration/              # Integration tests (138 tests)
│   │   ├── 📄 auth.api.bun.test.ts
│   │   ├── 📄 budget.api.bun.test.ts
│   │   ├── 📄 category.api.bun.test.ts
│   │   ├── 📄 reports.api.bun.test.ts
│   │   ├── 📄 transaction.api.bun.test.ts
│   │   └── 📄 user.api.bun.test.ts
│   ├── 📁 mocks/                   # Mock implementations
│   │   ├── 📄 supabase.mock.ts     # Full Supabase mock
│   │   └── 📄 supabase-simple.mock.ts # Simple Supabase mock
│   └── 📁 utils/                   # Test utilities
│       └── 📄 test-utils.ts        # Test helper functions
├── 📁 docs/                         # Documentation
│   ├── 📄 api-documentation.md     # Complete API reference
│   ├── 📄 architecture.md          # Architecture guide
│   ├── 📄 deployment.md            # Deployment guide
│   ├── 📁 EN/                      # English documentation
│   └── 📁 TH/                      # Thai documentation
├── 📁 .husky/                      # Git hooks configuration
│   ├── 📄 commit-msg               # Commit message validation
│   ├── 📄 pre-commit               # Pre-commit hooks
│   └── 📄 bun-utils.sh             # Bun utility scripts
├── 📁 .vscode/                     # VS Code settings
│   └── 📄 settings.json            # Editor configuration
├── 📄 package.json                 # Dependencies and scripts
├── 📄 bun.lockb                    # Dependency lock file
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 eslint.config.js             # ESLint configuration
├── 📄 .prettierrc                  # Prettier configuration
├── 📄 .prettierignore              # Prettier ignore patterns
├── 📄 .commitlintrc.js             # Commit lint rules
├── 📄 .gitignore                   # Git ignore patterns
├── 📄 .env.example                 # Environment template
├── 📄 test-runner.ts               # Test runner configuration
└── 📄 README.md                    # Project overview
```

├── 📄 tsconfig.json # TypeScript configuration
├── 📄 bun.lockb # Bun lock file
├── 📄 .env.example # Environment template
├── 📄 README.md # This file
└── 📄 LICENSE # MIT License

````

### Architecture Overview

The application follows a **layered architecture** pattern:

1. **Presentation Layer** (`routes/`) - HTTP request handling and response formatting
2. **Business Logic Layer** (`services/`) - Core business operations and rules
3. **Data Access Layer** (`utils/database.ts`) - Database interactions via Supabase
4. **Cross-cutting Concerns** (`middleware/`, `types/`, `utils/`) - Authentication, validation, utilities

## 🔒 Security

### Authentication & Authorization
- **JWT-based authentication** with secure token generation
- **Password hashing** using industry-standard algorithms
- **Role-based access control** (User/Admin permissions)
- **Protected routes** with middleware authentication
- **User isolation** - All operations use user_id from JWT token for security
- **Admin-only endpoints** - Special endpoints for admin access:
  - `/protected/api/v1/transactions/user/{user_id}` - Admin access to any user's transactions
  - `/protected/api/v1/budgets/user/{user_id}` - Admin access to any user's budgets

### Data Security
- **Input validation** on all endpoints to prevent injection attacks
- **SQL injection protection** through parameterized queries
- **CORS configuration** to control cross-origin requests
- **Rate limiting** to prevent abuse (configurable)
- **Token-based user identification** - Regular endpoints use JWT token only
- **Admin parameter validation** - Admin endpoints require both valid admin token and user_id parameter

### Security Headers
```typescript
// Security middleware automatically applies:
{
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}
````

### Best Practices

- ✅ Environment variables for sensitive data
- ✅ Token expiration and refresh mechanisms
- ✅ Secure password requirements
- ✅ HTTPS enforcement in production
- ✅ Regular security dependency updates

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add JWT_SECRET
```

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Docker

```dockerfile
FROM oven/bun:1 as base

WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
```

### Environment-specific Configurations

#### Production

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your_secure_256_bit_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Staging

```bash
NODE_ENV=staging
PORT=3000
JWT_SECRET=staging_secret_key
CORS_ORIGIN=https://staging.your-domain.com
```

## 🛠️ Development

### Available Scripts

```bash
# Development
bun run dev          # Start development server with hot reload
bun run start        # Start production server
bun run build        # Build for production

# Testing
bun test             # Run all tests
bun test:unit        # Run unit tests only
bun test:integration # Run integration tests only
bun test:watch       # Run tests in watch mode
bun test:coverage    # Run tests with coverage report

# Code Quality
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint issues
bun run format       # Format code with Prettier
bun run type-check   # TypeScript type checking

# Database
bun run db:migrate   # Run database migrations
bun run db:seed      # Seed database with sample data
bun run db:reset     # Reset database to initial state
```

### Development Workflow

1. **Setup**: Clone repository and install dependencies
2. **Environment**: Copy `.env.example` to `.env` and configure
3. **Database**: Set up Supabase project and run migrations
4. **Development**: Use `bun run dev` for hot reload development
5. **Testing**: Write and run tests with `bun test`
6. **Code Quality**: Use `bun run lint` and `bun run format`
7. **Commit**: Follow conventional commit format

### Git Hooks

The project uses Husky for Git hooks:

```bash
# Pre-commit: Runs linting and formatting
# Pre-push: Runs all tests
# Commit-msg: Validates commit message format
```

## 📊 Performance

### Benchmarks

- **Startup Time**: ~50ms (Bun runtime optimization)
- **Request Latency**: <10ms average response time
- **Throughput**: 10,000+ requests/second
- **Memory Usage**: <100MB baseline memory footprint

### Optimization Features

- **Bun Runtime**: Ultra-fast JavaScript/TypeScript execution
- **ElysiaJS Framework**: Minimal overhead, maximum performance
- **Connection Pooling**: Efficient database connection management
- **Response Caching**: Strategic caching for read-heavy endpoints
- **Compression**: Gzip/Brotli compression for API responses

### Performance Monitoring

```bash
# Load testing with autocannon
bunx autocannon -c 100 -d 30 http://localhost:3000/health

# Memory profiling
bun --inspect src/index.ts

# Performance metrics endpoint
curl http://localhost:3000/api/v1/metrics
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Check Supabase connection
curl -X GET 'https://your-project.supabase.co/rest/v1/' \
  -H "apikey: YOUR_ANON_KEY"

# Verify environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

#### JWT Token Issues

```bash
# Verify JWT secret is 256-bit (32 characters)
echo $JWT_SECRET | wc -c  # Should output 33 (including newline)

# Test token generation
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

#### CORS Issues

```bash
# Check CORS configuration
curl -X OPTIONS http://localhost:3000/api/v1/auth/register \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=budget-buddy:* bun run dev

# Specific debug categories
DEBUG=budget-buddy:auth,budget-buddy:db bun run dev
```

### Health Checks

```bash
# Application health
curl http://localhost:3000/health

# Database health
curl http://localhost:3000/api/v1/health/db

# Dependencies health
curl http://localhost:3000/api/v1/health/dependencies
```

## 📚 Documentation

### Core Documentation

- 📖 **[API Documentation](docs/api-documentation.md)** - Complete API reference with examples
- 🏗️ **[Architecture Guide](docs/architecture.md)** - Project structure and design patterns
- 🚀 **[Deployment Guide](docs/deployment.md)** - Production deployment instructions
- 🧪 **[Testing Guide](tests/README.md)** - Comprehensive testing documentation

### Language-Specific Documentation

- 🇺🇸 **[English Documentation](docs/EN/README.md)** - Complete API documentation in English
- 🇹🇭 **[Thai Documentation](docs/TH/README.md)** - เอกสาร API ภาษาไทยฉบับสมบูรณ์
- 🧪 **[Testing Guide (EN)](docs/EN/testing.md)** - Detailed testing documentation in English
- 🧪 **[Testing Guide (TH)](docs/TH/testing.md)** - คู่มือการทดสอบแบบละเอียดภาษาไทย

### Route-Specific Documentation (English)

- 🔐 **[Auth Routes](docs/EN/routes/auth.md)** - Authentication and authorization endpoints
- 💰 **[Transaction Routes](docs/EN/routes/transactions.md)** - Transaction management endpoints
- 📊 **[Budget Routes](docs/EN/routes/budgets.md)** - Budget tracking and analysis endpoints
- 🏷️ **[Category Routes](docs/EN/routes/categories.md)** - Category management endpoints
- 📈 **[Report Routes](docs/EN/routes/reports.md)** - Financial analytics and reporting endpoints
- 👥 **[User Routes](docs/EN/routes/users.md)** - User management endpoints (admin only)
- 🏥 **[Health Routes](docs/EN/routes/health.md)** - System health and monitoring endpoints

### Route-Specific Documentation (Thai)

- 🔐 **[Auth Routes](docs/TH/routes/auth.md)** - endpoints การยืนยันตัวตนและการอนุญาต
- 💰 **[Transaction Routes](docs/TH/routes/transactions.md)** - endpoints การจัดการธุรกรรม
- 📊 **[Budget Routes](docs/TH/routes/budgets.md)** - endpoints การติดตามและวิเคราะห์งบประมาณ
- 🏷️ **[Category Routes](docs/TH/routes/categories.md)** - endpoints การจัดการหมวดหมู่
- 📈 **[Report Routes](docs/TH/routes/reports.md)** - endpoints การวิเคราะห์และรายงานทางการเงิน
- 👥 **[User Routes](docs/TH/routes/users.md)** - endpoints การจัดการผู้ใช้ (สำหรับ admin เท่านั้น)
- 🏥 **[Health Routes](docs/TH/routes/health.md)** - endpoints สุขภาพระบบและการตรวจสอบ

### Quick Links

- **API Endpoints**: See [API Documentation](docs/api-documentation.md)
- **Project Structure**: See [Architecture Guide](docs/architecture.md)
- **Deployment**: See [Deployment Guide](docs/deployment.md)
- **Testing Details**: See [Testing Guide](tests/README.md)
- **English Docs**: See [EN Documentation](docs/EN/README.md)
- **Thai Docs**: See [TH Documentation](docs/TH/README.md)

## 🛠️ Technology Stack

| Category           | Technology                                                   |
| ------------------ | ------------------------------------------------------------ |
| **Runtime**        | [Bun](https://bun.sh/) - Ultra-fast JavaScript runtime       |
| **Framework**      | [ElysiaJS](https://elysiajs.com/) - Type-safe web framework  |
| **Language**       | [TypeScript](https://www.typescriptlang.org/) - Type safety  |
| **Database**       | [Supabase](https://supabase.io/) - PostgreSQL with real-time |
| **Testing**        | Bun built-in test framework                                  |
| **Authentication** | JWT with middleware                                          |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

```bash
# 1. Fork and clone
git clone your-fork-url
cd Budget-Buddy-Backend

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and test
bun test

# 4. Commit and push
git commit -m "feat: add your feature"
git push origin feature/your-feature-name

# 5. Create pull request
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/Aisaraphorn18/Budget-Buddy-Backend/issues)
- 📧 **Email**: support@budgetbuddy.com
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Aisaraphorn18/Budget-Buddy-Backend/discussions)

---

# Budget Buddy Backend API 💰 (ไทย)

> 🚀 API สำหรับการจัดการการเงินส่วนบุคคลสมัยใหม่ สร้างด้วย ElysiaJS, TypeScript และ Supabase

## ⚙️ การกำหนดค่า

### ตัวแปร Environment

| ตัวแปร                      | คำอธิบาย                               | จำเป็น | ค่าเริ่มต้น   |
| --------------------------- | -------------------------------------- | ------ | ------------- |
| `SUPABASE_URL`              | URL โปรเจค Supabase ของคุณ             | ✅     | -             |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key                 | ✅     | -             |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key              | ✅     | -             |
| `JWT_SECRET`                | Secret key สำหรับ JWT tokens (256-bit) | ✅     | -             |
| `NODE_ENV`                  | โหมด Environment                       | ❌     | `development` |
| `PORT`                      | พอร์ตเซิร์ฟเวอร์                       | ❌     | `3000`        |
| `CORS_ORIGIN`               | Origins ที่อนุญาต CORS                 | ❌     | `*`           |

### โครงสร้างฐานข้อมูล

แอปพลิเคชันใช้ Supabase PostgreSQL พร้อมตารางหลักดังนี้:

```sql
-- ตาราง Users
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง Categories
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  category_icon VARCHAR(50) DEFAULT '📁',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง Transactions
CREATE TABLE transactions (
  transaction_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  category_id INTEGER REFERENCES categories(category_id),
  transaction_type VARCHAR(10) CHECK (transaction_type IN ('income', 'expense')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  transaction_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง Budgets
CREATE TABLE budgets (
  budget_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  category_id INTEGER REFERENCES categories(category_id),
  budget_amount DECIMAL(10,2) NOT NULL,
  cycle_month VARCHAR(7) NOT NULL, -- รูปแบบ YYYY-MM
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category_id, cycle_month)
);
```

## 📝 ตัวอย่าง API

### ขั้นตอนการยืนยันตัวตน

#### 1. การลงทะเบียนผู้ใช้

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "password": "securepassword123"
  }'
```

**การตอบกลับ:**

```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": 1,
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe",
      "is_admin": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "ลงทะเบียนผู้ใช้สำเร็จ"
}
```

#### 2. การเข้าสู่ระบบ

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

### การจัดการธุรกรรม

#### สร้างธุรกรรม

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_id": 1,
    "transaction_type": "expense",
    "amount": 25.50,
    "description": "ร้านกาแฟ",
    "transaction_date": "2024-01-15"
  }'
```

#### ดึงธุรกรรมของผู้ใช้

```bash
curl -X GET "http://localhost:3000/api/v1/transactions?page=1&limit=10&type=expense" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### การจัดการงบประมาณ

#### สร้างงบประมาณ

```bash
curl -X POST http://localhost:3000/api/v1/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_id": 1,
    "budget_amount": 500.00,
    "cycle_month": "2024-01"
  }'
```

#### ดูภาพรวมงบประมาณ

```bash
curl -X GET http://localhost:3000/api/v1/budgets/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### การจัดการหมวดหมู่

#### สร้างหมวดหมู่

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_name": "ความบันเทิง",
    "category_icon": "🎬"
  }'
```

### รายงานและการวิเคราะห์

#### สรุปการเงิน

```bash
curl -X GET http://localhost:3000/api/v1/reports/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### การวิเคราะห์รายได้ vs รายจ่าย

```bash
curl -X GET "http://localhost:3000/api/v1/reports/income-vs-expense?year=2024" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- 🔐 **ระบบยืนยันตัวตน JWT** - การยืนยันตัวตนและการอนุญาตที่ปลอดภัย
- 💰 **จัดการธุรกรรม** - การจัดการข้อมูลทางการเงินแบบครบวงจร
- 📊 **ติดตามงบประมาณ** - สร้างและตรวจสอบงบประมาณพร้อมวิเคราะห์การใช้จ่าย
- 📈 **รายงานการเงิน** - การวิเคราะห์และการรายงานที่ครอบคลุม
- 🏷️ **จัดการหมวดหมู่** - จัดระเบียบธุรกรรมด้วยหมวดหมู่ที่กำหนดเอง
- 👥 **จัดการผู้ใช้** - คุณสมบัติสำหรับผู้ดูแลระบบ
- 🧪 **การทดสอบครบถ้วน** - 315 การทดสอบครอบคลุม endpoint ทั้งหมด
- ⚡ **ประสิทธิภาพสูง** - สร้างด้วย Bun และ ElysiaJS เพื่อความเร็ว
- 🛡️ **ความปลอดภัยของ Type** - การใช้งาน TypeScript แบบเต็มรูปแบบ
- 🔒 **ความปลอดภัยเป็นหลัก** - การตรวจสอบอินพุต, CORS และแนวปฏิบัติที่ปลอดภัย

## 🚀 เริ่มต้นอย่างรวดเร็ว

### ความต้องการเบื้องต้น

- [Bun](https://bun.sh/) 1.0+ หรือ Node.js 18+
- บัญชีและโปรเจค [Supabase](https://supabase.io/)

### การติดตั้ง

```bash
# โคลน repository
git clone https://github.com/Aisaraphorn18/Budget-Buddy-Backend.git
cd Budget-Buddy-Backend

# ติดตั้ง dependencies
bun install

# ตั้งค่า environment
cp .env.example .env
# แก้ไข .env ด้วยข้อมูล Supabase ของคุณ

# รัน development server
bun run dev
```

### การตั้งค่า Environment

```bash
# ไฟล์ .env
SUPABASE_URL=url_โปรเจค_supabase_ของคุณ
SUPABASE_ANON_KEY=anon_key_ของคุณ
SUPABASE_SERVICE_ROLE_KEY=service_role_key_ของคุณ
JWT_SECRET=secret_256_bit_ของคุณ
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## ⚙️ การกำหนดค่า

### ตัวแปร Environment

| ตัวแปร                      | คำอธิบาย                               | จำเป็น | ค่าเริ่มต้น   |
| --------------------------- | -------------------------------------- | ------ | ------------- |
| `SUPABASE_URL`              | URL โปรเจค Supabase ของคุณ             | ✅     | -             |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key                 | ✅     | -             |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key              | ✅     | -             |
| `JWT_SECRET`                | Secret key สำหรับ JWT tokens (256-bit) | ✅     | -             |
| `NODE_ENV`                  | โหมด Environment                       | ❌     | `development` |
| `PORT`                      | พอร์ตเซิร์ฟเวอร์                       | ❌     | `3000`        |
| `CORS_ORIGIN`               | Origin ที่อนุญาตสำหรับ CORS            | ❌     | `*`           |

### Database Schema

แอปพลิเคชันใช้ Supabase PostgreSQL พร้อมตารางหลักดังนี้:

```sql
-- ตาราง users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง budgets
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    period VARCHAR(10) CHECK (period IN ('monthly', 'yearly')) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 ภาพรวม API

### Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

### การยืนยันตัวตน

```bash
# ลงทะเบียน
POST /api/v1/auth/register

# เข้าสู่ระบบ
POST /api/v1/auth/login

# routes ที่ป้องกันต้องใช้ Authorization header
Authorization: Bearer YOUR_JWT_TOKEN
```

### Endpoints หลัก

- 🔒 **Auth**: `/api/v1/auth/*` - การยืนยันตัวตนและจัดการโปรไฟล์
- 🏷️ **Categories**: `/api/v1/categories/*` - การจัดการหมวดหมู่
- 💰 **Transactions**: `/api/v1/transactions/*` - การจัดการธุรกรรม
- 📊 **Budgets**: `/api/v1/budgets/*` - การติดตามและวิเคราะห์งบประมาณ
- 📈 **Reports**: `/api/v1/reports/*` - การวิเคราะห์ทางการเงิน
- 👥 **Users**: `/api/v1/users/*` - การจัดการผู้ใช้ (สำหรับผู้ดูแลระบบเท่านั้น)

### การทดสอบอย่างรวดเร็ว

```bash
# ตรวจสอบสถานะ
curl http://localhost:3000/health

# ผลลัพธ์: {"status":"healthy","timestamp":"..."}
```

## 📝 ตัวอย่าง API

### การยืนยันตัวตน

#### ลงทะเบียนผู้ใช้ใหม่

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "full_name": "John Doe"
  }'
```

#### เข้าสู่ระบบ

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### การจัดการหมวดหมู่

#### สร้างหมวดหมู่ใหม่

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Food & Dining",
    "description": "Restaurant and grocery expenses",
    "color": "#FF6B6B"
  }'
```

#### ดึงหมวดหมู่ทั้งหมด

```bash
curl -X GET http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### การจัดการธุรกรรม

#### สร้างธุรกรรมใหม่

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.50,
    "description": "Lunch at restaurant",
    "category_id": "category-uuid-here",
    "transaction_date": "2024-01-15",
    "type": "expense"
  }'
```

#### ดึงธุรกรรมทั้งหมด (พร้อม pagination)

```bash
curl -X GET "http://localhost:3000/api/v1/transactions?page=1&limit=10&type=expense" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### การจัดการงบประมาณ

#### สร้างงบประมาณ

```bash
curl -X POST http://localhost:3000/api/v1/budgets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": "category-uuid-here",
    "amount": 500.00,
    "period": "monthly",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }'
```

### รายงานและการวิเคราะห์

#### สรุปรายรับ-รายจ่าย

```bash
curl -X GET "http://localhost:3000/api/v1/reports/summary?period=monthly&year=2024&month=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### รายงานตามหมวดหมู่

```bash
curl -X GET "http://localhost:3000/api/v1/reports/by-category?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 การทดสอบ

### ชุดทดสอบที่ครบถ้วน

- **323 การทดสอบทั้งหมด** (174 Unit + 146 Integration + 3 Setup)
- **ครอบคลุม API 100%** - ทดสอบ endpoints ทั้งหมด
- **ไม่ต้องพึ่งฐานข้อมูล** - การทดสอบแบบ Mock
- **เร็วมาก** - ชุดทดสอบทั้งหมดรันใน ~149ms

```bash
# รันการทดสอบทั้งหมด
bun test

# รันแยกตามประเภท
bun test tests/unit/              # 174 unit tests
bun test tests/integration/       # 138 integration tests

# รันการทดสอบ service เฉพาะ
bun test tests/unit/auth.service.bun.test.ts        # 34 การทดสอบ
bun test tests/unit/transaction.service.bun.test.ts # 36 การทดสอบ

# ทดสอบด้วย timeout
bun test --timeout 15000
```

### คุณสมบัติการทดสอบ

- 🎭 **Mock HTTP Clients** - การจำลอง API แบบสมจริง
- 🌐 **คำอธิบายภาษาไทย** - Integration tests พร้อมภาษาไทย
- 📋 **การจัดระเบียบด้วย Emoji** - การทดสอบที่จัดกลุ่มตามฟังก์ชัน
- ⚡ **การดำเนินการที่รวดเร็ว** - ไม่มีการทำงานกับฐานข้อมูลจริง

## 🏗️ โครงสร้างโปรเจค

```
Budget-Buddy-Backend/
├── 📁 src/                          # รหัสต้นฉบับ
│   ├── 📄 index.ts                  # จุดเริ่มต้นแอปพลิเคชัน
│   ├── 📁 controllers/              # ตัวจัดการ HTTP request
│   │   ├── 📄 auth.controller.ts    # Authentication controller
│   │   ├── 📄 budget.controller.ts  # Budget controller
│   │   ├── 📄 category.controller.ts # Category controller
│   │   ├── 📄 reports.controller.ts # Reports controller
│   │   ├── 📄 transaction.controller.ts # Transaction controller
│   │   └── 📄 user.controller.ts    # User controller
│   ├── 📁 routes/                   # การกำหนด API routes
│   │   ├── 📄 auth.routes.ts        # Authentication routes
│   │   ├── 📄 budget.routes.ts      # Budget routes
│   │   ├── 📄 category.routes.ts    # Category routes
│   │   ├── 📄 health.routes.ts      # Health check routes
│   │   ├── 📄 reports.routes.ts     # Report routes
│   │   ├── 📄 transaction.routes.ts # Transaction routes
│   │   ├── 📄 user.routes.ts        # User management routes
│   │   └── 📄 index.ts              # Route aggregator
│   ├── 📁 services/                 # ชั้นตรรกะทางธุรกิจ
│   │   ├── 📄 auth.service.ts       # Authentication service
│   │   ├── 📄 budget.service.ts     # Budget service
│   │   ├── 📄 category.service.ts   # Category service
│   │   ├── 📄 transaction.service.ts # Transaction service
│   │   └── 📄 user.service.ts       # User service
│   ├── 📁 models/                   # TypeScript interfaces/models
│   │   ├── 📄 budget.model.ts       # Budget data models
│   │   ├── 📄 category.model.ts     # Category models
│   │   ├── 📄 transaction.model.ts  # Transaction models
│   │   └── 📄 user.model.ts         # User models
│   ├── 📁 middleware/               # Middleware กำหนดเอง
│   │   └── 📄 jwt.middleware.ts     # JWT authentication middleware
│   ├── 📁 schemas/                  # Validation schemas
│   │   ├── 📄 api.schema.ts         # API validation schemas
│   │   ├── 📄 auth.schema.ts        # Authentication schemas
│   │   └── 📄 user.schema.ts        # User validation schemas
│   ├── 📁 config/                   # ไฟล์การกำหนดค่า
│   │   └── 📄 supabase.ts           # การกำหนดค่า Supabase client
│   ├── � types/                    # นิยาม TypeScript types
│   │   └── 📄 elysia.types.ts       # Elysia framework types
│   └── 📁 utils/                    # ฟังก์ชันเครื่องมือ
│       └── 📄 logger.ts             # เครื่องมือ Logging
├── 📁 tests/                        # ไฟล์ทดสอบ
│   ├── 📄 README.md                # เอกสารการทดสอบ
│   ├── 📄 setup.test.ts            # การตั้งค่าทดสอบ
│   ├── 📄 package.json             # Dependencies เฉพาะการทดสอบ
│   ├── 📁 unit/                    # Unit tests (174 การทดสอบ)
│   │   ├── 📄 auth.service.bun.test.ts
│   │   ├── 📄 budget.service.bun.test.ts
│   │   ├── 📄 category.service.bun.test.ts
│   │   ├── 📄 transaction.service.bun.test.ts
│   │   └── 📄 user.service.bun.test.ts
│   ├── 📁 integration/              # Integration tests (138 การทดสอบ)
│   │   ├── 📄 auth.api.bun.test.ts
│   │   ├── 📄 budget.api.bun.test.ts
│   │   ├── 📄 category.api.bun.test.ts
│   │   ├── 📄 reports.api.bun.test.ts
│   │   ├── 📄 transaction.api.bun.test.ts
│   │   └── 📄 user.api.bun.test.ts
│   ├── 📁 mocks/                   # Mock implementations
│   │   ├── 📄 supabase.mock.ts     # Full Supabase mock
│   │   └── 📄 supabase-simple.mock.ts # Simple Supabase mock
│   └── 📁 utils/                   # เครื่องมือทดสอบ
│       └── 📄 test-utils.ts        # ฟังก์ชันช่วยการทดสอบ
├── 📁 docs/                         # เอกสาร
│   ├── 📄 api-documentation.md     # คู่มืออ้างอิง API ที่สมบูรณ์
│   ├── 📄 architecture.md          # คู่มือสถาปัตยกรรม
│   ├── 📄 deployment.md            # คู่มือการ deploy
│   ├── 📁 EN/                      # เอกสารภาษาอังกฤษ
│   └── 📁 TH/                      # เอกสารภาษาไทย
├── 📁 .husky/                      # การกำหนดค่า Git hooks
│   ├── 📄 commit-msg               # การตรวจสอบ commit message
│   ├── 📄 pre-commit               # Pre-commit hooks
│   └── 📄 bun-utils.sh             # Bun utility scripts
├── 📁 .vscode/                     # การตั้งค่า VS Code
│   └── 📄 settings.json            # การกำหนดค่า Editor
├── 📄 package.json                 # Dependencies และ scripts
├── 📄 bun.lockb                    # ไฟล์ lock ของ Bun
├── 📄 tsconfig.json                # การกำหนดค่า TypeScript
├── 📄 eslint.config.js             # การกำหนดค่า ESLint
├── 📄 .prettierrc                  # การกำหนดค่า Prettier
├── 📄 .prettierignore              # รูปแบบที่ Prettier ไม่สนใจ
├── 📄 .commitlintrc.js             # กฎ Commit lint
├── 📄 .gitignore                   # รูปแบบที่ Git ไม่สนใจ
├── 📄 .env.example                 # เทมเพลต Environment
├── 📄 test-runner.ts               # การกำหนดค่า Test runner
└── 📄 README.md                    # ภาพรวมโปรเจค
```

### ภาพรวมสถาปัตยกรรม

ระบบใช้ **Layered Architecture** แบ่งเป็น 4 ชั้น:

- **Controllers**: จัดการ HTTP requests/responses
- **Services**: ตรรกะทางธุรกิจ
- **Models**: โครงสร้างข้อมูล
- **Database**: การเก็บข้อมูล (Supabase PostgreSQL)

## 🔒 ความปลอดภัย

### การยืนยันตัวตนและการอนุญาต

- **JWT Authentication** - การยืนยันตัวตนแบบ stateless
- **Route Protection** - Middleware สำหรับป้องกัน route
- **Role-based Access** - การควบคุมการเข้าถึงตามบทบาท (คุณสมบัติผู้ดูแลระบบ)
- **Password Security** - การจัดการรหัสผ่านที่ปลอดภัย

### การป้องกันข้อมูล

- **Input Validation** - การตรวจสอบและทำความสะอาดข้อมูลนำเข้า
- **SQL Injection Prevention** - การป้องกันด้วย Supabase ORM
- **XSS Protection** - การป้องกัน Cross-Site Scripting
- **CORS Configuration** - การกำหนดค่า Cross-Origin Resource Sharing

### ความปลอดภัยของ Environment

- **Environment Variables** - การกำหนดค่าด้วยตัวแปร environment
- **Sensitive Data Isolation** - การแยกข้อมูลที่ละเอียดอ่อน
- **Production Settings** - การตั้งค่าสำหรับ production vs development
- **Database Security** - ความปลอดภัยการเชื่อมต่อฐานข้อมูล

## 🚀 การ Deploy

### การ Deploy ใน Production

#### ด้วย Docker

```bash
# สร้าง Docker image
docker build -t budget-buddy-api .

# รัน container
docker run -d \
  --name budget-buddy-api \
  -p 3000:3000 \
  --env-file .env.production \
  budget-buddy-api
```

#### ด้วย PM2

```bash
# ติดตั้ง PM2
npm install -g pm2

# เริ่มแอปพลิเคชัน
pm2 start bun --name "budget-buddy-api" -- run start

# บันทึกการกำหนดค่า PM2
pm2 save
pm2 startup
```

### Environment สำหรับ Production

```bash
NODE_ENV=production
PORT=3000
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
JWT_SECRET=your_secure_256_bit_secret
CORS_ORIGIN=https://yourdomain.com
```

### การติดตั้งใน Cloud Platforms

#### Vercel

```bash
# ติดตั้งบน Vercel
npm i -g vercel
vercel --prod
```

#### Railway

```bash
# เชื่อมต่อ GitHub repository กับ Railway
# ตั้งค่า environment variables ใน dashboard
# Deploy อัตโนมัติจาก main branch
```

## 🛠️ การพัฒนา

### สคริปต์ที่มีอยู่

```bash
# Development
bun run dev          # เริ่ม development server พร้อม hot reload
bun run build        # สร้าง production build
bun run start        # เริ่ม production server

# Testing
bun test             # รันการทดสอบทั้งหมด
bun run test:unit    # รัน unit tests เท่านั้น
bun run test:int     # รัน integration tests เท่านั้น
bun run test:watch   # รันการทดสอบใน watch mode

# Code Quality
bun run lint         # ตรวจสอบโค้ดด้วย ESLint
bun run lint:fix     # แก้ไขปัญหา linting อัตโนมัติ
bun run format       # จัดรูปแบบโค้ดด้วย Prettier
bun run typecheck    # ตรวจสอบ TypeScript types
```

### การตั้งค่า IDE

#### VS Code Extensions ที่แนะนำ

- **TypeScript Importer** - การจัดการ imports อัตโนมัติ
- **ESLint** - การตรวจสอบโค้ดแบบ real-time
- **Prettier** - การจัดรูปแบบโค้ดอัตโนมัติ
- **Thunder Client** - การทดสอบ API ใน VS Code
- **GitLens** - การจัดการ Git ขั้นสูง

#### การตั้งค่า Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "runtimeExecutable": "bun",
      "runtimeArgs": ["--inspect"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Git Workflow ที่แนะนำ

```bash
# 1. สร้าง feature branch
git checkout -b feature/new-feature

# 2. ทำการเปลี่ยนแปลงและ commit
git add .
git commit -m "feat: add new feature"

# 3. Push และสร้าง PR
git push origin feature/new-feature

# 4. หลัง PR ถูก merge
git checkout main
git pull origin main
git branch -d feature/new-feature
```

## 📊 ประสิทธิภาพ

### Benchmarks

- **Startup Time**: ~50ms ด้วย Bun runtime
- **Response Time**: เฉลี่ย <10ms สำหรับ API calls
- **Memory Usage**: ~30MB baseline memory footprint
- **Test Execution**: 323 tests ใน ~185ms

### การปรับปรุงประสิทธิภาพ

- **Bun Runtime** - JavaScript runtime ที่เร็วที่สุด
- **ElysiaJS Framework** - Overhead น้อยที่สุด
- **Efficient Queries** - การ optimize ฐานข้อมูล
- **Pagination** - การจัดการชุดข้อมูลขนาดใหญ่
- **Caching Strategy** - การ cache ที่เหมาะสม

### การตรวจสอบประสิทธิภาพ

```bash
# ทดสอบ Load
bun run test:load

# ตรวจสอบ Memory usage
bun run test:memory

# Profile performance
bun run profile
```

## 🔧 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

#### 1. การเชื่อมต่อฐานข้อมูลล้มเหลว

```bash
# ตรวจสอบ environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# ทดสอบการเชื่อมต่อ
curl -H "apikey: $SUPABASE_ANON_KEY" $SUPABASE_URL/rest/v1/
```

#### 2. JWT Token หมดอายุ

```bash
# ตรวจสอบ token expiration
# Default: 24 hours, กำหนดค่าได้ใน JWT_SECRET
```

#### 3. CORS Errors

```bash
# อัพเดต CORS_ORIGIN ใน .env
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

#### 4. การทดสอบล้มเหลว

```bash
# รันการทดสอบแยกเป็นรายบุคคล
bun test tests/unit/auth.service.bun.test.ts

# ตรวจสอบ mock implementations
bun test tests/mocks/
```

### การ Debug

#### เปิดใช้งาน Debug Logs

```bash
# ตั้งค่า log level
DEBUG=true bun run dev

# ดู detailed logs
LOG_LEVEL=debug bun run dev
```

#### การตรวจสอบ Database

```bash
# ตรวจสอบ Supabase connection
curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     "$SUPABASE_URL/rest/v1/users?select=*"
```

### การได้รับความช่วยเหลือ

- 📚 **Documentation**: [docs/](docs/)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Aisaraphorn18/Budget-Buddy-Backend/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Aisaraphorn18/Budget-Buddy-Backend/discussions)
- 📧 **Support**: support@budgetbuddy.com

### ความปลอดภัยของข้อมูล

- **การตรวจสอบข้อมูลนำเข้า** ทุก endpoints เพื่อป้องกันการโจมตี injection
- **การป้องกัน SQL injection** ผ่าน parameterized queries
- **การกำหนดค่า CORS** เพื่อควบคุม cross-origin requests
- **Rate limiting** เพื่อป้องกันการใช้งานในทางที่ผิด (กำหนดค่าได้)

### Security Headers

```typescript
// Security middleware จะใช้โดยอัตโนมัติ:
{
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}
```

### แนวปฏิบัติที่ดี

- ✅ ตัวแปร Environment สำหรับข้อมูลที่ละเอียดอ่อน
- ✅ กลไกการหมดอายุและการรีเฟรช token
- ✅ ข้อกำหนดรหัสผ่านที่ปลอดภัย
- ✅ การบังคับใช้ HTTPS ใน production
- ✅ การอัปเดต dependencies ด้านความปลอดภัยอย่างสม่ำเสมอ

## 🚀 การ Deploy

### Vercel (แนะนำ)

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Deploy ไป Vercel
vercel --prod

# ตั้งค่าตัวแปร environment
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add JWT_SECRET
```

### Railway

```bash
# ติดตั้ง Railway CLI
npm install -g @railway/cli

# เข้าสู่ระบบและ deploy
railway login
railway init
railway up
```

### Docker

```dockerfile
FROM oven/bun:1 as base

WORKDIR /app

# ติดตั้ง dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# คัดลอกรหัสต้นฉบับ
COPY . .

# เปิดพอร์ต
EXPOSE 3000

# เริ่มแอปพลิเคชัน
CMD ["bun", "run", "start"]
```

### การกำหนดค่าเฉพาะ Environment

#### Production

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your_secure_256_bit_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Staging

```bash
NODE_ENV=staging
PORT=3000
JWT_SECRET=staging_secret_key
CORS_ORIGIN=https://staging.your-domain.com
```

## 🛠️ การพัฒนา

### Scripts ที่มีให้ใช้

```bash
# การพัฒนา
bun run dev          # เริ่มเซิร์ฟเวอร์พัฒนาพร้อม hot reload
bun run start        # เริ่มเซิร์ฟเวอร์ production
bun run build        # สร้างสำหรับ production

# การทดสอบ
bun test             # รันการทดสอบทั้งหมด
bun test:unit        # รัน unit tests เท่านั้น
bun test:integration # รัน integration tests เท่านั้น
bun test:watch       # รันการทดสอบในโหมด watch
bun test:coverage    # รันการทดสอบพร้อมรายงาน coverage

# คุณภาพโค้ด
bun run lint         # รัน ESLint
bun run lint:fix     # แก้ไขปัญหา ESLint
bun run format       # จัดรูปแบบโค้ดด้วย Prettier
bun run type-check   # ตรวจสอบประเภท TypeScript

# ฐานข้อมูล
bun run db:migrate   # รัน database migrations
bun run db:seed      # เพาะข้อมูลตัวอย่างในฐานข้อมูล
bun run db:reset     # รีเซ็ตฐานข้อมูลกลับสู่สถานะเริ่มต้น
```

### ขั้นตอนการพัฒนา

1. **ตั้งค่า**: โคลน repository และติดตั้ง dependencies
2. **Environment**: คัดลอก `.env.example` เป็น `.env` และกำหนดค่า
3. **ฐานข้อมูล**: ตั้งค่าโปรเจค Supabase และรัน migrations
4. **การพัฒนา**: ใช้ `bun run dev` สำหรับการพัฒนาแบบ hot reload
5. **การทดสอบ**: เขียนและรันการทดสอบด้วย `bun test`
6. **คุณภาพโค้ด**: ใช้ `bun run lint` และ `bun run format`
7. **Commit**: ปฏิบัติตามรูปแบบ conventional commit

### Git Hooks

โปรเจคใช้ Husky สำหรับ Git hooks:

```bash
# Pre-commit: รัน linting และ formatting
# Pre-push: รันการทดสอบทั้งหมด
# Commit-msg: ตรวจสอบรูปแบบข้อความ commit
```

## 📊 ประสิทธิภาพ

### การวัดประสิทธิภาพ

- **เวลาเริ่มต้น**: ~50ms (การปรับปรุง Bun runtime)
- **ความหน่วงของ Request**: เวลาตอบสนองเฉลี่ย <10ms
- **Throughput**: 10,000+ requests/วินาที
- **การใช้หน่วยความจำ**: รอยหน่วยความจำพื้นฐาน <100MB

### คุณสมบัติการปรับปรุง

- **Bun Runtime**: การดำเนิน JavaScript/TypeScript ที่เร็วมาก
- **ElysiaJS Framework**: Overhead น้อยที่สุด, ประสิทธิภาพสูงสุด
- **Connection Pooling**: การจัดการการเชื่อมต่อฐานข้อมูลที่มีประสิทธิภาพ
- **Response Caching**: การแคชเชิงกลยุทธ์สำหรับ endpoints ที่อ่านมาก
- **Compression**: การบีบอัด Gzip/Brotli สำหรับการตอบสนอง API

### การตรวจสอบประสิทธิภาพ

```bash
# การทดสอบโหลดด้วย autocannon
bunx autocannon -c 100 -d 30 http://localhost:3000/health

# การ profiling หน่วยความจำ
bun --inspect src/index.ts

# endpoint เมตริกประสิทธิภาพ
curl http://localhost:3000/api/v1/metrics
```

## 🔧 การแก้ไขปัญหา

### ปัญหาทั่วไป

#### ปัญหาการเชื่อมต่อฐานข้อมูล

```bash
# ตรวจสอบการเชื่อมต่อ Supabase
curl -X GET 'https://your-project.supabase.co/rest/v1/' \
  -H "apikey: YOUR_ANON_KEY"

# ตรวจสอบตัวแปร environment
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

#### ปัญหา JWT Token

```bash
# ตรวจสอบ JWT secret เป็น 256-bit (32 ตัวอักษร)
echo $JWT_SECRET | wc -c  # ควรแสดง 33 (รวม newline)

# ทดสอบการสร้าง token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

#### ปัญหา CORS

```bash
# ตรวจสอบการกำหนดค่า CORS
curl -X OPTIONS http://localhost:3000/api/v1/auth/register \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

### โหมด Debug

```bash
# เปิดใช้งาน debug logging
DEBUG=budget-buddy:* bun run dev

# หมวดหมู่ debug เฉพาะ
DEBUG=budget-buddy:auth,budget-buddy:db bun run dev
```

### การตรวจสอบสุขภาพ

```bash
# สุขภาพแอปพลิเคชัน
curl http://localhost:3000/health

# สุขภาพฐานข้อมูล
curl http://localhost:3000/api/v1/health/db

# สุขภาพ dependencies
curl http://localhost:3000/api/v1/health/dependencies
```

## ✨ คุณสมบัติ

- 🔐 **ระบบยืนยันตัวตน JWT** - การยืนยันตัวตนและการอนุญาตที่ปลอดภัย
- 💰 **จัดการธุรกรรม** - การจัดการข้อมูลทางการเงินแบบครบวงจร
- 📊 **ติดตามงบประมาณ** - สร้างและตรวจสอบงบประมาณพร้อมวิเคราะห์การใช้จ่าย
- 📈 **รายงานการเงิน** - การวิเคราะห์และการรายงานที่ครอบคลุม
- 🏷️ **จัดการหมวดหมู่** - จัดระเบียบธุรกรรมด้วยหมวดหมู่ที่กำหนดเอง
- 👥 **จัดการผู้ใช้** - คุณสมบัติสำหรับผู้ดูแลระบบ
- 🧪 **การทดสอบครบถ้วน** - 315 การทดสอบครอบคลุม endpoint ทั้งหมด
- ⚡ **ประสิทธิภาพสูง** - สร้างด้วย Bun และ ElysiaJS เพื่อความเร็ว
- 🛡️ **ความปลอดภัยของ Type** - การใช้งาน TypeScript แบบเต็มรูปแบบ
- 🔒 **ความปลอดภัยเป็นหลัก** - การตรวจสอบอินพุต, CORS และแนวปฏิบัติที่ปลอดภัย

## 📚 เอกสาร

### เอกสารหลัก

- 📖 **[เอกสาร API](docs/api-documentation.md)** - คู่มืออ้างอิง API พร้อมตัวอย่าง
- 🏗️ **[คู่มือสถาปัตยกรรม](docs/architecture.md)** - โครงสร้างโปรเจคและรูปแบบการออกแบบ
- 🚀 **[คู่มือการ Deploy](docs/deployment.md)** - คำแนะนำการ deploy ใน production
- 🧪 **[คู่มือการทดสอบ](tests/README.md)** - เอกสารการทดสอบที่ครอบคลุม

### เอกสารแยกตามภาษา

- 🇺🇸 **[เอกสารภาษาอังกฤษ](docs/EN/README.md)** - เอกสาร API ภาษาอังกฤษฉบับสมบูรณ์
- 🇹🇭 **[เอกสารภาษาไทย](docs/TH/README.md)** - เอกสาร API ภาษาไทยฉบับสมบูรณ์
- 🧪 **[คู่มือการทดสอบ (EN)](docs/EN/testing.md)** - คู่มือการทดสอบแบบละเอียดภาษาอังกฤษ
- 🧪 **[คู่มือการทดสอบ (TH)](docs/TH/testing.md)** - คู่มือการทดสอบแบบละเอียดภาษาไทย

### เอกสารเฉพาะ Route (ภาษาอังกฤษ)

- 🔐 **[Auth Routes](docs/EN/routes/auth.md)** - Authentication และ authorization endpoints
- 💰 **[Transaction Routes](docs/EN/routes/transactions.md)** - Transaction management endpoints
- 📊 **[Budget Routes](docs/EN/routes/budgets.md)** - Budget tracking และ analysis endpoints
- 🏷️ **[Category Routes](docs/EN/routes/categories.md)** - Category management endpoints
- 📈 **[Report Routes](docs/EN/routes/reports.md)** - Financial analytics และ reporting endpoints
- 👥 **[User Routes](docs/EN/routes/users.md)** - User management endpoints (admin เท่านั้น)
- 🏥 **[Health Routes](docs/EN/routes/health.md)** - System health และ monitoring endpoints

### เอกสารเฉพาะ Route (ภาษาไทย)

- 🔐 **[Auth Routes](docs/TH/routes/auth.md)** - endpoints การยืนยันตัวตนและการอนุญาต
- 💰 **[Transaction Routes](docs/TH/routes/transactions.md)** - endpoints การจัดการธุรกรรม
- 📊 **[Budget Routes](docs/TH/routes/budgets.md)** - endpoints การติดตามและวิเคราะห์งบประมาณ
- 🏷️ **[Category Routes](docs/TH/routes/categories.md)** - endpoints การจัดการหมวดหมู่
- 📈 **[Report Routes](docs/TH/routes/reports.md)** - endpoints การวิเคราะห์และรายงานทางการเงิน
- 👥 **[User Routes](docs/TH/routes/users.md)** - endpoints การจัดการผู้ใช้ (สำหรับ admin เท่านั้น)
- 🏥 **[Health Routes](docs/TH/routes/health.md)** - endpoints สุขภาพระบบและการตรวจสอบ

### ลิงก์ด่วน

- **API Endpoints**: ดู [เอกสาร API](docs/api-documentation.md)
- **โครงสร้างโปรเจค**: ดู [คู่มือสถาปัตยกรรม](docs/architecture.md)
- **การ Deploy**: ดู [คู่มือการ Deploy](docs/deployment.md)
- **รายละเอียดการทดสอบ**: ดู [คู่มือการทดสอบ](tests/README.md)
- **เอกสารภาษาอังกฤษ**: ดู [เอกสาร EN](docs/EN/README.md)
- **เอกสารภาษาไทย**: ดู [เอกสาร TH](docs/TH/README.md)

## 🛠️ เทคโนโลยีที่ใช้

| หมวดหมู่           | เทคโนโลยี                                                             |
| ------------------ | --------------------------------------------------------------------- |
| **Runtime**        | [Bun](https://bun.sh/) - JavaScript runtime ที่เร็วมาก                |
| **Framework**      | [ElysiaJS](https://elysiajs.com/) - Web framework ที่ปลอดภัยด้วย type |
| **ภาษา**           | [TypeScript](https://www.typescriptlang.org/) - ความปลอดภัยของ type   |
| **ฐานข้อมูล**      | [Supabase](https://supabase.io/) - PostgreSQL พร้อม real-time         |
| **การทดสอบ**       | Bun built-in test framework                                           |
| **การยืนยันตัวตน** | JWT พร้อม middleware                                                  |

## 🤝 การมีส่วนร่วม

เรายินดีรับการมีส่วนร่วม! กรุณาดู [คู่มือการมีส่วนร่วม](CONTRIBUTING.md) สำหรับรายละเอียด

### ขั้นตอนการพัฒนา

```bash
# 1. Fork และ clone
git clone your-fork-url
cd Budget-Buddy-Backend

# 2. สร้าง feature branch
git checkout -b feature/ชื่อ-feature-ของคุณ

# 3. ทำการเปลี่ยนแปลงและทดสอบ
bun test

# 4. Commit และ push
git commit -m "feat: เพิ่ม feature ของคุณ"
git push origin feature/ชื่อ-feature-ของคุณ

# 5. สร้าง pull request
```

## 📄 ใบอนุญาต

โปรเจคนี้ได้รับใบอนุญาตภายใต้ MIT License - ดูรายละเอียดในไฟล์ [LICENSE](LICENSE)

## 📞 การสนับสนุน

- 🐛 **ปัญหา**: [GitHub Issues](https://github.com/Aisaraphorn18/Budget-Buddy-Backend/issues)
- 📧 **อีเมล**: support@budgetbuddy.com
- 💬 **การสนทนา**: [GitHub Discussions](https://github.com/Aisaraphorn18/Budget-Buddy-Backend/discussions)
