# Heritage Guard: Smart Tourism & Heritage Site Crowd Management System

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20RLS-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

An enterprise-grade, full-stack smart tourism platform designed to protect historical monuments (such as the Taj Mahal, Red Fort, Amer Fort, Qutub Minar, Hawa Mahal, India Gate, Ajanta Caves, and Ellora Caves) while delivering a serene, crowd-managed experience for domestic and international travelers.

---

## 🏛️ Project Overview & Problem Statement

Unregulated tourism footfalls accelerate microscopic stone abrasions, destabilize fragile microclimates inside rock-cut sanctuaries, and cause 60+ minute bottleneck queues in extreme weather. 

**Heritage Guard** addresses this challenge through:
- **Intelligent Crowd Telemetry:** Real-time density classification (`Low`, `Moderate`, `High`, `Very High`) and hourly predictive flow models.
- **Capacity-Governed Time Slots:** Smoothes daily arrivals across morning, midday, and golden hour windows.
- **Architectural & Conservation Education:** Detailed structural chronology, engineering features, and official guidelines.
- **Digital Reservation Passes:** Instant ticket vouchers with unique booking reference numbers, eliminating on-site ticketing queues.
- **Administrative Governance Console:** Role-based access control to update monument tariffs, override crowd levels, and audit reservation logs.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router, Server-Side Rendering, Static Site Generation for destination guides)
- **Frontend Engine:** React 19, TypeScript
- **Styling & UI:** Tailwind CSS v4, Lucide React Icons, Custom Glassmorphic design tokens (sandstone beige, warm ivory, deep navy, and gold accents)
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) policies and trigger-based user profiles
- **SEO & Structured Data:** Next.js Metadata API, Dynamic Open Graph cards, XML Sitemap, Robots.txt, JSON-LD (`TouristAttraction`, `Place`, `BreadcrumbList`, `Organization`, `WebSite`)

---

## 📂 Project Architecture

```text
heritage-crowd-management/
│
├── public/                     # Static assets, icons, and heritage images
│
├── src/
│   ├── app/
│   │   ├── (main)/             # Public glassmorphic routes
│   │   │   ├── layout.tsx      # Main layout with glass navbar & footer
│   │   │   ├── page.tsx        # Impressive 14-section homepage
│   │   │   ├── destinations/   # Discovery & search explorer
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/     # Dynamic destination guides with JSON-LD
│   │   │   ├── crowd-status/   # Dedicated crowd telemetry dashboard
│   │   │   ├── tickets/        # Capacity-governed time slot reservation form
│   │   │   ├── about/          # Conservation & smart tourism manifesto
│   │   │   └── contact/        # Official grievances & inquiry form
│   │   │
│   │   ├── (auth)/             # Supabase authentication routes
│   │   │   ├── layout.tsx
│   │   │   ├── login/          # Sign-in with password & quick demo trigger
│   │   │   └── register/       # Registration with profile auto-trigger
│   │   │
│   │   ├── dashboard/          # Protected user explorer portal
│   │   │   └── page.tsx        # Active passes, visit history, saved sites
│   │   │
│   │   ├── admin/              # Role-protected administration console
│   │   │   └── page.tsx        # Monument CRUD, crowd overrides, visitor logs
│   │   │
│   │   ├── api/                # Next.js Route Handlers
│   │   │   ├── destinations/   # Destination query & mutations
│   │   │   ├── crowd/          # Telemetry & crowd override
│   │   │   ├── bookings/       # Ticket generation & status updates
│   │   │   └── contact/        # Grievance ingestion
│   │   │
│   │   ├── sitemap.ts          # Dynamic XML sitemap generator
│   │   ├── robots.ts           # Robots.txt with crawling rules
│   │   ├── layout.tsx          # Root HTML layout & font definitions
│   │   └── globals.css         # Glassmorphism utilities & color palette
│   │
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, Breadcrumbs
│   │   ├── destinations/       # DestinationCard, Filters, Explorer
│   │   ├── crowd/              # CrowdStatusBadge, CrowdChart, SimulatedNotice
│   │   ├── booking/            # TicketBookingForm
│   │   ├── dashboard/          # UserProfileCard, BookingHistoryList
│   │   ├── admin/              # AdminStatsCards, DestinationManager, BookingsTable
│   │   └── ui/                 # GlassCard, Button
│   │
│   ├── lib/
│   │   ├── supabase/           # Browser & server Supabase SSR clients
│   │   └── utils/              # cn, formatters, seoMetadata generators
│   │
│   ├── services/               # Data queries, mutations & fallback state
│   │   ├── destinationQueries.ts
│   │   ├── crowdQueries.ts
│   │   ├── bookingActions.ts
│   │   └── contactActions.ts
│   │
│   ├── types/                  # TypeScript domain models & database interfaces
│   └── config/                 # Site configuration, helplines & navigation links
│
├── supabase/
│   ├── migrations/
│   │   └── 20260101000000_create_heritage_schema.sql # 10 tables + RLS + triggers
│   └── seed.sql                # Complete sample dataset for 8 iconic heritage sites
│
├── scripts/
│   └── test-system.mjs         # Automated 44-point QA system verification script
│
├── .env.example                # Environment configuration template
├── next.config.ts              # Next.js 16 image optimization & Turbopack config
└── package.json
```

---

## 🗄️ Database Architecture & Supabase Schema

The PostgreSQL schema is partitioned into 10 relational tables:

1. `profiles`: User information linked with `auth.users`, role (`visitor`, `admin`, `staff`).
2. `destinations`: Full destination records (slug, description, architectural background, timings, guidelines, base price, crowd levels).
3. `destination_images`: Multi-view gallery photographs with primary flags and captions.
4. `ticket_categories`: Tiered pricing (Indian Citizen, Foreign Tourist, SAARC Citizen, Child/Student).
5. `visiting_time_slots`: Capacity-governed arrival windows with expected crowd ratings.
6. `bookings`: Master reservations with reference codes (`HG-2026-XXXXX`), total visitors, and total amounts.
7. `booking_visitors`: Individual visitor roster with name, age, category, and ID proof type.
8. `crowd_reports`: Historical crowd telemetry, wait times, gate throughput, and sensor simulation metadata.
9. `saved_destinations`: User-curated destination bookmarks.
10. `contact_messages`: Grievance and academic inquiry logs.

### Row Level Security (RLS) Policies
- **Public Read Access:** Monuments, galleries, time slots, tariffs, and crowd reports are openly queryable.
- **Owner-Restricted Access:** Users can only view and update their own profiles, bookings, and saved bookmarks.
- **Administrator Elevation:** Only users with `role = 'admin'` can alter destination details, modify time slot capacities, or update crowd telemetry overrides.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v20.x` or higher (Tested on Node `v25.9.0`)
- npm `v10.x` or higher

### 2. Installation
```bash
git clone <repository-url>
cd nextproject
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
> **Note on Zero-Configuration Demo Mode:** If Supabase credentials are not yet configured, the system seamlessly operates on its built-in in-memory state layer. All 8 heritage monuments, search filters, booking generation, user dashboard passes, and admin overrides work 100% out of the box!

### 4. Database Setup (Supabase)
Run the migration and seed scripts in your Supabase SQL Editor:
1. Copy and execute `supabase/migrations/20260101000000_create_heritage_schema.sql`
2. Copy and execute `supabase/seed.sql`

### 5. Running the Application
```bash
# Development mode
npm run dev

# Production build & verification
npm run build
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Assurance

Run the automated system integrity test suite:
```bash
node scripts/test-system.mjs
```
**Verification Scope:**
- 44/44 automated assertions passing.
- Validates all 10 PostgreSQL table definitions and RLS policy configurations.
- Validates seed data for all 8 heritage monuments.
- Verifies dynamic XML sitemap and robots.txt generation.
- Confirms all 11 application routes compile without TypeScript or lint warnings.

---

## 🔍 SEO & Web Vitals Implementation Summary

- **Semantic HTML & Heading Hierarchy:** Every page utilizes strict semantic landmarks (`<header>`, `<main>`, `<nav>`, `<article>`, `<section>`, `<footer>`) with structured `h1` through `h4` hierarchy.
- **Dynamic Next.js Metadata:** Unique, keyword-optimized titles, descriptions, and Open Graph cards for every destination.
- **Structured Data (JSON-LD):**
  - `TouristAttraction` & `Place` schema on monument pages with geo-coordinates, opening hours, and fee flags.
  - `BreadcrumbList` schema for clear search engine crawling trails.
  - `WebSite` schema with integrated `SearchAction`.
  - `Organization` schema representing the Heritage Directorate.
- **Dynamic XML Sitemap:** Automatically incorporates static routes and all dynamic `/destinations/[slug]` URLs.
- **Image Optimization:** All heritage imagery utilizes Next.js `<Image>` with explicit aspect ratios, priority flags for hero visuals, and modern WebP/AVIF compression.

---

## 🌐 Deployment to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project in your [Vercel Dashboard](https://vercel.com).
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. Click **Deploy**. Next.js App Router will automatically pre-render static destination guides (SSG) and deploy edge route handlers.
