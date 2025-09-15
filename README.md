# Budget Buddy Backend API 💰

> 🚀 Modern Personal Finance Management RESTful API built with ElysiaJS, TypeScript, and Supabase

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![ElysiaJS](https://img.shields.io/badge/ElysiaJS-Latest-ff6b9d.svg)](https://elysiajs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.io/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-yellow.svg)](https://bun.sh/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📚 Table of Contents

### English Version
- [✨ Features](#-features)
- [🎯 Getting Started](#-getting-started)
  - [📋 Prerequisites](#-prerequisites)
  - [🛠️ Installation](#️-installation)
  - [🔧 Environment Configuration](#-environment-configuration)
  - [🗄️ Database Setup](#️-database-setup)
  - [🚀 Run Development Server](#-run-development-server)
- [🌐 API Endpoints](#-api-endpoints)
  - [🔓 Public Endpoints](#-public-endpoints-no-authentication-required)
  - [🔒 Protected Endpoints](#-protected-endpoints-jwt-authentication-required)
  - [🔑 Authentication](#-authentication)
  - [📖 Interactive API Documentation](#-interactive-api-documentation)
  - [🔍 Query Parameters](#-query-parameters)
  - [🧪 Testing the API](#-testing-the-api)
- [🏗️ Project Architecture](#️-project-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [🧪 Development & Testing](#-development--testing)
- [🛡️ Security Features](#️-security-features)
- [🚀 Deployment](#-deployment)
- [🚨 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📞 Support & Community](#-support--community)
- [📄 License](#-license)

### Thai Version (ไทย)
- [✨ คุณสมบัติ](#-คุณสมบัติ)
- [🎯 เริ่มต้นใช้งาน](#-เริ่มต้นใช้งาน)
  - [📋 ความต้องการเบื้องต้น](#-ความต้องการเบื้องต้น)
  - [🛠️ การติดตั้ง](#️-การติดตั้ง)
  - [🔧 การตั้งค่า Environment](#-การตั้งค่า-environment)
  - [🗄️ การตั้งค่าฐานข้อมูล](#️-การตั้งค่าฐานข้อมูล)
  - [🚀 เริ่มต้น Development Server](#-เริ่มต้น-development-server)
- [🌐 API Endpoints](#-api-endpoints-1)
- [🏗️ สถาปัตยกรรมโปรเจค](#️-สถาปัตยกรรมโปรเจค)
- [🛠️ เทคโนโลยีที่ใช้](#️-เทคโนโลยีที่ใช้)
- [🧪 การพัฒนาและทดสอบ](#-การพัฒนาและทดสอบ)
- [🛡️ คุณสมบัติด้านความปลอดภัย](#️-คุณสมบัติด้านความปลอดภัย)
- [🚀 การ Deploy](#-การ-deploy)
- [🚨 การแก้ไขปัญหา](#-การแก้ไขปัญหา)
- [🤝 การมีส่วนร่วม](#-การมีส่วนร่วม)
- [📞 การสนับสนุนและชุมชน](#-การสนับสนุนและชุมชน)
- [📄 ใบอนุญาต](#-ใบอนุญาต)

---

## ✨ Features

- 🔐 **JWT Authentication** - Secure authentication with Bearer tokens
- 💸 **Transaction Management** - Complete CRUD operations for financial records
- 📊 **Budget Tracking** - Set and monitor spending budgets by category
- 📈 **Analytics Dashboard** - Comprehensive financial insights and reporting
- 🏷️ **Category Management** - Organize transactions with custom categories
- 🔍 **Advanced Filtering** - Filter by date range, category, amount, and type
- 📄 **Pagination Support** - Efficient data loading with pagination
- 📖 **OpenAPI Documentation** - Interactive API documentation with Swagger
- 🚀 **High Performance** - Built with ElysiaJS for maximum speed
- 🛡️ **Type Safety** - Full TypeScript implementation with comprehensive commenting

## 🎯 Getting Started

### 📋 Prerequisites

- Node.js 18+ or Bun runtime (Bun recommended for better performance)
- PostgreSQL database (Supabase recommended)
- Git

### 🛠️ Installation

#### 📥 Clone Repository

```bash
git clone https://github.com/your-username/budget-buddy-backend.git
cd budget-buddy-backend
```

#### 📦 Install Dependencies

**Using Bun (Recommended):**
```bash
bun install
```

**Using npm:**
```bash
npm install
```

### 🔧 Environment Configuration

Create a `.env` file in the root directory:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# Supabase Database Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 🗄️ Database Setup

Run the following SQL script in your Supabase SQL editor to set up the database schema:

```sql
-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
    color VARCHAR(7), -- hex color code
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(category_id),
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE budgets (
    budget_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(category_id),
    amount DECIMAL(15,2) NOT NULL,
    period VARCHAR(20) CHECK (period IN ('monthly', 'weekly', 'yearly')) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, type, color, icon) VALUES
('Food & Dining', 'expense', '#FF6B6B', '🍔'),
('Transportation', 'expense', '#4ECDC4', '🚗'),
('Shopping', 'expense', '#45B7D1', '🛍️'),
('Entertainment', 'expense', '#96CEB4', '🎬'),
('Bills & Utilities', 'expense', '#FECA57', '💡'),
('Healthcare', 'expense', '#FF9FF3', '🏥'),
('Salary', 'income', '#54A0FF', '💼'),
('Freelance', 'income', '#5F27CD', '💻'),
('Investment', 'income', '#00D2D3', '📈'),
('Other Income', 'income', '#FF9F43', '💰');
```

### 🚀 Run Development Server

**Using Bun (Recommended):**
```bash
bun run dev
```

**Using npm:**
```bash
npm run dev
```

The server will start at `http://localhost:3000`

## 🌐 API Endpoints

### 📊 API Overview

The Budget Buddy API provides comprehensive endpoints for personal finance management:

#### 🔓 Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | User login |
| `POST` | `/api/v1/auth/logout` | User logout |
| `GET` | `/api/v1/auth/profile` | Get user profile |
| `GET` | `/api/v1/categories` | Get all categories |
| `GET` | `/api/v1/categories/:id` | Get category by ID |

#### 🔒 Protected Endpoints (JWT Authentication Required)

**💸 Transaction Management**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/protected/api/v1/transactions` | Create new transaction |
| `GET` | `/protected/api/v1/transactions` | Get transactions (with filtering) |
| `GET` | `/protected/api/v1/transactions/:id` | Get transaction by ID |
| `PATCH` | `/protected/api/v1/transactions/:id` | Update transaction |
| `DELETE` | `/protected/api/v1/transactions/:id` | Delete transaction |

**📊 Budget Management**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/protected/api/v1/budgets` | Create new budget |
| `GET` | `/protected/api/v1/budgets` | Get budgets (with filtering) |
| `GET` | `/protected/api/v1/budgets/:id` | Get budget by ID |
| `PATCH` | `/protected/api/v1/budgets/:id` | Update budget |
| `DELETE` | `/protected/api/v1/budgets/:id` | Delete budget |

**🏠 Home & Analytics**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/protected/api/v1/home` | Get dashboard data |
| `GET` | `/protected/api/v1/recent-transactions` | Get recent transactions |
| `GET` | `/protected/api/v1/analytics/summary` | Get financial summary |
| `GET` | `/protected/api/v1/analytics/by-category` | Get analytics by category |
| `GET` | `/protected/api/v1/analytics/flow` | Get cash flow analytics |

### 🔑 Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer your-jwt-token-here
```

#### 📝 Login Example

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

#### 🔐 Register Example

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### 📖 Interactive API Documentation

Access the interactive Swagger documentation at:
- **OpenAPI JSON**: `http://localhost:3000/openapi`
- **Interactive Docs**: Built-in browsable API interface with ElysiaJS

### 🔍 Query Parameters

#### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

#### Filtering (Transactions & Budgets)
- `category_id`: Filter by category UUID
- `type`: Filter by type ('income' or 'expense')
- `start_date`: Filter from date (YYYY-MM-DD)
- `end_date`: Filter to date (YYYY-MM-DD)
- `min_amount`: Minimum amount
- `max_amount`: Maximum amount

#### Example with Filters
```bash
GET /protected/api/v1/transactions?page=1&limit=20&type=expense&category_id=uuid&start_date=2024-01-01&end_date=2024-12-31
```

### 🧪 Testing the API

#### Health Check
```bash
curl http://localhost:3000/health
```

#### Create a Transaction
```bash
curl -X POST http://localhost:3000/protected/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_id": "category-uuid-here",
    "amount": 50.00,
    "type": "expense",
    "description": "Lunch at restaurant",
    "date": "2024-01-15"
  }'
```

#### Create a Budget
```bash
curl -X POST http://localhost:3000/protected/api/v1/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_id": "category-uuid-here",
    "amount": 1000.00,
    "period": "monthly",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }'
```

## 🏗️ Project Architecture

### 📁 Project Structure

```
Budget-Buddy-Backend/
├── src/
│   ├── controllers/           # 🎮 HTTP request handlers
│   │   ├── auth.controller.ts       # User authentication
│   │   ├── category.controller.ts   # Category management
│   │   ├── transaction.controller.ts # Transaction operations
│   │   ├── budget.controller.ts     # Budget management
│   │   └── home.controller.ts       # Dashboard analytics
│   ├── services/              # 🔧 Business logic layer
│   │   ├── auth.service.ts          # Authentication logic
│   │   ├── category.service.ts      # Category operations
│   │   ├── transaction.service.ts   # Transaction processing
│   │   └── budget.service.ts        # Budget calculations
│   ├── models/                # 📊 TypeScript interfaces
│   │   ├── user.model.ts           # User data types
│   │   ├── category.model.ts       # Category interfaces
│   │   ├── transaction.model.ts    # Transaction types
│   │   └── budget.model.ts         # Budget definitions
│   ├── routes/                # 🛣️ API route definitions
│   │   ├── auth.routes.ts          # Authentication routes
│   │   ├── category.routes.ts      # Category endpoints
│   │   ├── transaction.routes.ts   # Transaction routes
│   │   ├── budget.routes.ts        # Budget endpoints
│   │   ├── home.routes.ts          # Dashboard routes
│   │   ├── health.routes.ts        # Health check
│   │   └── index.ts               # Route aggregator
│   ├── middleware/            # 🛡️ Custom middleware
│   │   └── jwt.middleware.ts       # JWT validation
│   ├── schemas/               # ✅ Validation schemas
│   │   └── api.schema.ts          # Request/response schemas
│   ├── config/                # ⚙️ Configuration files
│   │   └── supabase.ts            # Database connection
│   └── index.ts               # 🚀 Application entry point
├── package.json
├── tsconfig.json
├── bun.lockb
└── README.md
```

### 🏛️ Architecture Patterns

- **Clean Architecture**: Separation of concerns with layers (Controllers → Services → Models)
- **Dependency Injection**: Services are injected into controllers for testability
- **Middleware Pattern**: Reusable authentication and error handling
- **Schema Validation**: Type-safe request/response validation with Zod
- **RESTful Design**: Standard HTTP methods and semantic URLs
- **Clean Code**: Comprehensive documentation and type safety

### 🔄 Request Flow

```
1. Client Request → 2. Middleware (CORS, JWT) → 3. Routes → 4. Controllers → 5. Services → 6. Database → 7. Response
```

## 🛠️ Technology Stack

### Core Technologies
- **Runtime**: Bun (recommended) or Node.js 18+
- **Framework**: ElysiaJS - High-performance TypeScript web framework
- **Language**: TypeScript 5.0+ with strict type checking
- **Database**: PostgreSQL via Supabase
- **Authentication**: JSON Web Tokens (JWT)

### Key Dependencies
- **@elysiajs/cors**: Cross-origin resource sharing
- **@elysiajs/jwt**: JWT authentication plugin
- **@supabase/supabase-js**: Supabase client library
- **bcryptjs**: Password hashing
- **zod**: Schema validation and type safety

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Nodemon**: Development server auto-restart

## 🧪 Development & Testing

### 🔧 Development Workflow

```bash
# Install dependencies
bun install

# Start development server with hot reload
bun run dev

# Run tests (when implemented)
bun test

# Build for production
bun run build

# Start production server
bun start
```

### 📊 Code Quality

```bash
# Type checking
tsc --noEmit

# Linting
eslint src/**/*.ts

# Formatting
prettier --write src/**/*.ts
```

### 🚨 Error Handling

The API implements comprehensive error handling:
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

### 📝 API Response Format

```typescript
// Success Response
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "details": {...}
}
```

## 🛡️ Security Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token generation
- **Password hashing** using bcrypt with salt rounds
- **Protected routes** requiring valid JWT tokens
- **Token expiration** for enhanced security

### 🛡️ Data Protection
- **Input validation** using Zod schemas
- **SQL injection prevention** through parameterized queries
- **CORS configuration** for cross-origin security
- **Environment variable protection** for sensitive data

### 🔒 Best Practices
- **Never store passwords in plain text**
- **Secure JWT secret management**
- **Database connection security** with SSL
- **Rate limiting** (recommended for production)

## 🚀 Deployment

### 📦 Build for Production

**Using Bun:**
```bash
bun run build
```

**Using npm:**
```bash
npm run build
```

### 🌐 Environment Variables for Production

```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
PORT=3000
```

### ☁️ Deploy to Cloud Platforms

#### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds

#### Railway Deployment
1. Connect repository to Railway
2. Add environment variables
3. Deploy with zero configuration

#### Render Deployment
1. Connect GitHub repository
2. Set environment variables
3. Configure build and start commands

### 🐳 Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]
```

Build and run:
```bash
docker build -t budget-buddy-backend .
docker run -p 3000:3000 budget-buddy-backend
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Connection Issues
```bash
# Check environment variables
cat .env

# Verify Supabase connection
curl -H "apikey: YOUR_ANON_KEY" https://your-project.supabase.co/rest/v1/
```

#### 2. JWT Token Issues
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check token format in requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3. Database Schema Issues
```bash
# Verify tables exist in Supabase
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

#### 4. Port Conflicts
```bash
# Check if port 3000 is in use
netstat -tulpn | grep :3000

# Use different port
PORT=3001 bun run dev
```

### 🔍 Debugging Tips

1. **Enable debug logs** by setting `NODE_ENV=development`
2. **Check database logs** in Supabase dashboard
3. **Use API testing tools** like Postman or Thunder Client
4. **Monitor network requests** in browser dev tools

## 🤝 Contributing

### 📋 Development Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** TypeScript and ESLint conventions
4. **Add** comprehensive comments to new code
5. **Test** your changes thoroughly
6. **Commit** with descriptive messages (`git commit -m 'Add amazing feature'`)
7. **Push** to your branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request

### 🎯 Code Standards

- **TypeScript**: Use strict typing and interfaces
- **Comments**: Add JSDoc comments for all functions
- **Naming**: Use descriptive variable and function names
- **Error Handling**: Implement proper error handling
- **Testing**: Write tests for new features (when test suite is available)

### 📚 Documentation

- Update README.md for new features
- Add inline code comments
- Document API changes in OpenAPI schema
- Include usage examples

## 📞 Support & Community

### 🆘 Getting Help

- 📧 **Email**: support@budgetbuddy.com
- 💬 **Issues**: [GitHub Issues](https://github.com/your-username/budget-buddy-backend/issues)
- 📖 **Documentation**: [API Docs](http://localhost:3000/openapi)
- 🌐 **Website**: [Budget Buddy](https://budgetbuddy.com)

### 🤝 Community

- ⭐ **Star** this repository if you find it helpful
- 🐛 **Report bugs** through GitHub Issues
- 💡 **Suggest features** via GitHub Discussions
- 🔀 **Contribute** by submitting Pull Requests

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## ไทย Version (Thai Version)

> 🚀 RESTful API สำหรับการจัดการการเงินส่วนบุคคลที่ทันสมัย สร้างด้วย ElysiaJS, TypeScript และ Supabase

### ✨ คุณสมบัติ

- 🔐 **JWT Authentication** - ระบบยืนยันตัวตนที่ปลอดภัยด้วย Bearer tokens
- 💸 **จัดการรายการเงิน** - การจัดการข้อมูลทางการเงินแบบครบวงจร (CRUD)
- 📊 **ติดตามงบประมาณ** - ตั้งและติดตามงบประมาณรายจ่ายตามหมวดหมู่
- 📈 **แดชบอร์ดวิเคราะห์** - รายงานและข้อมูลเชิงลึกทางการเงินที่ครอบคลุม
- 🏷️ **จัดการหมวดหมู่** - จัดระเบียบรายการเงินด้วยหมวดหมู่ที่กำหนดเอง
- 🔍 **การกรองขั้นสูง** - กรองตามวันที่ หมวดหมู่ จำนวนเงิน และประเภท
- 📄 **รองรับ Pagination** - โหลดข้อมูลอย่างมีประสิทธิภาพ
- 📖 **เอกสาร OpenAPI** - เอกสาร API แบบ Interactive ด้วย Swagger
- 🚀 **ประสิทธิภาพสูง** - สร้างด้วย ElysiaJS เพื่อความเร็วสูงสุด
- 🛡️ **Type Safety** - ใช้ TypeScript เต็มรูปแบบพร้อม Comments ครบถ้วน

### 🎯 เริ่มต้นใช้งาน

#### 📋 ความต้องการเบื้องต้น

- Node.js 18+ หรือ Bun runtime (แนะนำ Bun สำหรับประสิทธิภาพที่ดีกว่า)
- ฐานข้อมูล PostgreSQL (แนะนำ Supabase)
- Git

#### 🛠️ การติดตั้ง

##### 📥 Clone Repository

```bash
git clone https://github.com/your-username/budget-buddy-backend.git
cd budget-buddy-backend
```

##### 📦 ติดตั้ง Dependencies

**ใช้ Bun (แนะนำ):**
```bash
bun install
```

**ใช้ npm:**
```bash
npm install
```

#### 🔧 การตั้งค่า Environment

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# Supabase Database Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### �️ การตั้งค่าฐานข้อมูล

รันสคริปต์ SQL นี้ใน Supabase SQL editor เพื่อสร้างโครงสร้างฐานข้อมูล:

```sql
-- ตาราง Users
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง Categories
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
    color VARCHAR(7), -- รหัสสี hex
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง Transactions
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(category_id),
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง Budgets
CREATE TABLE budgets (
    budget_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(category_id),
    amount DECIMAL(15,2) NOT NULL,
    period VARCHAR(20) CHECK (period IN ('monthly', 'weekly', 'yearly')) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- เพิ่มหมวดหมู่เริ่มต้น
INSERT INTO categories (name, type, color, icon) VALUES
('อาหารและเครื่องดื่ม', 'expense', '#FF6B6B', '🍔'),
('การเดินทาง', 'expense', '#4ECDC4', '🚗'),
('ช้อปปิ้ง', 'expense', '#45B7D1', '🛍️'),
('ความบันเทิง', 'expense', '#96CEB4', '🎬'),
('ค่าบิลและสาธารณูปโภค', 'expense', '#FECA57', '💡'),
('สุขภาพ', 'expense', '#FF9FF3', '🏥'),
('เงินเดือน', 'income', '#54A0FF', '💼'),
('งานอิสระ', 'income', '#5F27CD', '💻'),
('การลงทุน', 'income', '#00D2D3', '📈'),
('รายได้อื่นๆ', 'income', '#FF9F43', '💰');
```

#### �🚀 เริ่มต้น Development Server

**ใช้ Bun (แนะนำ):**
```bash
bun run dev
```

**ใช้ npm:**
```bash
npm run dev
```

เซิร์ฟเวอร์จะเริ่มที่ `http://localhost:3000`

### 🌐 API Endpoints

#### 🔓 Public Endpoints (ไม่ต้องยืนยันตัวตน)

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `GET` | `/health` | ตรวจสอบสถานะเซิร์ฟเวอร์ |
| `POST` | `/api/v1/auth/register` | สมัครสมาชิกใหม่ |
| `POST` | `/api/v1/auth/login` | เข้าสู่ระบบ |
| `POST` | `/api/v1/auth/logout` | ออกจากระบบ |
| `GET` | `/api/v1/auth/profile` | ดูโปรไฟล์ผู้ใช้ |
| `GET` | `/api/v1/categories` | ดูหมวดหมู่ทั้งหมด |
| `GET` | `/api/v1/categories/:id` | ดูหมวดหมู่ตาม ID |

#### 🔒 Protected Endpoints (ต้องยืนยันตัวตนด้วย JWT)

**💸 จัดการรายการเงิน**

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `POST` | `/protected/api/v1/transactions` | สร้างรายการเงินใหม่ |
| `GET` | `/protected/api/v1/transactions` | ดูรายการเงิน (มีการกรอง) |
| `GET` | `/protected/api/v1/transactions/:id` | ดูรายการเงินตาม ID |
| `PATCH` | `/protected/api/v1/transactions/:id` | แก้ไขรายการเงิน |
| `DELETE` | `/protected/api/v1/transactions/:id` | ลบรายการเงิน |

**📊 จัดการงบประมาณ**

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `POST` | `/protected/api/v1/budgets` | สร้างงบประมาณใหม่ |
| `GET` | `/protected/api/v1/budgets` | ดูงบประมาณ (มีการกรอง) |
| `GET` | `/protected/api/v1/budgets/:id` | ดูงบประมาณตาม ID |
| `PATCH` | `/protected/api/v1/budgets/:id` | แก้ไขงบประมาณ |
| `DELETE` | `/protected/api/v1/budgets/:id` | ลบงบประมาณ |

**🏠 หน้าหลักและการวิเคราะห์**

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `GET` | `/protected/api/v1/home` | ข้อมูลแดชบอร์ด |
| `GET` | `/protected/api/v1/recent-transactions` | รายการเงินล่าสุด |
| `GET` | `/protected/api/v1/analytics/summary` | สรุปการเงิน |
| `GET` | `/protected/api/v1/analytics/by-category` | วิเคราะห์ตามหมวดหมู่ |
| `GET` | `/protected/api/v1/analytics/flow` | วิเคราะห์กระแสเงินสด |

#### 🔑 การยืนยันตัวตน

API ใช้ JWT (JSON Web Token) สำหรับการยืนยันตัวตน ใส่ token ใน Authorization header:

```bash
Authorization: Bearer your-jwt-token-here
```

##### 📝 ตัวอย่างการเข้าสู่ระบบ

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

##### 🔐 ตัวอย่างการสมัครสมาชิก

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

#### 📖 เอกสาร API แบบ Interactive

เข้าถึงเอกสาร Swagger ได้ที่:
- **OpenAPI JSON**: `http://localhost:3000/openapi`
- **Interactive Docs**: อินเทอร์เฟซแบบ browsable ที่มาพร้อมกับ ElysiaJS

#### 🔍 Query Parameters

##### Pagination
- `page`: หมายเลขหน้า (ค่าเริ่มต้น: 1)
- `limit`: จำนวนรายการต่อหน้า (ค่าเริ่มต้น: 10, สูงสุด: 100)

##### การกรอง (Transactions & Budgets)
- `category_id`: กรองตาม UUID ของหมวดหมู่
- `type`: กรองตามประเภท ('income' หรือ 'expense')
- `start_date`: กรองจากวันที่ (YYYY-MM-DD)
- `end_date`: กรองถึงวันที่ (YYYY-MM-DD)
- `min_amount`: จำนวนเงินต่ำสุด
- `max_amount`: จำนวนเงินสูงสุด

##### ตัวอย่างการใช้ Filter
```bash
GET /protected/api/v1/transactions?page=1&limit=20&type=expense&category_id=uuid&start_date=2024-01-01&end_date=2024-12-31
```

#### 🧪 ทดสอบ API

##### Health Check
```bash
curl http://localhost:3000/health
```

##### สร้างรายการเงิน
```bash
curl -X POST http://localhost:3000/protected/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_id": "category-uuid-here",
    "amount": 50.00,
    "type": "expense",
    "description": "กินข้าวที่ร้านอาหาร",
    "date": "2024-01-15"
  }'
```

##### สร้างงบประมาณ
```bash
curl -X POST http://localhost:3000/protected/api/v1/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_id": "category-uuid-here",
    "amount": 1000.00,
    "period": "monthly",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }'
```

### �️ สถาปัตยกรรมโปรเจค

#### 📁 โครงสร้างโปรเจค

```
Budget-Buddy-Backend/
├── src/
│   ├── controllers/           # 🎮 ตัวจัดการ HTTP requests
│   │   ├── auth.controller.ts       # การยืนยันตัวตนผู้ใช้
│   │   ├── category.controller.ts   # จัดการหมวดหมู่
│   │   ├── transaction.controller.ts # การดำเนินการรายการเงิน
│   │   ├── budget.controller.ts     # จัดการงบประมาณ
│   │   └── home.controller.ts       # การวิเคราะห์แดชบอร์ด
│   ├── services/              # 🔧 ชั้น Business logic
│   │   ├── auth.service.ts          # ตรรกะการยืนยันตัวตน
│   │   ├── category.service.ts      # การดำเนินการหมวดหมู่
│   │   ├── transaction.service.ts   # การประมวลผลรายการเงิน
│   │   └── budget.service.ts        # การคำนวณงบประมาณ
│   ├── models/                # 📊 TypeScript interfaces
│   │   ├── user.model.ts           # ประเภทข้อมูลผู้ใช้
│   │   ├── category.model.ts       # อินเทอร์เฟซหมวดหมู่
│   │   ├── transaction.model.ts    # ประเภทรายการเงิน
│   │   └── budget.model.ts         # คำจำกัดความงบประมาณ
│   ├── routes/                # 🛣️ คำจำกัดความ API routes
│   │   ├── auth.routes.ts          # เส้นทางการยืนยันตัวตน
│   │   ├── category.routes.ts      # endpoints หมวดหมู่
│   │   ├── transaction.routes.ts   # เส้นทางรายการเงิน
│   │   ├── budget.routes.ts        # endpoints งบประมาณ
│   │   ├── home.routes.ts          # เส้นทางแดชบอร์ด
│   │   ├── health.routes.ts        # ตรวจสอบสถานะ
│   │   └── index.ts               # รวม Routes
│   ├── middleware/            # 🛡️ Custom middleware
│   │   └── jwt.middleware.ts       # การตรวจสอบ JWT
│   ├── schemas/               # ✅ Validation schemas
│   │   └── api.schema.ts          # schemas คำขอ/การตอบสนอง
│   ├── config/                # ⚙️ ไฟล์การกำหนดค่า
│   │   └── supabase.ts            # การเชื่อมต่อฐานข้อมูล
│   └── index.ts               # 🚀 จุดเริ่มต้นแอปพลิเคชัน
├── package.json
├── tsconfig.json
├── bun.lockb
└── README.md
```

#### 🏛️ รูปแบบสถาปัตยกรรม

- **Clean Architecture**: แยกความกังวลด้วยชั้น (Controllers → Services → Models)
- **Dependency Injection**: Services ถูกฉีดเข้าไปใน controllers เพื่อการทดสอบ
- **Middleware Pattern**: การยืนยันตัวตนและการจัดการข้อผิดพลาดที่ใช้ซ้ำได้
- **Schema Validation**: การตรวจสอบคำขอ/การตอบสนองที่ปลอดภัยด้วย Zod
- **RESTful Design**: วิธี HTTP มาตรฐานและ URLs ที่มีความหมาย
- **Clean Code**: เอกสารครบถ้วนและความปลอดภัยของประเภท

#### 🔄 Request Flow

```
1. Client Request → 2. Middleware (CORS, JWT) → 3. Routes → 4. Controllers → 5. Services → 6. Database → 7. Response
```

### 🛠️ เทคโนโลยีที่ใช้

#### เทคโนโลยีหลัก
- **Runtime**: Bun (แนะนำ) หรือ Node.js 18+
- **Framework**: ElysiaJS - เว็บเฟรมเวิร์ก TypeScript ประสิทธิภาพสูง
- **Language**: TypeScript 5.0+ พร้อมการตรวจสอบประเภทที่เข้มงวด
- **Database**: PostgreSQL ผ่าน Supabase
- **Authentication**: JSON Web Tokens (JWT)

#### Dependencies สำคัญ
- **@elysiajs/cors**: การแบ่งปันทรัพยากรข้ามต้นทาง
- **@elysiajs/jwt**: ปลั๊กอิน JWT authentication
- **@supabase/supabase-js**: ไลบรารีไคลเอนต์ Supabase
- **bcryptjs**: การแฮชรหัสผ่าน
- **zod**: การตรวจสอบ schema และความปลอดภัยของประเภท

#### เครื่องมือพัฒนา
- **TypeScript**: การตรวจสอบประเภทแบบ static
- **ESLint**: Code linting
- **Prettier**: การจัดรูปแบบโค้ด
- **Nodemon**: การรีสตาร์ทเซิร์ฟเวอร์พัฒนาอัตโนมัติ

### 🧪 การพัฒนาและทดสอบ

#### 🔧 เวิร์กโฟลว์การพัฒนา

```bash
# ติดตั้ง dependencies
bun install

# เริ่มเซิร์ฟเวอร์พัฒนาพร้อม hot reload
bun run dev

# รันการทดสอบ (เมื่อ implemented)
bun test

# สร้างสำหรับ production
bun run build

# เริ่มเซิร์ฟเวอร์ production
bun start
```

#### 📊 คุณภาพโค้ด

```bash
# การตรวจสอบประเภท
tsc --noEmit

# Linting
eslint src/**/*.ts

# การจัดรูปแบบ
prettier --write src/**/*.ts
```

#### 🚨 การจัดการข้อผิดพลาด

API ใช้การจัดการข้อผิดพลาดที่ครอบคลุม:
- **400 Bad Request**: ข้อมูลอินพุตไม่ถูกต้อง
- **401 Unauthorized**: ขาด JWT token หรือไม่ถูกต้อง
- **403 Forbidden**: สิทธิ์ไม่เพียงพอ
- **404 Not Found**: ไม่พบทรัพยากร
- **500 Internal Server Error**: ข้อผิดพลาดฝั่งเซิร์ฟเวอร์

#### 📝 รูปแบบการตอบสนอง API

```typescript
// การตอบสนองที่สำเร็จ
{
  "success": true,
  "data": {...},
  "message": "ดำเนินการเสร็จสิ้นเรียบร้อย"
}

// การตอบสนองข้อผิดพลาด
{
  "success": false,
  "error": "ข้อความแสดงข้อผิดพลาด",
  "details": {...}
}
```

### 🛡️ คุณสมบัติด้านความปลอดภัย

#### 🔐 การยืนยันตัวตนและการอนุญาต
- **การยืนยันตัวตนตาม JWT** พร้อมการสร้างโทเค็นที่ปลอดภัย
- **การแฮชรหัสผ่าน** โดยใช้ bcrypt พร้อม salt rounds
- **เส้นทางที่ได้รับการป้องกัน** ต้องใช้ JWT tokens ที่ถูกต้อง
- **การหมดอายุของโทเค็น** เพื่อความปลอดภัยที่เพิ่มขึ้น

#### 🛡️ การป้องกันข้อมูล
- **การตรวจสอบอินพุต** โดยใช้ Zod schemas
- **การป้องกัน SQL injection** ผ่านพารามิเตอร์ query
- **การกำหนดค่า CORS** สำหรับความปลอดภัยข้ามต้นทาง
- **การป้องกันตัวแปรสภาพแวดล้อม** สำหรับข้อมูลที่ละเอียดอ่อน

#### 🔒 แนวปฏิบัติที่ดีที่สุด
- **ไม่เก็บรหัสผ่านในรูปแบบข้อความธรรมดา**
- **การจัดการ JWT secret ที่ปลอดภัย**
- **ความปลอดภัยการเชื่อมต่อฐานข้อมูล** ด้วย SSL
- **Rate limiting** (แนะนำสำหรับ production)

### 🚀 การ Deploy

#### 📦 สร้างสำหรับ Production

**ใช้ Bun:**
```bash
bun run build
```

**ใช้ npm:**
```bash
npm run build
```

#### 🌐 ตัวแปรสภาพแวดล้อมสำหรับ Production

```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
PORT=3000
```

#### ☁️ Deploy ไป Cloud Platforms

##### การ Deploy ด้วย Vercel
1. เชื่อมต่อ GitHub repository ของคุณกับ Vercel
2. ตั้งค่าตัวแปรสภาพแวดล้อมใน Vercel dashboard
3. Deploy ด้วยการสร้างอัตโนมัติ

##### การ Deploy ด้วย Railway
1. เชื่อมต่อ repository กับ Railway
2. เพิ่มตัวแปรสภาพแวดล้อม
3. Deploy ด้วยการกำหนดค่าศูนย์

##### การ Deploy ด้วย Render
1. เชื่อมต่อ GitHub repository
2. ตั้งค่าตัวแปรสภาพแวดล้อม
3. กำหนดค่าคำสั่ง build และ start

#### 🐳 การ Deploy ด้วย Docker

สร้าง `Dockerfile`:
```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]
```

Build และ run:
```bash
docker build -t budget-buddy-backend .
docker run -p 3000:3000 budget-buddy-backend
```

### 🚨 การแก้ไขปัญหา

#### ปัญหาที่พบบ่อย

##### 1. ปัญหาการเชื่อมต่อ
```bash
# ตรวจสอบตัวแปรสภาพแวดล้อม
cat .env

# ตรวจสอบการเชื่อมต่อ Supabase
curl -H "apikey: YOUR_ANON_KEY" https://your-project.supabase.co/rest/v1/
```

##### 2. ปัญหา JWT Token
```bash
# ตรวจสอบว่าตั้งค่า JWT secret แล้ว
echo $JWT_SECRET

# ตรวจสอบรูปแบบ token ในคำขอ
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

##### 3. ปัญหา Database Schema
```bash
# ตรวจสอบว่าตารางมีอยู่ใน Supabase
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

##### 4. ความขุ่นแปลงของ Port
```bash
# ตรวจสอบว่า port 3000 ถูกใช้งานหรือไม่
netstat -tulpn | grep :3000

# ใช้ port อื่น
PORT=3001 bun run dev
```

#### 🔍 เคล็ดลับการดีบัก

1. **เปิดใช้งาน debug logs** โดยการตั้งค่า `NODE_ENV=development`
2. **ตรวจสอบ database logs** ใน Supabase dashboard
3. **ใช้เครื่องมือทดสอบ API** เช่น Postman หรือ Thunder Client
4. **ติดตาม network requests** ใน browser dev tools

### 🤝 การมีส่วนร่วม

#### 📋 แนวทางการพัฒนา

1. **Fork** repository
2. **สร้าง** feature branch (`git checkout -b feature/amazing-feature`)
3. **ปฏิบัติตาม** ข้อตกลง TypeScript และ ESLint
4. **เพิ่ม** comments ที่ครอบคลุมสำหรับโค้ดใหม่
5. **ทดสอบ** การเปลี่ยนแปลงของคุณอย่างละเอียด
6. **Commit** ด้วยข้อความที่สื่อความหมาย (`git commit -m 'Add amazing feature'`)
7. **Push** ไปยัง branch ของคุณ (`git push origin feature/amazing-feature`)
8. **เปิด** Pull Request

#### 🎯 มาตรฐานโค้ด

- **TypeScript**: ใช้การพิมพ์ที่เข้มงวดและ interfaces
- **Comments**: เพิ่ม JSDoc comments สำหรับฟังก์ชันทั้งหมด
- **Naming**: ใช้ชื่อตัวแปรและฟังก์ชันที่สื่อความหมาย
- **Error Handling**: ใช้การจัดการข้อผิดพลาดที่เหมาะสม
- **Testing**: เขียนการทดสอบสำหรับคุณสมบัติใหม่ (เมื่อมี test suite)

#### 📚 เอกสาร

- อัปเดต README.md สำหรับคุณสมบัติใหม่
- เพิ่ม inline code comments
- จัดทำเอกสารการเปลี่ยนแปลง API ใน OpenAPI schema
- รวมตัวอย่างการใช้งาน

### 📞 การสนับสนุนและชุมชน

#### 🆘 การได้รับความช่วยเหลือ

- 📧 **Email**: support@budgetbuddy.com
- 💬 **Issues**: [GitHub Issues](https://github.com/your-username/budget-buddy-backend/issues)
- 📖 **เอกสาร**: [API Docs](http://localhost:3000/openapi)
- 🌐 **เว็บไซต์**: [Budget Buddy](https://budgetbuddy.com)

#### 🤝 ชุมชน

- ⭐ **Star** repository นี้หากคุณพบว่ามีประโยชน์
- 🐛 **รายงานบัก** ผ่าน GitHub Issues
- 💡 **แนะนำคุณสมบัติ** ผ่าน GitHub Discussions
- 🔀 **มีส่วนร่วม** โดยการส่ง Pull Requests

### 📄 ใบอนุญาต

โปรเจคนี้ได้รับอนุญาตภายใต้ **MIT License** - ดูไฟล์ [LICENSE](LICENSE) สำหรับรายละเอียด

#### สรุป MIT License
- ✅ การใช้เชิงพาณิชย์
- ✅ การดัดแปลง
- ✅ การกระจาย
- ✅ การใช้ส่วนตัว
- ❌ ความรับผิดชอบ
- ❌ การรับประกัน

---

<div align="center">

### 🌟 ขอบคุณที่ใช้ Budget Buddy Backend API! 🌟

สร้างด้วย ❤️ โดยทีม Budget Buddy

**[⭐ Star repo นี้](https://github.com/your-username/budget-buddy-backend)** • **[🐛 รายงานบัก](https://github.com/your-username/budget-buddy-backend/issues)** • **[💡 ขอคุณสมบัติ](https://github.com/your-username/budget-buddy-backend/issues)**

</div>