# Car Rental Frontend

โปรเจคนี้เป็น frontend ของระบบเช่ารถ ที่สร้างด้วย React, TypeScript และ Vite

## ภาพรวม

เว็บแอปนี้รองรับ:

- หน้าเว็บหลายหน้าโดยใช้ React Router
- ระบบล็อกอิน / ลงทะเบียนผู้ใช้
- หน้าสำหรับผู้ดูแลระบบจัดการรถ
- ค้นหาและกรองรถยนต์
- กระบวนการเช่ารถและดูประวัติการเช่า
- ปุ่มสลับภาษาอังกฤษและไทย

ฝั่ง frontend จะเชื่อมต่อกับ backend ภายในโฟลเดอร์ `car-rental-backend/`

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router DOM
- ESLint

## โครงสร้างโปรเจคหลัก

- `src/`
  - `App.tsx` - กำหนดเส้นทางของแอป (routes) และ provider หลัก
  - `i18n.jsx` - คอนเท็กซ์ภาษาพร้อมคำแปลภาษาอังกฤษ/ไทย
  - `AuthContext.jsx` - คอนเท็กซ์จัดการสถานะผู้ใช้
  - `components/` - คอมโพเนนต์ UI ที่ใช้ซ้ำได้ เช่น `Navbar`, `CarCard`, `ProtectedRoute`
  - `Pages/` - หน้าจอหลักของแอป เช่น `Dashboard`, `Login`, `Register`, `Cars`, `Rent`, `MyRentals`, `Profile`
  - `services/api.js` - ตัวเรียกใช้งาน API กับ backend
- `public/` - ไฟล์สาธารณะและ static assets
- `car-rental-backend/` - เซิร์ฟเวอร์ backend และ API (Express)

## การติดตั้งและรัน

### 1. ติดตั้ง dependencies frontend

```bash
npm install
```

### 2. ติดตั้ง dependencies backend

```bash
cd car-rental-backend
npm install
cd ..
```

### 3. รัน backend

```bash
cd car-rental-backend
npm run dev
```

จากนั้น backend จะเริ่มทำงานบนพอร์ตที่กำหนดใน `server.js`

### 4. รัน frontend

```bash
npm run dev
```

แล้วเปิด URL ที่ Vite แสดงในเทอร์มินัล

## คำสั่งสำคัญ

- `npm run dev` - รัน frontend ในโหมดพัฒนา
- `npm run build` - สร้างไฟล์สำหรับ production
- `npm run lint` - ตรวจสอบโค้ดด้วย ESLint
- `npm run format` - จัดรูปแบบโค้ดด้วย Prettier

## ข้อมูลหน้าโค้ดหลัก

- `src/App.tsx` - กำหนดเส้นทาง
- `src/i18n.jsx` - คำแปลภาษา
- `src/AuthContext.jsx` - จัดการ session ผู้ใช้
- `src/Pages/Dashboard.jsx` - หน้าหลัก
- `src/Pages/Login.jsx` - หน้าล็อกอิน
- `src/Pages/Register.jsx` - หน้าสมัครสมาชิก
- `src/Pages/Cars.jsx` - หน้าแสดงรถทั้งหมด
- `src/Pages/Rent.jsx` - หน้าเช่ารถ
- `src/Pages/MyRentals.jsx` - ดูประวัติการเช่า
- `src/Pages/Profile.jsx` - จัดการข้อมูลโปรไฟล์
- `src/components/ProtectedRoute.jsx` - ป้องกันหน้าเฉพาะผู้ใช้งานที่ล็อกอินแล้ว
- `src/services/api.js` - เรียก API ไปยัง backend

## คำอธิบายสั้น ๆ ของโปรเจค

ระบบ frontend สำหรับเว็บเช่ารถที่มี:

- หน้าแสดงรถและฟิลเตอร์
- การล็อกอิน/ลงทะเบียน
- การจัดการเช่ารถและดูประวัติการเช่า
- ระบบแอดมินสำหรับจัดการรถ
- รองรับภาษาอังกฤษและไทย

> เป็นโปรเจคเรียนรู้ที่ใช้ React + TypeScript + Vite และเชื่อมต่อกับ backend Express ในโฟลเดอร์ `car-rental-backend/`
