# คู่มือการทดสอบ (Testing Guide)

## ภาพรวม

Budget Buddy Backend ใช้ Bun built-in test framework สำหรับการทดสอบ โดยการทดสอบทั้งหมดออกแบบให้ทำงานได้โดยไม่ต้องเชื่อมต่อฐานข้อมูลจริง แต่ใช้ mocks และ stubs แทน

## โครงสร้างการทดสอบ

```
tests/
├── unit/                          # Unit tests สำหรับส่วนประกอบแต่ละตัว
│   └── category.service.bun.test.ts   # ทดสอบ business logic ของ CategoryService
├── integration/                   # Integration tests สำหรับ API endpoints
│   └── category.api.test.ts           # ทดสอบ Category API endpoints
├── mocks/                        # Mock implementations
│   ├── supabase.mock.ts              # Supabase mock เดิม
│   └── supabase-simple.mock.ts       # Supabase mock แบบง่าย
└── utils/                        # Test utilities
    └── test-utils.ts                 # Helper functions และ assertions
```

## ประเภทการทดสอบ

### Unit Tests

- ทดสอบ service methods แต่ละตัวแยกกัน
- ใช้ mocked dependencies (ไม่เรียกฐานข้อมูล)
- เน้นการตรวจสอบ business logic
- อยู่ใน `tests/unit/`

### Integration Tests

- ทดสอบ API endpoints แบบ end-to-end
- Mock authentication และ database responses
- ตรวจสอบ HTTP status codes และ response formats
- อยู่ใน `tests/integration/`

## การรันการทดสอบ

### ทดสอบทั้งหมด

```bash
bun test
```

### Unit Tests เท่านั้น

```bash
bun test tests/unit/
```

### Integration Tests เท่านั้น

```bash
bun test tests/integration/
```

### โหมด Watch

```bash
bun test --watch
```

### พร้อม Coverage

```bash
bun test --coverage
```

## ฟีเจอร์การทดสอบ

### CategoryService Tests

- ✅ getAllCategories() - ดึงข้อมูล categories ทั้งหมด
- ✅ getCategoryById() - ดึงข้อมูล category เฉพาะ
- ✅ createCategory() - สร้าง category ใหม่
- ✅ updateCategory() - อัปเดต category ที่มีอยู่
- ✅ deleteCategory() - ลบ category พร้อมตรวจสอบ dependency
- ✅ การจัดการ error สำหรับกรณีไม่พบข้อมูล
- ✅ การตรวจสอบ business logic

### Category API Tests

- ✅ GET /api/categories - แสดงรายการ categories ทั้งหมด
- ✅ GET /api/categories/:id - ดึงข้อมูล category เฉพาะ
- ✅ POST /api/categories - สร้าง category ใหม่
- ✅ PUT /api/categories/:id - อัปเดต category
- ✅ DELETE /api/categories/:id - ลบ category
- ✅ การตรวจสอบ authentication (401 responses)
- ✅ การจัดการ error (404, 409 responses)
- ✅ ความสอดคล้องของ response format

## กลยุทธ์ Mock

### ไม่มีการดำเนินการฐานข้อมูล

- การทดสอบทั้งหมดใช้ mocked Supabase client
- ไม่มีการดำเนินการ INSERT/UPDATE/DELETE จริง
- การตอบสนองที่ควบคุมได้สำหรับสถานการณ์ต่างๆ
- การรันที่รวดเร็วโดยไม่มี network calls

### Authentication Mocking

- Mock JWT tokens สำหรับ protected routes
- ทดสอบทั้งสถานการณ์ authenticated และ unauthenticated
- ตรวจสอบการจัดการ authorization ที่เหมาะสม

### Response Mocking

- รูปแบบ API response ที่สอดคล้องกัน
- Mock error scenarios (ไม่พบ, validation errors)
- ทดสอบการละเมิด dependency constraint

## ข้อมูลทดสอบ

### Mock Categories

```typescript
const mockCategories = [
  {
    category_id: 1,
    category_name: 'Food',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    category_id: 2,
    category_name: 'Transport',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];
```

### สถานการณ์ทดสอบ

- กรณีสำเร็จด้วยข้อมูลที่ถูกต้อง
- กรณี error (ไม่พบ, validation failures)
- กรณีขอบเขต (ข้อมูลว่าง, dependencies)
- สถานการณ์ authentication/authorization

## แนวปฏิบัติที่ดี

1. **การแยก**: การทดสอบแต่ละครั้งเป็นอิสระและไม่ส่งผลต่อกัน
2. **Mocking**: ไม่มีการเรียกฐานข้อมูลจริงหรือ external service
3. **Coverage**: ทดสอบทั้งสถานการณ์สำเร็จและ error
4. **ความสอดคล้อง**: ปฏิบัติตามรูปแบบที่กำหนดไว้สำหรับการทดสอบใหม่
5. **เอกสาร**: คำอธิบายการทดสอบและผลลัพธ์ที่คาดหวังที่ชัดเจน

## การเพิ่มการทดสอบใหม่

### สำหรับ Services

1. สร้างไฟล์ทดสอบใน `tests/unit/`
2. Import จาก `bun:test`
3. สร้าง mock implementation
4. ทดสอบ public methods ทั้งหมด
5. รวม error scenarios

### สำหรับ API Endpoints

1. สร้างไฟล์ทดสอบใน `tests/integration/`
2. Mock HTTP requests/responses
3. ทดสอบ HTTP methods ทั้งหมด
4. ตรวจสอบ authentication
5. ตรวจสอบ response formats

## ตัวอย่างโครงสร้างการทดสอบ

```typescript
import { describe, it, expect, beforeEach } from 'bun:test';

describe('Component Name', () => {
  let component: MockComponent;

  beforeEach(() => {
    component = new MockComponent();
  });

  describe('method name', () => {
    it('should handle success case', async () => {
      const result = await component.method();
      expect(result).toBeDefined();
    });

    it('should handle error case', async () => {
      expect(async () => {
        await component.methodWithError();
      }).toThrow('Expected error message');
    });
  });
});
```

## สคริปต์การทดสอบ

อัปเดต `package.json` ด้วยสคริปต์การทดสอบที่ครอบคลุม:

```json
{
  "scripts": {
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:unit": "bun test tests/unit/",
    "test:integration": "bun test tests/integration/",
    "test:coverage": "bun test --coverage"
  }
}
```

## การรันการทดสอบเฉพาะ

```bash
# รันไฟล์ทดสอบเฉพาะ
bun test tests/unit/category.service.bun.test.ts

# รันการทดสอบที่มีชื่อเฉพาะ
bun test --grep "should create category"

# รันด้วยโหมด verbose
bun test --verbose
```

## หมายเหตุ

- การทดสอบทำงานแยกกันโดยไม่ส่งผลต่อฐานข้อมูล
- Mock implementations ให้การตอบสนองที่ควบคุมได้และคาดเดาได้
- HTTP status codes และ error messages ทั้งหมดได้รับการตรวจสอบ
- การ Authentication ถูก mock เพื่อทดสอบพฤติกรรมของ protected route
- การตรวจสอบ business logic ช่วยให้มั่นใจว่ากฎความสมบูรณ์ของข้อมูลถูกบังคับใช้

## ผลประโยชน์

1. **ไม่มี Database Dependencies** - การทดสอบทำงานโดยไม่มีฐานข้อมูลจริง
2. **การดำเนินการที่รวดเร็ว** - การทดสอบทั้งหมดเสร็จสิ้นในมิลลิวินาที
3. **Coverage ที่ครอบคลุม** - ทดสอบ business logic, API endpoints และการจัดการ error
4. **การดูแลรักษาที่ง่าย** - โครงสร้างและเอกสารที่ชัดเจน
5. **พร้อมสำหรับ CI/CD** - สามารถทำงานในสภาพแวดล้อมใดก็ได้โดยไม่ต้องตั้งค่าฐานข้อมูล
