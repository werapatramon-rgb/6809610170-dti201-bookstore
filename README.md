# DTI201 Bookstore

แอปจัดการรายการหนังสือด้วย Express, MongoDB Atlas และ React

## โครงสร้าง

- backend: API และการเชื่อมฐานข้อมูล
- frontend: หน้าเว็บ React

## สิ่งที่ทดลอง

- อ่านข้อมูลจาก MongoDB Atlas
- เพิ่ม อ่าน แก้ไข และลบหนังสือผ่าน API
- แสดงและบันทึกข้อมูลจากหน้า React

## วิธีรัน

ใช้ Node.js 22.12 ขึ้นไป

### Backend

1. เข้า backend แล้วรัน npm ci
2. คัดลอก .env.example เป็น .env และใส่ URI ของ Atlas ของผู้รันเอง
3. รัน npm run db:check และ npm run seed
4. รัน npm run dev — API ใช้ port 3001

### Frontend

1. เปิด terminal ใหม่ เข้า frontend แล้วรัน npm ci
2. รัน npm run dev
3. เปิด http://127.0.0.1:5174/
