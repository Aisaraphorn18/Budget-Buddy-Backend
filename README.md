# � Budget Buddy Backend API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![ElysiaJS](https://img.shields.io/badge/ElysiaJS-1.1-green.svg)](https://elysiajs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-orange.svg)](https://supabase.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-red.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Language / ภาษา

| Language | Link |
|----------|------|
| 🇺🇸 English | [Read in English](#english-version) |
| 🇹🇭 ไทย | [อ่านภาษาไทย](#thai-version) |

---

## English Version

> � A modern personal finance management RESTful API built with ElysiaJS, TypeScript, and Supabase

### ✨ Features

- � **JWT Authentication** - Secure user authentication with Bearer tokens
- 💸 **Transaction Management** - Complete CRUD operations for financial transactions
- 📊 **Budget Tracking** - Set and monitor spending budgets by categories
- 📈 **Analytics Dashboard** - Comprehensive financial insights and summaries
- 🏷️ **Category Management** - Organize transactions with custom categories
- 🔍 **Advanced Filtering** - Filter by date, category, amount, and type
- 📄 **Pagination Support** - Efficient data loading with pagination
- 📖 **OpenAPI Documentation** - Interactive API documentation with Swagger
- 🚀 **High Performance** - Built with ElysiaJS for optimal speed
- 🛡️ **Type Safety** - Full TypeScript implementation

### 🎯 Getting Started

#### 📋 Prerequisites

- Node.js 18+ or Bun runtime
- PostgreSQL database (Supabase recommended)
- Git

#### 🛠️ Installation

##### 📥 Clone Repository

```bash
git clone https://github.com/your-username/budget-buddy-backend.git
cd budget-buddy-backend
```

##### 📦 Install Dependencies

**Using Bun (Recommended):**
```bash
bun install
```

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
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

#### Supabase Database Schema

The API requires the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
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

**Using Bun:**
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

**� Transaction Management**

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

#### Login Example

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

### 📖 Interactive API Documentation

Access the interactive Swagger documentation at:
- **OpenAPI JSON**: `http://localhost:3000/openapi`
- **Interactive Docs**: Visit any endpoint in your browser for the browsable API

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

## 🏗️ Project Architecture

### 📁 Project Structure

```
Budget-Buddy-Backend/
├── src/
│   ├── controllers/           # HTTP request handlers
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── transaction.controller.ts
│   │   ├── budget.controller.ts
│   │   └── home.controller.ts
│   ├── services/             # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── transaction.service.ts
│   │   └── budget.service.ts
│   ├── models/               # TypeScript interfaces
│   │   ├── user.model.ts
│   │   ├── category.model.ts
│   │   ├── transaction.model.ts
│   │   └── budget.model.ts
│   ├── routes/               # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── category.routes.ts
│   │   ├── transaction.routes.ts
│   │   ├── budget.routes.ts
│   │   ├── home.routes.ts
│   │   ├── health.routes.ts
│   │   └── index.ts
│   ├── middleware/           # Custom middleware
│   │   └── jwt.middleware.ts
│   ├── schemas/              # Validation schemas
│   │   └── api.schema.ts
│   ├── config/               # Configuration files
│   │   └── supabase.ts
│   └── index.ts              # Application entry point
├── package.json
├── tsconfig.json
├── bun.lockb
└── README.md
```

### 🏛️ Architecture Patterns

- **Clean Architecture**: Separation of concerns with layers (Controllers → Services → Models)
- **Dependency Injection**: Services are injected into controllers
- **Middleware Pattern**: JWT authentication and error handling
- **Schema Validation**: Request/response validation with TypeScript schemas
- **RESTful API Design**: Standard HTTP methods and status codes

## 🧪 Testing

### API Testing with curl

#### Register a new user
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

#### Create a transaction
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

## 🚀 Deployment

### 📦 Build for Production

```bash
bun run build
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

### ☁️ Deploy to Vercel/Railway/Render

1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- � Email: your-email@example.com
- 💬 Issues: [GitHub Issues](https://github.com/your-username/budget-buddy-backend/issues)
- 📖 Documentation: [API Docs](http://localhost:3000/openapi)

---

## Thai Version

> 🚀 RESTful API สำหรับการจัดการการเงินส่วนบุคคลที่ทันสมัย สร้างด้วย ElysiaJS, TypeScript และ Supabase

### ✨ คุณสมบัติ

- 🔐 **JWT Authentication** - ระบบยืนยันตัวตนที่ปลอดภัยด้วย Bearer tokens
- 💸 **จัดการรายการเงิน** - การจัดการข้อมูลทางการเงินแบบครบวงจร
- 📊 **ติดตามงบประมาณ** - ตั้งและติดตามงบประมาณรายจ่ายตามหมวดหมู่
- 📈 **แดชบอร์ดวิเคราะห์** - รายงานและข้อมูลเชิงลึกทางการเงินที่ครอบคลุม
- 🏷️ **จัดการหมวดหมู่** - จัดระเบียบรายการเงินด้วยหมวดหมู่ที่กำหนดเอง
- 🔍 **การกรองขั้นสูง** - กรองตามวันที่ หมวดหมู่ จำนวนเงิน และประเภท
- � **รองรับ Pagination** - โหลดข้อมูลอย่างมีประสิทธิภาพ
- 📖 **เอกสาร OpenAPI** - เอกสาร API แบบ Interactive ด้วย Swagger
- 🚀 **ประสิทธิภาพสูง** - สร้างด้วย ElysiaJS เพื่อความเร็วสูงสุด
- 🛡️ **Type Safety** - ใช้ TypeScript เต็มรูปแบบ

### 🎯 เริ่มต้นใช้งาน

#### 📋 ความต้องการเบื้องต้น

- Node.js 18+ หรือ Bun runtime
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

### 🔧 การตั้งค่า Environment

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

### � เริ่มต้น Development Server

**ใช้ Bun:**
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

#### � Protected Endpoints (ต้องยืนยันตัวตนด้วย JWT)

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

### 🔑 การยืนยันตัวตน

API ใช้ JWT (JSON Web Token) สำหรับการยืนยันตัวตน ใส่ token ใน Authorization header:

```bash
Authorization: Bearer your-jwt-token-here
```

### 📖 เอกสาร API แบบ Interactive

เข้าถึงเอกสาร Swagger ได้ที่:
- **OpenAPI JSON**: `http://localhost:3000/openapi`

### 🏛️ สถาปัตยกรรมโปรเจค

โปรเจคใช้ **Clean Architecture** แบ่งแยกความรับผิดชอบเป็นชั้นๆ:
- **Controllers**: จัดการ HTTP requests/responses
- **Services**: Business logic และการเชื่อมต่อฐานข้อมูล
- **Models**: TypeScript interfaces สำหรับข้อมูล
- **Routes**: กำหนด API endpoints
- **Middleware**: JWT authentication และ error handling

### 📞 การสนับสนุน

- 📧 Email: your-email@example.com
- 💬 Issues: [GitHub Issues](https://github.com/your-username/budget-buddy-backend/issues)
- 📖 เอกสาร: [API Docs](http://localhost:3000/openapi)

---

<p align="center">Made with ❤️ by Budget Buddy Team</p>

2. **ทดสอบ GET API**
   - ไปที่ endpoint ที่ต้องการ
   - ข้อมูลจะแสดงอัตโนมัติ

3. **ทดสอบ POST API** (สร้างข้อมูลใหม่)
   - ไปที่ `http://127.0.0.1:8000/api/accounts/CreateUser/`
   - เลื่อนลงไปด้านล่างจะเจอฟอร์ม
   - กรอกข้อมูล:
     - **Username**: ชื่อผู้ใช้
     - **Password**: รหัสผ่าน
     - **Password confirm**: ยืนยันรหัสผ่าน
     - **First name**: ชื่อจริง (ไม่บังคับ)
     - **Last name**: นามสกุล (ไม่บังคับ)
   - คลิก **POST** เพื่อส่งข้อมูล

4. **เปลี่ยนรูปแบบการแสดงผล**
   - คลิก dropdown ที่มุมขวาบน
   - เลือก: `application/json`, `text/html`, หรือ `Raw data`

#### 🔗 Quick Links

| Description | URL |
|-------------|-----|
| **API Root** | `http://127.0.0.1:8000/api/` |
| **All Users** | `http://127.0.0.1:8000/api/accounts/AllUser/` |
| **Create User** | `http://127.0.0.1:8000/api/accounts/CreateUser/` |
| **All Categories** | `http://127.0.0.1:8000/api/finance/AllCategory/` |
| **All Transactions** | `http://127.0.0.1:8000/api/finance/AllTransaction/` |
| **All Budgets** | `http://127.0.0.1:8000/api/finance/AllBudget/` |

#### 🎯 การดู API Endpoints ทั้งหมด

**วิธีที่ 1: ผ่าน API Root**
```
http://127.0.0.1:8000/api/
```
จะแสดงลิงก์ไปยัง API groups ต่างๆ

**วิธีที่ 2: ดูจาก URL Patterns**
```bash
# ดู URL patterns ของแต่ละ app
python manage.py show_urls | grep api
```

**วิธีที่ 3: ดูจากไฟล์ urls.py**
- `BudgetBuddy/urls.py` - Main URLs
- `accounts/urls.py` - User management APIs  
- `finance/urls.py` - Finance APIs

#### 📚 Additional Documentation

- 📖 [Detailed Django REST Framework Browsable API Guide](./DRF_BROWSABLE_API_GUIDE.md)
- 📸 [Screenshot Examples](./docs/)

### 📝 Example API Calls

```bash
# Get all users
curl http://127.0.0.1:8000/api/accounts/AllUser/

# Get all categories
curl http://127.0.0.1:8000/api/finance/AllCategory/

# Get all transactions
curl http://127.0.0.1:8000/api/finance/AllTransaction/

# Get all budgets
curl http://127.0.0.1:8000/api/finance/AllBudget/
```

## 🏗️ Project Structure

```
BudgetBuddy/
├── 📁 accounts/           # User management app
│   ├── models.py         # User model
│   ├── serializers.py    # User serializers
│   ├── views.py          # User API views
│   └── urls.py           # User URL patterns
├── 📁 finance/           # Finance management app
│   ├── models.py         # Finance models
│   ├── serializers.py    # Finance serializers
│   ├── views.py          # Finance API views
│   └── urls.py           # Finance URL patterns
├── 📁 BudgetBuddy/       # Main project settings
│   ├── settings.py       # Django settings
│   ├── urls.py           # Main URL configuration
│   └── wsgi.py           # WSGI configuration
├── 📄 requirements.txt   # Python dependencies
├── 📄 manage.py          # Django management script
└── 📄 .env               # Environment variables
```

## 🗃️ Database Schema

### 👤 User Table
```sql
- user_id (Primary Key)
- username
- first_name
- last_name
- password
- created_date
```

### 📂 Category Table
```sql
- category_id (Primary Key)
- category_name
- type (income/expense)
- icon
- user_id (Foreign Key)
```

### 💸 Transaction Table
```sql
- transaction_id (Primary Key)
- category_id (Foreign Key)
- user_id (Foreign Key)
- type (income/expense)
- amount
- note
- created_at
```

### 💰 Budget Table
```sql
- budget_id (Primary Key)
- user_id (Foreign Key)
- category_id (Foreign Key)
- budget_amount
- created_at
- updated_at
- cycle_month
```

## 🏗️ API Development Guide

### 📋 **หลักการสร้าง API ใน Django REST Framework**

#### **ขั้นตอนการสร้าง API (เรียงตามลำดับ)**

```
1. Model (โมเดล) → 2. Serializer → 3. View → 4. URL → 5. Service (ถ้าจำเป็น)
```

---

### 🔍 **1. Model (โมเดล) - ฐานข้อมูล**

**คืออะไร?** กำหนดโครงสร้างตารางในฐานข้อมูล

**ตัวอย่าง Model ปัจจุบัน:**
```python
# finance/models.py
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)  # income หรือ expense
    icon = models.TextField(blank=True, null=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    
    class Meta:
        db_table = 'Category'
```

**ตัวอย่างการเพิ่ม Model ใหม่:**
```python
class Goal(models.Model):
    """ตาราง Goal สำหรับเป้าหมายการออม"""
    goal_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    goal_name = models.CharField(max_length=255)
    target_amount = models.FloatField()
    current_amount = models.FloatField(default=0)
    target_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'Goal'
```

---

### 📝 **2. Serializer - ตัวแปลงข้อมูล**

**คืออะไร?** แปลงข้อมูลระหว่าง Python Object และ JSON

**ตัวอย่าง Serializer ปัจจุบัน:**
```python
# finance/serializers.py
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'category_name', 'type', 'icon', 'user_id']
```

**ตัวอย่างการเพิ่ม Serializer ใหม่:**
```python
class GoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Goal
        fields = ['goal_id', 'goal_name', 'target_amount', 'current_amount', 
                 'target_date', 'is_completed', 'progress_percentage']
        
    def get_progress_percentage(self, obj):
        return round((obj.current_amount / obj.target_amount) * 100, 2)
```

---

### 🔄 **3. View - ตัวควบคุมการทำงาน**

**คืออะไร?** จัดการคำขอ HTTP และส่งข้อมูลกลับ

**ตัวอย่าง View ปัจจุบัน:**
```python
# finance/views.py
@api_view(['GET'])
@permission_classes([AllowAny])
def all_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)
```

**ตัวอย่างการเพิ่ม View ใหม่ (CRUD):**
```python
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def goals_api(request):
    if request.method == 'GET':
        goals = Goal.objects.all()
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = GoalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
```

---

### 🛣️ **4. URL - เส้นทาง API**

**คืออะไร?** กำหนดเส้นทางการเข้าถึง API

**ตัวอย่าง URL ปัจจุบัน:**
```python
# finance/urls.py
urlpatterns = [
    path('AllCategory/', views.all_categories, name='all_categories'),
    path('AllTransaction/', views.all_transactions, name='all_transactions'),
]
```

**ตัวอย่างการเพิ่ม URL ใหม่:**
```python
urlpatterns = [
    # เดิม
    path('AllCategory/', views.all_categories, name='all_categories'),
    
    # ใหม่
    path('goals/', views.goals_api, name='goals_api'),
    path('goals/<int:goal_id>/', views.goal_detail, name='goal_detail'),
]
```

---

### 🔧 **5. Service (ถ้าจำเป็น) - ตัวจัดการธุรกิจ**

**คืออะไร?** แยกตรรกะทางธุรกิจออกจาก View

**ตัวอย่าง Service:**
```python
# finance/services.py
class GoalService:
    @staticmethod
    def calculate_progress(goal):
        return (goal.current_amount / goal.target_amount) * 100
    
    @staticmethod
    def check_completion(goal):
        if goal.current_amount >= goal.target_amount:
            goal.is_completed = True
            goal.save()
```

---

### 🚀 **วิธีการสร้าง API ใหม่ (ทีละขั้นตอน)**

#### **ขั้นตอนที่ 1: เพิ่ม Model**
```bash
# 1. แก้ไขไฟล์ finance/models.py
# 2. สร้าง migration
python manage.py makemigrations finance

# 3. Apply migration (fake สำหรับ Supabase)
python manage.py migrate finance --fake
```

#### **ขั้นตอนที่ 2: เพิ่ม Serializer**
```bash
# แก้ไขไฟล์ finance/serializers.py
# เพิ่ม import Model ใหม่
# สร้าง Serializer class ใหม่
```

#### **ขั้นตอนที่ 3: เพิ่ม View**
```bash
# แก้ไขไฟล์ finance/views.py
# เพิ่ม import Serializer ใหม่
# สร้าง View function ใหม่
```

#### **ขั้นตอนที่ 4: เพิ่ม URL**
```bash
# แก้ไขไฟล์ finance/urls.py
# เพิ่ม path ใหม่
```

#### **ขั้นตอนที่ 5: ทดสอบ API**
```bash
# รัน server
python manage.py runserver

# ทดสอบด้วย curl หรือ Browser
curl http://127.0.0.1:8000/api/finance/goals/
```

---

### 🎯 **ตัวอย่าง API ใหม่ที่สามารถเพิ่มได้**

| API | Method | URL | คำอธิบาย |
|-----|---------|-----|----------|
| Goals | GET, POST | `/api/finance/goals/` | ดู/สร้างเป้าหมาย |
| Goal Detail | GET, PUT, DELETE | `/api/finance/goals/{id}/` | จัดการเป้าหมายเฉพาะ |
| Reports | GET | `/api/finance/reports/` | รายงานสรุป |
| Analytics | GET | `/api/finance/analytics/` | การวิเคราะห์ |

---

## 🛠️ Technology Stack

- **Backend Framework**: Django 5.2.6
- **API Framework**: Django REST Framework 3.15.2
- **Database**: PostgreSQL (Supabase)
- **Language**: Python 3.13
- **CORS Handling**: django-cors-headers
- **Environment**: python-dotenv

## ⚙️ Configuration

### 🔒 Security Settings

- CORS enabled for all origins (development)
- No authentication required (AllowAny permissions)
- Environment variables for sensitive data

### 🌍 Database Connection

- Uses Supabase PostgreSQL
- SSL connection required
- Connection pooling enabled

## 🚨 Troubleshooting

### Common Issues

1. **Migration Warning**
   ```bash
   # Solution: Use fake migrate
   python manage.py migrate --fake
   ```

2. **Database Connection Error**
   ```bash
   # Check .env file configuration
   # Verify Supabase credentials
   ```

3. **CORS Issues**
   ```bash
   # Ensure CORS_ALLOW_ALL_ORIGINS = True in settings.py
   ```

4. **API Development Issues**
   ```bash
   # Model changes: Always make migrations
   python manage.py makemigrations finance
   python manage.py migrate finance --fake
   
   # Import errors: Check serializer imports
   # URL not found: Verify urlpatterns
   # JSON errors: Check serializer fields
   ```

## 📈 Development

### 🔄 Making Changes

```bash
# After model changes
python manage.py makemigrations
python manage.py migrate --fake

# Restart server
python manage.py runserver
```

### 🧪 Testing APIs

```bash
# Using curl
curl -X GET http://127.0.0.1:8000/api/accounts/AllUser/

# Using browser
http://127.0.0.1:8000/api/finance/AllCategory/
```

### 📝 API Testing Examples

```bash
# GET Request
curl -X GET http://127.0.0.1:8000/api/finance/goals/

# POST Request (Create)
curl -X POST http://127.0.0.1:8000/api/finance/goals/ \
  -H "Content-Type: application/json" \
  -d '{
    "goal_name": "ซื้อรถ",
    "target_amount": 500000,
    "target_date": "2025-12-31",
    "user_id": 1
  }'

# PUT Request (Update)
curl -X PUT http://127.0.0.1:8000/api/finance/goals/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_amount": 100000
  }'

# DELETE Request
curl -X DELETE http://127.0.0.1:8000/api/finance/goals/1/
```

---

## Thai Version

> 💰 ระบบ API สำหรับจัดการการเงินส่วนบุคคลที่ทันสมัย สร้างด้วย Django REST Framework และ Supabase PostgreSQL

### 🎯 เริ่มต้นใช้งาน

#### 📋 สิ่งที่ต้องมี

- Python 3.13+
- PostgreSQL (Supabase)
- Git

#### 🛠️ การติดตั้ง

##### 🪟 ติดตั้ง Python Virtual Environment (Windows)

```powershell
# สร้าง virtual environment ด้วย Python 3.13
py -3.13 -m venv env

# เปิดใช้งาน virtual environment
env\Scripts\activate

# ตรวจสอบเวอร์ชั่น Python
python --version
```

##### 🍎 ติดตั้ง Python Virtual Environment (macOS/Linux)

```bash
# สร้าง virtual environment ด้วย Python 3.13
python3.13 -m venv env

# เปิดใช้งาน virtual environment
source env/bin/activate

# ตรวจสอบเวอร์ชั่น Python
python --version
```

##### 📦 ติดตั้ง Dependencies

```bash
# ติดตั้ง packages ที่จำเป็น
pip install -r requirements.txt

# ตรวจสอบการติดตั้ง
pip list
```

#### 🔧 การตั้งค่า Environment

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# Supabase Database Configuration
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password
DB_HOST=your-host.supabase.co
DB_PORT=5432
```

#### 🗄️ ตั้งค่าฐานข้อมูล

```bash
# สร้าง initial migrations
python manage.py makemigrations accounts
python manage.py makemigrations finance

# Apply fake migrations (ใช้ตารางที่มีอยู่ใน Supabase)
python manage.py migrate --fake
```

#### 🚀 รันเซิร์ฟเวอร์พัฒนา

```bash
# เริ่ม Django development server
python manage.py runserver

# เซิร์ฟเวอร์จะเปิดที่:
# http://127.0.0.1:8000/
```

### 🌐 API Endpoints

#### 📊 APIs ที่ใช้งานได้

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `GET` | `/api/accounts/AllUser/` | ดูผู้ใช้ทั้งหมด |
| `POST` | `/api/accounts/CreateUser/` | สร้างผู้ใช้ใหม่ |
| `GET` | `/api/finance/AllCategory/` | ดูหมวดหมู่ทั้งหมด |
| `GET` | `/api/finance/AllTransaction/` | ดูธุรกรรมทั้งหมด |
| `GET` | `/api/finance/AllBudget/` | ดูงบประมาณทั้งหมด |

#### 🎯 Django REST Framework Browsable API

BudgetBuddy API ใช้ Django REST Framework ที่มาพร้อมกับ **Browsable API** - เครื่องมือทดสอบ API ที่ใช้งานง่ายและมีประสิทธิภาพ

#### 🚀 วิธีการใช้งาน Browsable API

1. **เริ่มต้น Django Server**
   ```bash
   python manage.py runserver
   ```

2. **เปิดเบราว์เซอร์และไปที่ API endpoint ที่ต้องการ**
   ```
   http://127.0.0.1:8000/api/accounts/AllUser/
   http://127.0.0.1:8000/api/accounts/CreateUser/
   http://127.0.0.1:8000/api/finance/AllCategory/
   ```

#### 🎨 คุณสมบัติของ Browsable API

- **📝 ฟอร์มกรอกข้อมูล**: กรอกข้อมูลผ่านฟอร์มแทนการเขียน JSON
- **🔍 แสดงผลที่อ่านง่าย**: ดู Response ในรูปแบบที่เข้าใจง่าย
- **📊 เลือกรูปแบบข้อมูล**: เลือกดูข้อมูลเป็น JSON, HTML, หรือ Raw
- **🧪 ทดสอบแบบ Real-time**: ทดสอบ API ได้ทันที
- **📚 เอกสารอัตโนมัติ**: เอกสาร API ที่สร้างขึ้นเอง

#### 💡 คำแนะนำการใช้งาน

1. **ดู API ทั้งหมด**
   - ไปที่: `http://127.0.0.1:8000/api/`
   - คลิกลิงก์เพื่อเข้าไปดู endpoint ต่างๆ

2. **ทดสอบ GET API (ดูข้อมูล)**
   - ไปที่ endpoint ที่ต้องการ
   - ข้อมูลจะแสดงออกมาอัตโนมัติ

3. **ทดสอบ POST API (สร้างข้อมูลใหม่)**
   - ไปที่ `http://127.0.0.1:8000/api/accounts/CreateUser/`
   - เลื่อนลงไปด้านล่างจะเจอฟอร์มกรอกข้อมูล
   - กรอกข้อมูลดังนี้:
     - **Username**: ชื่อผู้ใช้ (ต้องไม่ซ้ำ)
     - **Password**: รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
     - **Password confirm**: ยืนยันรหัสผ่าน (ต้องตรงกับรหัสผ่าน)
     - **First name**: ชื่อจริง (ไม่บังคับ)
     - **Last name**: นามสกุล (ไม่บังคับ)
   - คลิก **POST** เพื่อส่งข้อมูล

4. **เปลี่ยนรูปแบบการแสดงผล**
   - ดูที่มุมขวาบนของหน้า
   - คลิก dropdown เพื่อเลือกรูปแบบ:
     - `application/json` - ดูเป็น JSON
     - `text/html` - ดูเป็น HTML ที่อ่านง่าย
     - `Raw data` - ดูข้อมูลดิบ

#### 🔗 ลิงก์ด่วนสำหรับทดสอบ

| คำอธิบาย | URL |
|----------|-----|
| **หน้าหลัก API** | `http://127.0.0.1:8000/api/` |
| **ดูผู้ใช้ทั้งหมด** | `http://127.0.0.1:8000/api/accounts/AllUser/` |
| **สร้างผู้ใช้ใหม่** | `http://127.0.0.1:8000/api/accounts/CreateUser/` |
| **ดูหมวดหมู่ทั้งหมด** | `http://127.0.0.1:8000/api/finance/AllCategory/` |
| **ดูธุรกรรมทั้งหมด** | `http://127.0.0.1:8000/api/finance/AllTransaction/` |
| **ดูงบประมาณทั้งหมด** | `http://127.0.0.1:8000/api/finance/AllBudget/` |

#### 🎯 วิธีดู API Endpoints ทั้งหมด

**วิธีที่ 1: ผ่านหน้าหลัก API**
```
http://127.0.0.1:8000/api/
```
จะแสดงลิงก์ไปยัง API groups ต่างๆ (accounts, finance)

**วิธีที่ 2: ใช้คำสั่ง Django**
```bash
# ดู URL patterns ทั้งหมด
python manage.py show_urls | grep api
```

**วิธีที่ 3: ดูจากไฟล์ในโค้ด**
- `BudgetBuddy/urls.py` - URL หลัก
- `accounts/urls.py` - API จัดการผู้ใช้  
- `finance/urls.py` - API จัดการการเงิน

#### � เอกสารเพิ่มเติม

- 📖 [คู่มือการใช้งาน Django REST Framework Browsable API แบบละเอียด](./DRF_BROWSABLE_API_GUIDE.md)
- 📸 [ตัวอย่างภาพหน้าจอการใช้งาน](./docs/)

#### �📝 ตัวอย่างการเรียกใช้ API

```bash
# ดูผู้ใช้ทั้งหมด
curl http://127.0.0.1:8000/api/accounts/AllUser/

# ดูหมวดหมู่ทั้งหมด
curl http://127.0.0.1:8000/api/finance/AllCategory/

# ดูธุรกรรมทั้งหมด
curl http://127.0.0.1:8000/api/finance/AllTransaction/

# ดูงบประมาณทั้งหมด
curl http://127.0.0.1:8000/api/finance/AllBudget/
```

### 🏗️ โครงสร้างโปรเจค

```
BudgetBuddy/
├── 📁 accounts/           # แอปจัดการผู้ใช้
│   ├── models.py         # โมเดลผู้ใช้
│   ├── serializers.py    # Serializers ผู้ใช้
│   ├── views.py          # API views ผู้ใช้
│   └── urls.py           # URL patterns ผู้ใช้
├── 📁 finance/           # แอปจัดการการเงิน
│   ├── models.py         # โมเดลการเงิน
│   ├── serializers.py    # Serializers การเงิน
│   ├── views.py          # API views การเงิน
│   └── urls.py           # URL patterns การเงิน
├── 📁 BudgetBuddy/       # ตั้งค่าโปรเจคหลัก
│   ├── settings.py       # ตั้งค่า Django
│   ├── urls.py           # การตั้งค่า URL หลัก
│   └── wsgi.py           # การตั้งค่า WSGI
├── 📄 requirements.txt   # Dependencies Python
├── 📄 manage.py          # สคริปต์จัดการ Django
└── 📄 .env               # ตัวแปร Environment
```

### 🗃️ โครงสร้างฐานข้อมูล

#### 👤 ตาราง User
```sql
- user_id (Primary Key)
- username (ชื่อผู้ใช้)
- first_name (ชื่อจริง)
- last_name (นามสกุล)
- password (รหัสผ่าน)
- created_date (วันที่สร้าง)
```

#### 📂 ตาราง Category
```sql
- category_id (Primary Key)
- category_name (ชื่อหมวดหมู่)
- type (income/expense - รายรับ/รายจ่าย)
- icon (ไอคอน)
- user_id (Foreign Key)
```

#### 💸 ตาราง Transaction
```sql
- transaction_id (Primary Key)
- category_id (Foreign Key)
- user_id (Foreign Key)
- type (income/expense - รายรับ/รายจ่าย)
- amount (จำนวนเงิน)
- note (หมายเหตุ)
- created_at (วันที่สร้าง)
```

#### 💰 ตาราง Budget
```sql
- budget_id (Primary Key)
- user_id (Foreign Key)
- category_id (Foreign Key)
- budget_amount (จำนวนงบประมาณ)
- created_at (วันที่สร้าง)
- updated_at (วันที่อัพเดท)
- cycle_month (รอบเดือน)
```

### 🏗️ คู่มือการพัฒนา API

#### 📋 **หลักการสร้าง API ใน Django REST Framework**

##### **ขั้นตอนการสร้าง API (เรียงตามลำดับ)**

```
1. Model (โมเดล) → 2. Serializer → 3. View → 4. URL → 5. Service (ถ้าจำเป็น)
```

##### **🔍 1. Model (โมเดล) - ฐานข้อมูล**

**คืออะไร?** กำหนดโครงสร้างตารางในฐานข้อมูล

**ตัวอย่าง Model ปัจจุบัน:**
```python
# finance/models.py
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)  # income หรือ expense
    icon = models.TextField(blank=True, null=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    
    class Meta:
        db_table = 'Category'
```

**ตัวอย่างการเพิ่ม Model ใหม่:**
```python
class Goal(models.Model):
    """ตาราง Goal สำหรับเป้าหมายการออม"""
    goal_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    goal_name = models.CharField(max_length=255)
    target_amount = models.FloatField()
    current_amount = models.FloatField(default=0)
    target_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'Goal'
```

##### **📝 2. Serializer - ตัวแปลงข้อมูล**

**คืออะไร?** แปลงข้อมูลระหว่าง Python Object และ JSON

**ตัวอย่าง Serializer ปัจจุบัน:**
```python
# finance/serializers.py
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'category_name', 'type', 'icon', 'user_id']
```

**ตัวอย่างการเพิ่ม Serializer ใหม่:**
```python
class GoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Goal
        fields = ['goal_id', 'goal_name', 'target_amount', 'current_amount', 
                 'target_date', 'is_completed', 'progress_percentage']
        
    def get_progress_percentage(self, obj):
        return round((obj.current_amount / obj.target_amount) * 100, 2)
```

##### **🔄 3. View - ตัวควบคุมการทำงาน**

**คืออะไร?** จัดการคำขอ HTTP และส่งข้อมูลกลับ

**ตัวอย่าง View ปัจจุบัน:**
```python
# finance/views.py
@api_view(['GET'])
@permission_classes([AllowAny])
def all_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)
```

**ตัวอย่างการเพิ่ม View ใหม่ (CRUD):**
```python
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def goals_api(request):
    if request.method == 'GET':
        goals = Goal.objects.all()
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = GoalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
```

##### **🛣️ 4. URL - เส้นทาง API**

**คืออะไร?** กำหนดเส้นทางการเข้าถึง API

**ตัวอย่าง URL ปัจจุบัน:**
```python
# finance/urls.py
urlpatterns = [
    path('AllCategory/', views.all_categories, name='all_categories'),
    path('AllTransaction/', views.all_transactions, name='all_transactions'),
]
```

**ตัวอย่างการเพิ่ม URL ใหม่:**
```python
urlpatterns = [
    # เดิม
    path('AllCategory/', views.all_categories, name='all_categories'),
    
    # ใหม่
    path('goals/', views.goals_api, name='goals_api'),
    path('goals/<int:goal_id>/', views.goal_detail, name='goal_detail'),
]
```

##### **🔧 5. Service (ถ้าจำเป็น) - ตัวจัดการธุรกิจ**

**คืออะไร?** แยกตรรกะทางธุรกิจออกจาก View

**ตัวอย่าง Service:**
```python
# finance/services.py
class GoalService:
    @staticmethod
    def calculate_progress(goal):
        return (goal.current_amount / goal.target_amount) * 100
    
    @staticmethod
    def check_completion(goal):
        if goal.current_amount >= goal.target_amount:
            goal.is_completed = True
            goal.save()
```

#### 🚀 **วิธีการสร้าง API ใหม่ (ทีละขั้นตอน)**

##### **ขั้นตอนที่ 1: เพิ่ม Model**
```bash
# 1. แก้ไขไฟล์ finance/models.py
# 2. สร้าง migration
python manage.py makemigrations finance

# 3. Apply migration (fake สำหรับ Supabase)
python manage.py migrate finance --fake
```

##### **ขั้นตอนที่ 2: เพิ่ม Serializer**
```bash
# แก้ไขไฟล์ finance/serializers.py
# เพิ่ม import Model ใหม่
# สร้าง Serializer class ใหม่
```

##### **ขั้นตอนที่ 3: เพิ่ม View**
```bash
# แก้ไขไฟล์ finance/views.py
# เพิ่ม import Serializer ใหม่
# สร้าง View function ใหม่
```

##### **ขั้นตอนที่ 4: เพิ่ม URL**
```bash
# แก้ไขไฟล์ finance/urls.py
# เพิ่ม path ใหม่
```

##### **ขั้นตอนที่ 5: ทดสอบ API**
```bash
# รัน server
python manage.py runserver

# ทดสอบด้วย curl หรือ Browser
curl http://127.0.0.1:8000/api/finance/goals/
```

#### 🎯 **ตัวอย่าง API ใหม่ที่สามารถเพิ่มได้**

| API | Method | URL | คำอธิบาย |
|-----|---------|-----|----------|
| เป้าหมาย | GET, POST | `/api/finance/goals/` | ดู/สร้างเป้าหมาย |
| รายละเอียดเป้าหมาย | GET, PUT, DELETE | `/api/finance/goals/{id}/` | จัดการเป้าหมายเฉพาะ |
| รายงาน | GET | `/api/finance/reports/` | รายงานสรุป |
| การวิเคราะห์ | GET | `/api/finance/analytics/` | การวิเคราะห์ |

### 🛠️ เทคโนโลยีที่ใช้

- **Backend Framework**: Django 5.2.6
- **API Framework**: Django REST Framework 3.15.2
- **Database**: PostgreSQL (Supabase)
- **Language**: Python 3.13
- **CORS Handling**: django-cors-headers
- **Environment**: python-dotenv

### ⚙️ การตั้งค่า

#### 🔒 การตั้งค่าความปลอดภัย

- เปิดใช้ CORS สำหรับ origins ทั้งหมด (สำหรับการพัฒนา)
- ไม่ต้องการการยืนยันตัวตน (AllowAny permissions)
- ใช้ตัวแปร Environment สำหรับข้อมูลสำคัญ

#### 🌍 การเชื่อมต่อฐานข้อมูล

- ใช้ Supabase PostgreSQL
- ต้องการการเชื่อมต่อ SSL
- เปิดใช้งาน Connection pooling

### 🚨 การแก้ไขปัญหา

#### ปัญหาที่พบบ่อย

1. **คำเตือน Migration**
   ```bash
   # วิธีแก้: ใช้ fake migrate
   python manage.py migrate --fake
   ```

2. **ข้อผิดพลาดการเชื่อมต่อฐานข้อมูล**
   ```bash
   # ตรวจสอบการตั้งค่าไฟล์ .env
   # ตรวจสอบข้อมูลการเข้าถึง Supabase
   ```

3. **ปัญหา CORS**
   ```bash
   # ตรวจสอบให้แน่ใจว่า CORS_ALLOW_ALL_ORIGINS = True ใน settings.py
   ```

4. **ปัญหาการพัฒนา API**
   ```bash
   # การเปลี่ยนแปลง Model: สร้าง migrations เสมอ
   python manage.py makemigrations finance
   python manage.py migrate finance --fake
   
   # ข้อผิดพลาด Import: ตรวจสอบ imports ใน serializer
   # URL ไม่พบ: ตรวจสอบ urlpatterns
   # ข้อผิดพลาด JSON: ตรวจสอบ fields ใน serializer
   ```

### 📈 การพัฒนา

#### 🔄 การทำการเปลี่ยนแปลง

```bash
# หลังจากเปลี่ยนแปลง model
python manage.py makemigrations
python manage.py migrate --fake

# รีสตาร์ทเซิร์ฟเวอร์
python manage.py runserver
```

#### 🧪 การทดสอบ APIs

```bash
# ใช้ curl
curl -X GET http://127.0.0.1:8000/api/accounts/AllUser/

# ใช้ browser
http://127.0.0.1:8000/api/finance/AllCategory/
```

#### 📝 ตัวอย่างการทดสอบ API

```bash
# GET Request
curl -X GET http://127.0.0.1:8000/api/finance/goals/

# POST Request (สร้างข้อมูล)
curl -X POST http://127.0.0.1:8000/api/finance/goals/ \
  -H "Content-Type: application/json" \
  -d '{
    "goal_name": "ซื้อรถ",
    "target_amount": 500000,
    "target_date": "2025-12-31",
    "user_id": 1
  }'

# PUT Request (อัพเดท)
curl -X PUT http://127.0.0.1:8000/api/finance/goals/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_amount": 100000
  }'

# DELETE Request
curl -X DELETE http://127.0.0.1:8000/api/finance/goals/1/
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Aisaraphorn18** - *Initial work* - [GitHub](https://github.com/Aisaraphorn18)

---

⭐ **Star this repo if you find it helpful!**