# 🚀 BudgetBuddy API Backend

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.2.6-green.svg)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.15.2-red.svg)](https://www.django-rest-framework.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-orange.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Language / ภาษา

| Language | Link |
|----------|------|
| 🇺🇸 English | [Read in English](#english-version) |
| 🇹🇭 ไทย | [อ่านภาษาไทย](#thai-version) |

---

## English Version

> 💰 A modern personal finance management API built with Django REST Framework and Supabase PostgreSQL

### 🎯 Getting Started

#### 📋 Prerequisites

- Python 3.13+
- PostgreSQL (Supabase)
- Git

#### 🛠️ Installation

##### 🪟 Install Python Virtual Environment (Windows)

```powershell
# Create virtual environment with Python 3.13
py -3.13 -m venv env

# Activate virtual environment
env\Scripts\activate

# Verify Python version
python --version
```

#### 🍎 Install Python Virtual Environment (macOS/Linux)

```bash
# Create virtual environment with Python 3.13
python3.13 -m venv env

# Activate virtual environment
source env/bin/activate

# Verify Python version
python --version
```

#### 📦 Install Dependencies

```bash
# Install required packages
pip install -r requirements.txt

# Verify installation
pip list
```

### 🔧 Environment Configuration

Create a `.env` file in the root directory:

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

### 🗄️ Database Setup

```bash
# Create initial migrations
python manage.py makemigrations accounts
python manage.py makemigrations finance

# Apply fake migrations (use existing Supabase tables)
python manage.py migrate --fake
```

### 🚀 Run Development Server

```bash
# Start Django development server
python manage.py runserver

# Server will be available at:
# http://127.0.0.1:8000/
```

## 🌐 API Endpoints

### 📊 Available APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/accounts/AllUser/` | Get all users |
| `POST` | `/api/accounts/CreateUser/` | Create new user |
| `GET` | `/api/finance/AllCategory/` | Get all categories |
| `GET` | `/api/finance/AllTransaction/` | Get all transactions |
| `GET` | `/api/finance/AllBudget/` | Get all budgets |

### 🎯 Django REST Framework Browsable API

BudgetBuddy API ใช้ Django REST Framework ที่มาพร้อมกับ **Browsable API** - เครื่องมือทดสอบ API ที่มีประสิทธิภาพ

#### 🚀 การเข้าถึง Browsable API

1. **เริ่มต้น Django Server**
   ```bash
   python manage.py runserver
   ```

2. **เปิดเบราว์เซอร์และไปที่ API endpoint ใดก็ได้**
   ```
   http://127.0.0.1:8000/api/accounts/AllUser/
   http://127.0.0.1:8000/api/accounts/CreateUser/
   http://127.0.0.1:8000/api/finance/AllCategory/
   ```

#### 🎨 คุณสมบัติของ Browsable API

- **📝 Form Interface**: กรอกข้อมูลผ่านฟอร์มแทนการเขียน JSON
- **🔍 Response Viewer**: ดู Response ในรูปแบบที่อ่านง่าย
- **📊 Data Format**: เลือกรูปแบบข้อมูล (JSON, HTML, Raw)
- **🧪 Live Testing**: ทดสอบ API แบบ Real-time
- **📚 Auto Documentation**: เอกสาร API ที่สร้างอัตโนมัติ

#### 💡 วิธีใช้งาน Browsable API

1. **ดู API ทั้งหมด**
   - ไปที่: `http://127.0.0.1:8000/api/`
   - คลิกลิงก์เพื่อดู endpoint ต่างๆ

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

#### 📸 Example Screenshot Guide

**Create User API Interface:**
![Create User API](./docs/create-user-api.png)

1. **API Description**: แสดงรายละเอียด endpoint
2. **Request Method**: แสดง HTTP method ที่รองรับ
3. **Response Example**: ตัวอย่าง Response ที่ได้รับ
4. **Input Form**: ฟอร์มกรอกข้อมูล
5. **POST Button**: ปุ่มส่งข้อมูล

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

#### 📸 ตัวอย่างหน้าจอการใช้งาน

**หน้า Create User API:**
![Create User API](./docs/create-user-api.png)

**องค์ประกอบในหน้า:**
1. **คำอธิบาย API**: แสดงรายละเอียดของ endpoint
2. **Request Method**: แสดง HTTP method ที่รองรับ (GET, POST, etc.)
3. **ตัวอย่าง Response**: แสดงตัวอย่างข้อมูลที่จะได้รับ
4. **ฟอร์มกรอกข้อมูล**: ฟอร์มสำหรับกรอกข้อมูลส่ง API
5. **ปุ่ม POST**: ปุ่มสำหรับส่งข้อมูล

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