# 🚀 Job Board Platform — Full Stack Next.js Project
### Developer: Manikandan M
### Stack: Next.js 16 + TypeScript + Tailwind CSS + Prisma + PostgreSQL + NextAuth

---

## 🎯 Project Overview
A modern job board platform where:
- **Companies** can post jobs
- **Candidates** can browse and apply for jobs
- **Everyone** can search and filter jobs

**Live Reference:** LinkedIn Jobs / Naukri / Indeed

---

## 🎨 UI Design Style
- **Theme:** Dark + Light mode
- **Colors:** Blue (#2563EB) primary, Dark (#0F172A) background
- **Font:** Inter (clean, professional)
- **Style:** Modern, minimal, card-based layout
- **Inspiration:** Linear.app + Vercel dashboard style

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Prisma | Database ORM |
| PostgreSQL | Database |
| NextAuth.js | Authentication |
| Zod | Form validation |
| React Hook Form | Form handling |
| Cloudinary | Company logo upload |
| Vercel | Deployment |

---

## 📁 Project Structure
```
job-board/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          ← Login page
│   │   └── register/
│   │       └── page.tsx          ← Register page
│   ├── (main)/
│   │   ├── layout.tsx            ← Main layout with navbar
│   │   ├── page.tsx              ← Home / Job listings
│   │   ├── jobs/
│   │   │   ├── page.tsx          ← All jobs page
│   │   │   └── [id]/
│   │   │       └── page.tsx      ← Job details page
│   │   ├── companies/
│   │   │   ├── page.tsx          ← All companies
│   │   │   └── [id]/
│   │   │       └── page.tsx      ← Company profile
│   │   └── search/
│   │       └── page.tsx          ← Search results
│   ├── dashboard/
│   │   ├── layout.tsx            ← Dashboard layout (protected)
│   │   ├── page.tsx              ← Dashboard home
│   │   ├── post-job/
│   │   │   └── page.tsx          ← Post new job
│   │   ├── my-jobs/
│   │   │   └── page.tsx          ← Manage posted jobs
│   │   └── applications/
│   │       └── page.tsx          ← View applications
│   ├── profile/
│   │   └── page.tsx              ← User profile
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      ← NextAuth
│   │   ├── jobs/
│   │   │   ├── route.ts          ← GET all jobs, POST new job
│   │   │   └── [id]/
│   │   │       └── route.ts      ← GET, PUT, DELETE job
│   │   ├── applications/
│   │   │   └── route.ts          ← POST application
│   │   └── upload/
│   │       └── route.ts          ← Upload company logo
│   ├── error.tsx
│   ├── loading.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── jobs/
│   │   ├── JobCard.tsx           ← Single job card
│   │   ├── JobList.tsx           ← List of jobs
│   │   ├── JobFilter.tsx         ← Filter sidebar
│   │   ├── JobSearch.tsx         ← Search bar
│   │   └── JobForm.tsx           ← Post/Edit job form
│   └── auth/
│       └── AuthButton.tsx
├── lib/
│   ├── prisma.ts                 ← Prisma client
│   ├── auth.ts                   ← NextAuth config
│   ├── validations.ts            ← Zod schemas
│   └── utils.ts                  ← Helper functions
├── prisma/
│   └── schema.prisma             ← Database schema
├── middleware.ts                 ← Protect dashboard routes
├── .env.local
└── package.json
```

---

## 🗄️ Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  image         String?
  role          Role      @default(CANDIDATE)
  jobs          Job[]
  applications  Application[]
  createdAt     DateTime  @default(now())
}

model Job {
  id           String      @id @default(cuid())
  title        String
  company      String
  logo         String?
  location     String
  type         JobType
  salary       String?
  description  String
  requirements String
  userId       String
  user         User        @relation(fields: [userId], references: [id])
  applications Application[]
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

model Application {
  id        String   @id @default(cuid())
  jobId     String
  userId    String
  job       Job      @relation(fields: [jobId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
  status    Status   @default(PENDING)
  createdAt DateTime @default(now())
}

enum Role {
  CANDIDATE
  EMPLOYER
  ADMIN
}

enum JobType {
  FULL_TIME
  PART_TIME
  CONTRACT
  REMOTE
  INTERNSHIP
}

enum Status {
  PENDING
  REVIEWED
  ACCEPTED
  REJECTED
}
```

---

## 📱 Pages & UI Design

### 1. Home Page `/`
```
┌─────────────────────────────────────────────────┐
│  NAVBAR: Logo | Jobs | Companies | Login/Avatar  │
├─────────────────────────────────────────────────┤
│                                                  │
│         Find Your Dream Job 🚀                   │
│    [Search job title...] [Location] [Search]     │
│    1,234 jobs available                          │
│                                                  │
├─────────────────────────────────────────────────┤
│  Featured Jobs                    View All →     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Job Card │ │ Job Card │ │ Job Card │        │
│  └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────┤
│  Browse by Category                              │
│  [Engineering] [Design] [Marketing] [Finance]   │
├─────────────────────────────────────────────────┤
│  Top Companies Hiring                            │
│  [Logo] [Logo] [Logo] [Logo] [Logo]             │
└─────────────────────────────────────────────────┘
```

### 2. Jobs Page `/jobs`
```
┌─────────────────────────────────────────────────┐
│  NAVBAR                                          │
├──────────────┬──────────────────────────────────┤
│   FILTERS    │  JOBS LIST                        │
│              │                                   │
│  Job Type    │  ┌─────────────────────────────┐ │
│  □ Full Time │  │ 🏢 Google                   │ │
│  □ Remote    │  │ Senior React Developer       │ │
│  □ Part Time │  │ 📍 Remote  💰 $120k-150k    │ │
│              │  │ [Full Time] [React] [Senior] │ │
│  Location    │  │              Apply Now →     │ │
│  □ Remote    │  └─────────────────────────────┘ │
│  □ Bangalore │                                   │
│  □ Chennai   │  ┌─────────────────────────────┐ │
│              │  │ 🏢 Microsoft                │ │
│  Salary      │  │ Frontend Engineer            │ │
│  □ 0-5 LPA   │  │ 📍 Bangalore  💰 $80k-100k  │ │
│  □ 5-10 LPA  │  │ [Full Time] [Vue] [Mid]     │ │
│  □ 10+ LPA   │  │              Apply Now →     │ │
│              │  └─────────────────────────────┘ │
└──────────────┴──────────────────────────────────┘
```

### 3. Job Details `/jobs/[id]`
```
┌─────────────────────────────────────────────────┐
│  NAVBAR                                          │
├─────────────────────────────────────────────────┤
│  ← Back to Jobs                                  │
│                                                  │
│  🏢 [Company Logo]  Google                       │
│  Senior React Developer                          │
│  📍 Remote  |  💰 $120k-150k  |  ⏰ Full Time   │
│  Posted 2 days ago                               │
│                          [Apply Now] [Save Job]  │
├─────────────────────────────────────────────────┤
│  About the Role          │  Job Overview         │
│                          │  ─────────────        │
│  We are looking for...   │  Experience: 3+ years │
│                          │  Type: Full Time      │
│  Requirements:           │  Location: Remote     │
│  • 3+ years React        │  Salary: $120k-150k   │
│  • TypeScript            │  Posted: 2 days ago   │
│  • Next.js               │                       │
│                          │  About Company        │
│  Nice to have:           │  ─────────────        │
│  • GraphQL               │  Google is...         │
│  • AWS                   │                       │
└──────────────────────────┴───────────────────────┘
```

### 4. Dashboard `/dashboard`
```
┌─────────────────────────────────────────────────┐
│  NAVBAR                                          │
├──────────────┬──────────────────────────────────┤
│  SIDEBAR     │  DASHBOARD                        │
│              │                                   │
│  📊 Overview │  ┌────────┐ ┌────────┐ ┌───────┐ │
│  💼 My Jobs  │  │ 12     │ │ 48     │ │ 5     │ │
│  📝 Post Job │  │ Jobs   │ │ Apps   │ │ Hired │ │
│  👥 Apps     │  └────────┘ └────────┘ └───────┘ │
│  ⚙️ Settings │                                   │
│              │  Recent Applications              │
│              │  ┌─────────────────────────────┐ │
│              │  │ John → React Developer      │ │
│              │  │ Status: Pending  [Review]   │ │
│              │  └─────────────────────────────┘ │
└──────────────┴──────────────────────────────────┘
```

### 5. Post Job `/dashboard/post-job`
```
┌─────────────────────────────────────────────────┐
│  Post a New Job                                  │
├─────────────────────────────────────────────────┤
│  Job Title *          [Senior React Developer  ] │
│  Company Name *       [Google                  ] │
│  Company Logo         [Upload Image            ] │
│  Location *           [Remote / City           ] │
│  Job Type *           [Full Time ▼             ] │
│  Salary Range         [$120,000 - $150,000     ] │
│  Job Description *    [Rich text editor...     ] │
│  Requirements *       [• 3+ years React...     ] │
│                                                  │
│                    [Cancel]  [Post Job →]        │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Development Phases

### Phase 1 — Project Setup (Day 1)
- [ ] Create Next.js project with TypeScript
- [ ] Setup Tailwind CSS
- [ ] Setup Prisma + PostgreSQL
- [ ] Setup NextAuth
- [ ] Create `.env.local`
- [ ] Setup folder structure

### Phase 2 — Database & Auth (Day 2)
- [ ] Write Prisma schema
- [ ] Run migrations
- [ ] Setup NextAuth with Google + Credentials
- [ ] Create login/register pages
- [ ] Setup middleware for protected routes

### Phase 3 — Core UI Components (Day 3)
- [ ] Navbar component
- [ ] Footer component
- [ ] Button, Input, Badge, Card UI components
- [ ] JobCard component
- [ ] Loading skeletons

### Phase 4 — Home & Jobs Pages (Day 4)
- [ ] Home page with hero section
- [ ] Jobs listing page
- [ ] Job filter sidebar
- [ ] Search functionality
- [ ] Job details page

### Phase 5 — Dashboard (Day 5)
- [ ] Dashboard layout with sidebar
- [ ] Post job form (React Hook Form + Zod)
- [ ] My jobs page
- [ ] Applications management

### Phase 6 — API Routes (Day 6)
- [ ] GET /api/jobs
- [ ] POST /api/jobs
- [ ] PUT /api/jobs/[id]
- [ ] DELETE /api/jobs/[id]
- [ ] POST /api/applications

### Phase 7 — Polish & Deploy (Day 7)
- [ ] Dark/Light mode
- [ ] Loading states
- [ ] Error handling
- [ ] Deploy to Vercel
- [ ] Connect PostgreSQL (Neon.tech free)

---

## 🔑 Environment Variables
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 📚 New Concepts You'll Learn

| Concept | Where |
|---|---|
| Prisma ORM | database operations |
| PostgreSQL | storing jobs/users |
| Server Actions | post job form |
| React Hook Form | all forms |
| Zod validation | form validation |
| Cloudinary upload | company logo |
| Deployment | Vercel + Neon DB |

---

## 🎯 Interview Talking Points After This Project

- "I built a full stack job board with Next.js and PostgreSQL"
- "I used Prisma ORM for database operations"
- "I implemented authentication with NextAuth including Google OAuth"
- "I used Server Actions for form submissions"
- "I deployed on Vercel with Neon PostgreSQL"
- "I implemented ISR for job listings for better performance"

---

## 📞 Contact
- Email: manikandan6382.dev@gmail.com
- LinkedIn: https://www.linkedin.com/in/mani-kandan-ui
- GitHub: https://github.com/manikandan6382

---
**Start Date:** Today 🚀
**Target:** 7 Days
**Goal:** Interview Ready Project ✅
