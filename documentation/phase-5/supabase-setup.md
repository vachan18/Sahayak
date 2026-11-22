# SAHAYAK — Supabase Integration & Setup Guide
**Phase:** 5 — Supabase Backend Integration  
**Product:** SAHAYAK (DS-02 Government Schemes in Your Language)  
**Database:** PostgreSQL 15+ (Supabase)  
**SDK:** `@supabase/supabase-js` v2.49+

---

## 1. Prerequisites

- Node.js 18+ and npm
- A free or enterprise Supabase account ([supabase.com](https://supabase.com)) or a local Supabase CLI installation (`npx supabase init`)
- Git repository clone of `pixel-theory`

---

## 2. Environment Configuration

### 2.1 File Location
Create a `.env` file in the project root directory:
```bash
cp .env.example .env
```

### 2.2 Required Environment Variables
The application strictly reads frontend environment variables prefixed with `VITE_`.

```dotenv
# Supabase Project Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here

# Storage Bucket Configuration
VITE_SUPABASE_STORAGE_BUCKET=user-documents
```

> [!CAUTION]
> **Zero Service-Role Key Policy**: NEVER place `SUPABASE_SERVICE_ROLE_KEY` in frontend code, `.env`, or repository commits. The frontend operates solely with the public anonymous key (`VITE_SUPABASE_ANON_KEY`), protected by PostgreSQL Row-Level Security (RLS).

---

## 3. Database Migration Execution

All migrations are located in the `supabase/migrations/` directory and must be executed in numerical sequence:

| Migration File | Description |
| :--- | :--- |
| `20261122000001_initial_schema.sql` | Creates tables (`profiles`, `schemes`, `assessments`, `assessment_results`, `saved_schemes`, `applications`), UUID extensions, foreign keys, triggers, and the `handle_new_user()` automation. |
| `20261122000002_rls_policies.sql` | Establishes zero-trust Row Level Security (RLS) policies on all tables, isolating citizen data by `auth.uid()`. |
| `20261122000003_storage_bucket.sql` | Initializes the private `user-documents` storage bucket, restricts file sizes to 5MB, whitelists PDF/JPEG/PNG, and applies folder-isolated storage RLS policies. |
| `20261122000004_seed_schemes.sql` | Seeds the 7 verified national and state schemes with verified JSONB eligibility rules and benefit structures. |

### 3.1 Applying Migrations via Supabase CLI (Recommended)
```bash
# Link project to cloud instance
npx supabase link --project-ref <your-project-id>

# Push migrations to database
npx supabase db push
```

### 3.2 Applying Migrations via Supabase Dashboard SQL Editor
Alternatively, open the [Supabase Dashboard](https://supabase.com/dashboard) -> Select Project -> **SQL Editor** -> Paste and run each file in sequence:
1. `20261122000001_initial_schema.sql`
2. `20261122000002_rls_policies.sql`
3. `20261122000003_storage_bucket.sql`
4. `20261122000004_seed_schemes.sql`

---

## 4. Verification & Seed Data Inspection

After migration execution, run the following SQL query to verify table creation and seed data:

```sql
SELECT 
  scheme_code, 
  name, 
  department, 
  category, 
  is_active 
FROM public.schemes 
ORDER BY scheme_code;
```

**Expected Seeded Schemes (7 Verified Schemes):**
1. `pm-kisan` (PM-KISAN Samman Nidhi)
2. `pm-jay` (Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana)
3. `pmmvy` (Pradhan Mantri Matru Vandana Yojana)
4. `pm-svanidhi` (PM SVANidhi Micro-Credit Scheme)
5. `post-matric-scholarship` (Post-Matric Scholarship for SC/ST Students - Karnataka)
6. `post-matric-scholarship-minority` (Post-Matric Scholarship for Minorities - Karnataka)
7. `pm-kcc` (Kisan Credit Card Scheme)

---

## 5. Sovereign Guest Mode Fallback

SAHAYAK is designed specifically for public kiosks (Gram One, CSC centers) and rural citizens who may not have email accounts. 

When `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are empty or placeholder values:
- The system automatically detects `isSupabaseConfigured() === false`.
- Full application functionality (Kannada/Hindi/English discovery, multilingual voice synthesis, offline eligibility evaluation, and document readiness checklist) continues to function seamlessly in **Sovereign Guest Mode**.
- Zero crashes, zero network blocking, zero forced login gates.
