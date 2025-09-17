# 🔑 Authentication API

## ภาพรวม

จัดการการสมัครสมาชิก เข้าสู่ระบบ ออกจากระบบ และการจัดการโปรไฟล์

## Endpoints

### สมัครสมาชิกใหม่ {#register}

**POST** `/api/v1/auth/register`

**คำอธิบาย**: สร้างบัญชีผู้ใช้ใหม่

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
  "message": "สมัครสมาชิกสำเร็จ",
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

### เข้าสู่ระบบ {#login}

**POST** `/api/v1/auth/login`

**คำอธิบาย**: ยืนยันตัวตนและรับ JWT token

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
  "message": "เข้าสู่ระบบสำเร็จ",
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

### ออกจากระบบ

**POST** `/api/v1/auth/logout`

**คำอธิบาย**: ออกจากระบบ (ยกเลิก token)

**Headers**:

```
Authorization: Bearer <token>
```

**Response**:

```json
{
  "success": true,
  "message": "ออกจากระบบสำเร็จ"
}
```

### ดูข้อมูลโปรไฟล์

**GET** `/api/v1/auth/profile`

**คำอธิบาย**: ดูข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน

**Headers**:

```
Authorization: Bearer <token>
```

**Response**:

```json
{
  "success": true,
  "message": "ดึงข้อมูลโปรไฟล์สำเร็จ",
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
  "message": "ชื่อผู้ใช้นี้มีอยู่แล้ว",
  "data": null
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
  "data": null
}
```

## ตัวอย่างการใช้งาน

### การสมัครและเข้าสู่ระบบ

```bash
# 1. สมัครสมาชิก
curl -X POST "http://localhost:3000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securePassword123"
  }'

# 2. เข้าสู่ระบบ
curl -X POST "http://localhost:3000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'

# 3. ใช้ token ในการเรียก API อื่นๆ
curl -X GET "http://localhost:3000/api/v1/auth/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

[← กลับไปยังเอกสาร API](../README.md)
