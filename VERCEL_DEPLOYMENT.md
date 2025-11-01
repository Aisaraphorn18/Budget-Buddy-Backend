# Vercel Deployment Guide for Budget Buddy Backend

## ขั้นตอนการ Deploy ไป Vercel

### 1. เตรียม Repository

```bash
git add .
git commit -m "feat: Add Vercel deployment support"
git push
```

### 2. Import Project ใน Vercel

1. ไปที่ https://vercel.com/new
2. เลือก repository: `Budget-Buddy-Backend`
3. Configure Project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `bun install`
   - **Output Directory**: (leave empty)

### 3. ตั้งค่า Environment Variables

ใน Vercel Dashboard > Settings > Environment Variables เพิ่ม:

```
JWT_SECRET=your-production-secret-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
NODE_ENV=production
```

### 4. Deploy

กด "Deploy" และรอให้ build เสร็จ

### 5. ทดสอบ API

เมื่อ deploy สำเร็จ ทดสอบที่:

```
https://your-project.vercel.app/health
```

## สาเหตุที่ Deploy ไม่ได้ก่อนหน้านี้

1. **ไม่มี `export default app`** - Vercel ต้องการ export default
2. **ไม่มี `vercel.json`** - configuration สำหรับ routing
3. **Server ทำงานเสมอ** - ควรจะเช็ค `NODE_ENV` ก่อน listen

## โครงสร้างไฟล์สำหรับ Vercel

```
Budget-Buddy-Backend/
├── vercel.json          # Vercel configuration
├── src/
│   └── index.ts         # Main entry (exports default app)
└── package.json         # Dependencies
```

## การทดสอบ Local

```bash
# Development
bun run dev

# Production build
NODE_ENV=production bun run src/index.ts
```

## Common Issues

### Issue: Function Invocation Failed

**สาเหตุ**: ไม่มี `export default`  
**วิธีแก้**: เพิ่ม `export default app;` ในไฟล์ `src/index.ts`

### Issue: 404 Not Found

**สาเหตุ**: Routing configuration ผิด  
**วิธีแก้**: ตรวจสอบ `vercel.json` ว่า routes ถูกต้อง

### Issue: Environment Variables ไม่ทำงาน

**สาเหตุ**: ไม่ได้ตั้งค่าใน Vercel Dashboard  
**วิธีแก้**: เพิ่ม Environment Variables ใน Project Settings

## สิ่งที่ต้องทำต่อ

1. ✅ เพิ่ม `export default app` ใน `src/index.ts`
2. ✅ สร้าง `vercel.json`
3. ✅ เช็ค `NODE_ENV` ก่อน `.listen()`
4. ⏳ ตั้งค่า Environment Variables ใน Vercel
5. ⏳ Deploy และทดสอบ

## Support

หากมีปัญหา:

1. ตรวจสอบ Vercel Logs
2. ทดสอบ local ด้วย `NODE_ENV=production`
3. ตรวจสอบ Environment Variables
