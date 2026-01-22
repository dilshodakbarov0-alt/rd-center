# R&D Center

Production-ready web app for construction material R&D (mixes/panels) with Supabase-backed data, AI-powered project generation, and bilingual UI (RU / UZ Cyrillic).

## Features
- Next.js 14 App Router + TypeScript + Tailwind CSS.
- Supabase Auth + Postgres + Storage (`rd-docs`, `rd-images`).
- RU / UZ (Cyrillic) UI with language switcher and database-driven translations fallback to JSON.
- Project workflow: generate Eco/Standard/Pro variants, validate with Gemini, DOE planning, QC/SOP generation, PDF export placeholders.
- Quality & safety rules enforced server-side with Zod validation.

---

## 1) Prerequisites
- Node.js 18+
- Supabase project (free tier is ok)
- OpenAI API key
- Google Gemini API key

---

## 2) Local Setup (Step-by-step)

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Configure environment variables
Copy the example file and fill values:
```bash
cp .env.example .env.local
```

Required values:
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> **Tip:** `NEXT_PUBLIC_*` can be the same values as `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

### Step 3 — Configure Supabase database
1. Open Supabase Dashboard → SQL Editor.
2. Run the migration in: `supabase/migrations/001_init.sql`.
3. (Optional) Run seed data: `supabase/seed/seed.sql`.

### Step 4 — Configure Supabase Auth
1. Supabase Dashboard → Authentication → Providers.
2. Enable **Email** provider.
3. (Optional) Configure magic link or external providers later.

### Step 5 — Run the app
```bash
npm run dev
```
Open http://localhost:3000

---

## 3) Supabase Storage Setup
The migration creates two buckets:
- `rd-docs` (private) — PDF exports (SOP/QC/Passport)
- `rd-images` (public) — generated variant images

Add storage policies in Supabase Dashboard if you want public read or user-scoped access.

---

## 4) API Endpoints
All endpoints are in `/src/app/api`.

### OpenAI Structured Output
- `POST /api/openai/generate-project`
- `POST /api/openai/generate-qc`
- `POST /api/openai/generate-sop`

These endpoints pass JSON schema for strict output:
- **MaterialProjectV1**
- **QCPlanV1**
- **SOPDocV1**

### Gemini Validation
- `POST /api/gemini/validate`

### DOE
- `POST /api/doe/generate` (default 12 runs)
- `POST /api/doe/next-best`

### Images
- `POST /api/openai/generate-images`

---

## 5) Quality & Safety Rules
Implemented in `src/lib/quality.ts`:
- If `constraints.eps_policy = forbidden`, EPS components are blocked.
- For **ceiling mixes**:
  - W/G outside **0.34–0.42** → **block**
  - RDP < **1.0%** → **warn**
  - Rheology < **0.10%** → **warn** (high risk slip)
  - WaterRetention < **0.06%** → **warn**
  - Adhesion pull-off below minimum (default **0.40 MPa**) → **block**

---

## 6) Vercel Deployment

### Step 1 — Push repo to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your_repo_url>
git push -u origin main
```

### Step 2 — Create Vercel Project
1. Go to https://vercel.com and click **New Project**.
2. Import your GitHub repo.
3. Add environment variables from `.env.local` in Vercel UI.
4. Deploy.

---

## 7) Supabase SQL Migration Reference
- `supabase/migrations/001_init.sql` — schema + RLS + buckets.
- `supabase/seed/seed.sql` — sample project (Basalt-GypLight Mix).

---

## 8) Folder Structure
```
src/
  app/
  components/
  data/
  lib/
```

---

## 9) Notes for Non-Programmers
- **If something fails**: verify `.env.local` keys and Supabase SQL migrations.
- **Translations**: you can add/edit translations in the `translations` table in Supabase.
- **Images/PDFs**: use the API endpoints to generate and store in Supabase Storage buckets.

---

## 10) License
MIT
