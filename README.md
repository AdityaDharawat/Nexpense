# ExpenseFlow

ExpenseFlow is a full stack Expense Management System where users can submit expense requests and admins can review, approve, reject, and manage them through a dashboard.

The project is built using modern web technologies with separate frontend and backend architecture.

---

# Features

## User
- Register and login
- Create expense requests
- Upload receipts
- View expense history
- Track approval status

## Admin
- View all expenses
- Approve/reject requests
- Manage users
- View analytics and logs

---

# Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- ShadCN UI

## Backend
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Other Tools
- Cloudinary
- Multer
- Zustand
- Recharts

---

# Project Structure

```bash
expense-management-system/
│
├── frontend/
├── backend/
└── README.md
```

---

# Clone the Project

```bash
git clone <repository-url>
cd expense-management-system
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Environment Variables

Create a `.env` file inside the backend folder:

```env
DATABASE_URL=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

# Prisma Setup

```bash
npx prisma generate
npx prisma db push
```

---

# Demo Credentials

## Admin

```bash
Email: admin@expenseflow.com
Password: Admin@123
```

## User

```bash
Email: user@expenseflow.com
Password: User@123
```

---

# Deployment

- Frontend → Vercel
- Backend → Railway / Render
- Database → NeonDB
- File Uploads → Cloudinary
