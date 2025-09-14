# Django REST Framework UI - การใช้งาน

## การเข้าถึง DRF Browsable API

### 🎯 **URL Endpoints:**
- **All Users (GET)**: `http://localhost:8000/api/accounts/AllUser/`
- **Create User (POST)**: `http://localhost:8000/api/accounts/CreateUser/`

### ✨ **คุณสมบัติของ DRF UI:**

1. **หน้า Web Interface** - เปิดในเบราว์เซอร์ได้โดยตรง
2. **Form สำหรับกรอกข้อมูล** - มี HTML form สำหรับ POST data
3. **JSON Viewer** - แสดงผล response ในรูปแบบที่อ่านง่าย
4. **Raw Data Form** - สามารถกรอก JSON ได้โดยตรง
5. **Documentation** - แสดงข้อมูล serializer และ field descriptions

### 📝 **การใช้งาน Create User API:**

#### ขั้นตอนที่ 1: เปิดในเบราว์เซอร์
```
http://localhost:8000/api/accounts/CreateUser/
```

#### ขั้นตอนที่ 2: กรอกข้อมูลใน HTML Form
- **Username**: ชื่อผู้ใช้ (ต้องไม่ซ้ำ)
- **Password**: รหัสผ่านอย่างน้อย 6 ตัวอักษร
- **Password confirm**: ยืนยันรหัสผ่าน
- **First name**: ชื่อจริง (ไม่บังคับ)
- **Last name**: นามสกุล (ไม่บังคับ)

#### ขั้นตอนที่ 3: กดปุ่ม POST

### 📋 **ตัวอย่างข้อมูลที่กรอก:**
```
Username: testuser123
Password: mypassword123
Password confirm: mypassword123
First name: ทดสอบ
Last name: ผู้ใช้
```

### 🎨 **หรือใช้ Raw Data JSON:**
```json
{
    "username": "testuser123",
    "password": "mypassword123", 
    "password_confirm": "mypassword123",
    "first_name": "ทดสอบ",
    "last_name": "ผู้ใช้"
}
```

### ✅ **ผลลัพธ์ที่คาดหวัง:**
- **สำเร็จ (201 Created)**: แสดงข้อมูล user ที่สร้างใหม่
- **ผิดพลาด (400 Bad Request)**: แสดง error message

### 🚀 **ข้อดีของ DRF UI:**
- ✅ ไม่ต้องติดตั้งเพิ่มเติม
- ✅ แสดงผล HTML form อัตโนมัติ
- ✅ มี validation feedback
- ✅ ง่ายต่อการทดสอบ API
- ✅ แสดงข้อมูล serializer ครบถ้วน
- ✅ รองรับทั้ง JSON และ HTML form

### 🔗 **การเรียกใช้ผ่าน Code:**
#### JavaScript fetch:
```javascript
fetch('http://localhost:8000/api/accounts/CreateUser/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'testuser123',
    password: 'mypassword123',
    password_confirm: 'mypassword123',
    first_name: 'ทดสอบ',
    last_name: 'ผู้ใช้'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

#### Python requests:
```python
import requests

url = "http://localhost:8000/api/accounts/CreateUser/"
data = {
    "username": "testuser123",
    "password": "mypassword123",
    "password_confirm": "mypassword123",
    "first_name": "ทดสอบ",
    "last_name": "ผู้ใช้"
}

response = requests.post(url, json=data)
print(response.json())
```

---

**หมายเหตุ**: Django REST Framework Browsable API จะแสดงผลได้ดีที่สุดใน Chrome, Firefox หรือ Safari
