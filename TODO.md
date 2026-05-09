# Expense Management SaaS — Implementation Tracker

## Phase 1 — Project Initialization
- [x] Create `frontend/` and `backend/` folders
- [x] Scaffold root Next.js app and separate `frontend/` app
- [x] Scaffold backend in `backend/` (Express + TS)
- [x] Confirm branch renders a homepage on localhost:3000

## Phase 2 — Dependency Installation
- [x] Install frontend dependencies (Tailwind, Zustand, Zod, RHF, Recharts, etc.)
- [x] Install backend dependencies (Prisma, JWT, bcryptjs, Multer, Cloudinary, etc.)
- [ ] Add shared lint/format configuration across root and frontend apps
- [ ] Confirm `npm run dev` commands for frontend and backend work without port conflict

## Phase 3 — Database Setup
- [ ] Add Prisma schema
- [ ] Configure PostgreSQL (Neon)
- [ ] Run migrations
- [ ] Seed admin account

## Phase 4 — Authentication
- [ ] Register API
- [ ] Login API
- [ ] JWT setup (access + refresh)
- [ ] HTTP-only cookie handling
- [ ] Middleware protection
- [ ] Role-based authorization

## Phase 5 — Backend Development
- [ ] Controllers/services/routes
- [ ] Server-side validation (Zod)
- [ ] Upload system (Multer + Cloudinary)
- [ ] Centralized error handling
- [ ] Audit log + activity tracking hooks

## Phase 6 — Frontend Development
- [x] Landing page
- [ ] Auth UI
- [ ] User dashboard UI
- [ ] Admin dashboard UI
- [ ] Expense create/edit forms
- [ ] Analytics pages + charts

## Phase 7 — Admin Features
- [ ] Approve/reject actions
- [ ] Rejection remarks
- [ ] Audit logs UI
- [ ] User management UI

## Phase 8 — UI Polishing
- [ ] Dark mode, glassmorphism, responsive layouts
- [ ] Animations with Framer Motion
- [ ] Skeleton loaders + empty states
- [ ] Toast notifications
- [ ] Error boundaries

## Phase 9 — Testing
- [ ] API testing plan + implementation
- [ ] Auth/role tests
- [ ] Expense lifecycle tests
- [ ] Dashboard render sanity checks

## Phase 10 — Deployment
- [ ] Frontend deployment to Vercel
- [ ] Backend deployment to Railway/Render
- [ ] Database migrations to Neon
- [ ] Cloudinary + env wiring
- [ ] Production configuration + security checklist

## Dev notes
- Use `cd frontend && npm run dev` to run the dedicated frontend app.
- Use `cd backend && npm run dev` for the backend server.
- The root app and frontend app now both render the new Expense Tracker landing UI.

