# 🏥 CareBridge Specialist Hospital — Management System

A full-stack, production-ready Hospital Management Website for **CareBridge Specialist Hospital, Jos, Plateau State, Nigeria**.

Built with **Next.js 14 + TypeScript** (frontend) and **Node.js + Express + PostgreSQL** (backend), with a fully animated UI powered by **Framer Motion**.

---

## 📁 Project Structure

```
Hospital Management/
├── backend/
│   ├── src/
│   │   ├── config/       # database.js, index.js
│   │   ├── controllers/  # authController, appointmentController, doctorController, etc.
│   │   ├── middlewares/  # auth.js, validate.js, errorHandler.js
│   │   ├── migrations/   # 12 Sequelize migrations
│   │   ├── models/       # 11 Sequelize models
│   │   ├── routes/       # auth, doctors, appointments, services, blog, admin, etc.
│   │   ├── seeders/      # 7 seeders — users, departments, doctors, schedules, services, blog, testimonials
│   │   ├── utils/        # response.js, jwt.js, availability.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   ├── .sequelizerc
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (public)/           # Home, About, Departments, Doctors, Services, Health Tips, Contact, Login, Register
    │   │   ├── dashboard/
    │   │   │   ├── patient/        # Overview, Book, Appointments, Records, Profile
    │   │   │   ├── doctor/         # Overview, Appointments, Records, Schedule
    │   │   │   └── admin/          # Overview, Appointments, Users, Doctors, Departments, Messages, Blog, Testimonials
    │   │   ├── layout.tsx
    │   │   ├── template.tsx
    │   │   └── not-found.tsx
    │   ├── components/
    │   │   ├── layout/             # Navbar, Footer, FloatingButtons (WhatsApp + ScrollToTop)
    │   │   ├── motion/             # FadeIn, FadeUp, ScrollReveal, Stagger, AnimatedCounter, Float, PageTransition
    │   │   └── dashboard/          # AuthGuard, DashboardSidebar, StatCard
    │   ├── lib/
    │   │   ├── api.ts              # Axios + auto-refresh interceptor
    │   │   ├── motion.ts           # Framer Motion variants
    │   │   └── utils.ts            # formatNaira, formatDate, NIGERIAN_STATES, etc.
    │   ├── store/authStore.ts      # Zustand (persisted)
    │   ├── types/index.ts
    │   └── middleware.ts           # Next.js route protection
    ├── .env.local
    ├── tailwind.config.ts
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** ≥ 18.0.0
- **PostgreSQL** ≥ 13
- **npm** ≥ 9

---

## 🚀 Quick Start

### 1 — Backend Setup

```bash
cd backend
npm install
```

Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` — update your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carebridge_hospital
DB_USER=postgres
DB_PASS=your_postgres_password
JWT_ACCESS_SECRET=change_me_in_production_1
JWT_REFRESH_SECRET=change_me_in_production_2
CLIENT_URL=http://localhost:3000
PORT=5000
```

Create the database:

```bash
# Using psql
psql -U postgres -c "CREATE DATABASE carebridge_hospital;"

# OR using Sequelize CLI
npx sequelize-cli db:create
```

Run migrations:

```bash
npx sequelize-cli db:migrate
```

Seed demo data:

```bash
npx sequelize-cli db:seed:all
```

Start the backend:

```bash
npm run dev
```

> Backend runs at **http://localhost:5000**
> Health check: **http://localhost:5000/api/health**

---

### 2 — Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at **http://localhost:3000**

The `.env.local` file is pre-configured for local development. To customise:

```bash
cp .env.example .env.local
```

---

## 🔑 Test Accounts

| Role    | Email                         | Password     |
|---------|-------------------------------|--------------|
| Admin   | admin@carebridge.com          | Password123! |
| Doctor  | dr.okonkwo@carebridge.com     | Password123! |
| Doctor  | dr.nwachukwu@carebridge.com   | Password123! |
| Doctor  | dr.adeyemi@carebridge.com     | Password123! |
| Doctor  | dr.eze@carebridge.com         | Password123! |
| Doctor  | dr.ikechukwu@carebridge.com   | Password123! |
| Doctor  | dr.abdullahi@carebridge.com   | Password123! |
| Doctor  | dr.fasanya@carebridge.com     | Password123! |
| Doctor  | dr.obiora@carebridge.com      | Password123! |
| Patient | patient@carebridge.com        | Patient123!  |
| Patient | chioma@test.com               | Patient123!  |
| Patient | musa@test.com                 | Patient123!  |

---

## 🗄️ Database Reset

```bash
cd backend
npm run db:reset
# equivalent to:
# npx sequelize-cli db:seed:undo:all
# npx sequelize-cli db:migrate:undo:all
# npx sequelize-cli db:migrate
# npx sequelize-cli db:seed:all
```

---

## 🌐 Pages & Routes

| URL                               | Description                           |
|-----------------------------------|---------------------------------------|
| `/`                               | Home — hero, stats, departments, testimonials |
| `/about`                          | About CareBridge                      |
| `/departments`                    | All departments                       |
| `/departments/:id`                | Department detail                     |
| `/doctors`                        | Doctor search & filter                |
| `/doctors/:id`                    | Doctor profile + schedule             |
| `/services`                       | Services with ₦ prices                |
| `/health-tips`                    | Blog / health articles list           |
| `/health-tips/:slug`              | Article detail                        |
| `/contact`                        | Contact form + map + info             |
| `/login`                          | Sign in                               |
| `/register`                       | Patient self-registration             |
| `/dashboard/patient`              | Patient overview                      |
| `/dashboard/patient/book`         | Multi-step appointment booking        |
| `/dashboard/patient/appointments` | View & cancel appointments            |
| `/dashboard/patient/records`      | Medical records (expandable)          |
| `/dashboard/patient/profile`      | Edit profile (full Nigerian fields)   |
| `/dashboard/doctor`               | Doctor overview & today's schedule    |
| `/dashboard/doctor/appointments`  | Manage & update appointment status    |
| `/dashboard/doctor/records`       | Create patient medical records        |
| `/dashboard/doctor/schedule`      | Manage weekly availability            |
| `/dashboard/admin`                | Stats cards + Recharts                |
| `/dashboard/admin/appointments`   | All appointments (filterable table)   |
| `/dashboard/admin/users`          | User management + toggle active       |
| `/dashboard/admin/doctors`        | Add new doctor accounts               |
| `/dashboard/admin/departments`    | CRUD departments                      |
| `/dashboard/admin/messages`       | Contact messages + mark read          |
| `/dashboard/admin/blog`           | Create & manage health tips           |
| `/dashboard/admin/testimonials`   | Manage patient testimonials           |

---

## 📡 API Reference

### Base URL: `http://localhost:5000/api`

#### Health Check

```bash
curl http://localhost:5000/api/health
```

---

#### Auth

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ada","lastName":"Obi","email":"ada@test.com","phone":"+2348012345678","password":"Password123!"}'

# Login — sets httpOnly refresh cookie, returns accessToken
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carebridge.com","password":"Password123!"}' \
  -c cookies.txt

# Get current user
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Refresh access token (reads cookie)
curl -X POST http://localhost:5000/api/auth/refresh -b cookies.txt

# Logout
curl -X POST http://localhost:5000/api/auth/logout -b cookies.txt

# Change password
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"Password123!","newPassword":"NewPass456!"}'

# Forgot password (logs reset link to console in dev)
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@carebridge.com"}'
```

---

#### Public Endpoints

```bash
# Departments
curl http://localhost:5000/api/departments
curl http://localhost:5000/api/departments/DEPT_ID

# Doctors
curl "http://localhost:5000/api/doctors?search=okonkwo&limit=10&page=1"
curl "http://localhost:5000/api/doctors?departmentId=DEPT_ID"
curl http://localhost:5000/api/doctors/DOCTOR_ID

# Doctor availability
curl "http://localhost:5000/api/doctors/DOCTOR_ID/availability?date=2025-01-20"

# Services
curl "http://localhost:5000/api/services"
curl "http://localhost:5000/api/services?departmentId=DEPT_ID"

# Health Tips
curl http://localhost:5000/api/health-tips
curl http://localhost:5000/api/health-tips/understanding-malaria-prevention-plateau-state

# Testimonials
curl http://localhost:5000/api/testimonials

# Submit contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Amina Bello","email":"amina@test.com","subject":"Appointment enquiry","message":"I would like to book an appointment with a cardiologist."}'
```

---

#### Patient Endpoints (role: patient)

```bash
export TOKEN="your_patient_access_token"

# Profile
curl http://localhost:5000/api/patients/profile -H "Authorization: Bearer $TOKEN"
curl -X PUT http://localhost:5000/api/patients/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"state":"Plateau","lga":"Jos North","bloodGroup":"O+","genotype":"AS","nhisNumber":"NHIS-2023-999"}'

# Book appointment
curl -X POST http://localhost:5000/api/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doctorId":"DOCTOR_ID","departmentId":"DEPT_ID","appointmentDate":"2025-01-20","timeSlot":"09:00","reason":"Persistent headache and high BP"}'

# My appointments
curl "http://localhost:5000/api/appointments/my?status=pending" -H "Authorization: Bearer $TOKEN"

# Cancel appointment
curl -X PATCH http://localhost:5000/api/appointments/APPT_ID/cancel \
  -H "Authorization: Bearer $TOKEN"

# Medical records
curl http://localhost:5000/api/medical-records/my -H "Authorization: Bearer $TOKEN"
```

---

#### Doctor Endpoints (role: doctor)

```bash
export TOKEN="your_doctor_access_token"

# Doctor profile + schedule
curl http://localhost:5000/api/doctors/me/profile -H "Authorization: Bearer $TOKEN"

# Update schedule
curl -X PUT http://localhost:5000/api/doctors/me/schedule \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"schedules":[{"dayOfWeek":"monday","startTime":"08:00","endTime":"16:00","slotDurationMinutes":30},{"dayOfWeek":"wednesday","startTime":"09:00","endTime":"15:00","slotDurationMinutes":30}]}'

# Appointments list (filter by date and/or status)
curl "http://localhost:5000/api/appointments/doctor?date=2025-01-20&status=pending" -H "Authorization: Bearer $TOKEN"

# Update appointment status
curl -X PATCH http://localhost:5000/api/appointments/APPT_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}'

# Create medical record (appointment must be completed)
curl -X POST http://localhost:5000/api/medical-records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"patientId":"PATIENT_ID","appointmentId":"APPT_ID","diagnosis":"Hypertension Stage 2","prescription":"Amlodipine 10mg once daily\nLisinopril 10mg once daily","notes":"Reduce salt intake. Exercise 30 min daily. Return in 4 weeks.","followUpDate":"2025-02-17"}'
```

---

#### Admin Endpoints (role: admin)

```bash
export ADMIN="your_admin_access_token"

# Dashboard stats
curl http://localhost:5000/api/admin/stats -H "Authorization: Bearer $ADMIN"

# All users (paginated, filterable)
curl "http://localhost:5000/api/admin/users?role=doctor&page=1&limit=10" -H "Authorization: Bearer $ADMIN"
curl "http://localhost:5000/api/admin/users?search=okonkwo" -H "Authorization: Bearer $ADMIN"

# Create doctor account
curl -X POST http://localhost:5000/api/admin/doctors \
  -H "Authorization: Bearer $ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Chidi","lastName":"Nwosu","email":"dr.nwosu@carebridge.com","departmentId":"DEPT_ID","specialization":"Neurology","yearsOfExperience":12,"consultationFee":18000}'

# Toggle user active/inactive
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID/toggle-active -H "Authorization: Bearer $ADMIN"

# All appointments
curl "http://localhost:5000/api/appointments/admin?status=completed&page=1" -H "Authorization: Bearer $ADMIN"

# Contact messages
curl http://localhost:5000/api/contact -H "Authorization: Bearer $ADMIN"
curl -X PATCH http://localhost:5000/api/contact/MSG_ID/read -H "Authorization: Bearer $ADMIN"

# Blog posts (admin can CRUD)
curl -X POST http://localhost:5000/api/health-tips \
  -H "Authorization: Bearer $ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Preventing Typhoid in Jos","excerpt":"Typhoid remains common in Plateau State...","content":"<p>Full article...</p>","category":"Infectious Diseases","isPublished":true}'

# Testimonials
curl -X POST http://localhost:5000/api/testimonials \
  -H "Authorization: Bearer $ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mrs. Bola Adamu","role":"Patient, Plateau State","message":"Excellent care from the paediatric team.","rating":5,"isVisible":true}'
```

---

## 🎨 Animation System

All animations are in `frontend/src/lib/motion.ts` (variants) and `frontend/src/components/motion/index.tsx` (components).

| Component           | Description                                    |
|---------------------|------------------------------------------------|
| `<FadeIn>`          | Fade in on mount                               |
| `<FadeUp>`          | Fade up on mount                               |
| `<ScrollReveal>`    | Animates once when scrolled into view          |
| `<Stagger>`         | Stagger-animates children on scroll            |
| `<StaggerItem>`     | Individual stagger child                       |
| `<AnimatedCounter>` | Counts up from 0 when in view (react-countup)  |
| `<Float>`           | Infinite gentle y-axis float                   |
| `<PageTransition>`  | Fade + slide between routes (template.tsx)     |

Custom Tailwind keyframes: `float`, `heartbeat`, `shimmer`, `pulse-ring`, `pulse-soft`, `fade-in`, `fade-up`.

All respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion()`.

---

## 🔐 Security

- JWT access tokens (15 min) + httpOnly refresh tokens (7 days, rotated on use)
- bcrypt with 12 rounds
- Role-based middleware (`patient | doctor | admin`)
- Rate limiting: 10 req/15 min on auth endpoints, 200 req/15 min globally
- Helmet.js security headers
- CORS restricted to `CLIENT_URL`
- express-validator on every endpoint
- DB transactions for multi-table writes (registration, appointment booking)
- Unique constraint: `(doctorId, appointmentDate, timeSlot)` — prevents double-booking

---

## 🇳🇬 Nigerian Context

- Phone number validation: `+234XXXXXXXXXX` or `0XXXXXXXXXX`
- Currency: ₦ (Nigerian Naira, `Intl.NumberFormat` with `NGN`)
- All 36 states + FCT in dropdowns
- Genotype: AA / AS / SS / AC / SC
- NHIS/HMO number field on patient profile
- Jos addresses in seed data
- WhatsApp floating button with pre-filled message
- 24/7 Emergency phone number banner on every page

---

## 🏗️ Tech Stack

| Layer      | Technology                                           |
|------------|------------------------------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind CSS v3              |
| Animation  | Framer Motion, react-countup, react-intersection-observer |
| Charts     | Recharts                                             |
| Forms      | React Hook Form + Zod                                |
| State      | Zustand (persisted)                                  |
| HTTP       | Axios (auto-refresh interceptor)                     |
| Toasts     | react-hot-toast                                      |
| UI Icons   | lucide-react                                         |
| Backend    | Node.js 18+, Express 4                               |
| ORM        | Sequelize 6 + sequelize-cli                          |
| Database   | PostgreSQL 13+                                       |
| Auth       | JWT (jsonwebtoken), bcryptjs                         |
| Validation | express-validator                                    |
| Security   | helmet, cors, express-rate-limit, cookie-parser      |
| Dev tools  | nodemon, ESLint                                      |

---

## 📝 Running Both Servers

**Terminal 1:**
```bash
cd backend && npm run dev
```

**Terminal 2:**
```bash
cd frontend && npm run dev
```

---

## 🚀 Production Build

```bash
# Backend
cd backend
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
npm start
```

---

*Built with ❤️ for the people of Plateau State, Nigeria.*
# Hospital-Management-System
# Hospital-Management-System
