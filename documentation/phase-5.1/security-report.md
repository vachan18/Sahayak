# SAHAYAK — Phase 5.1 Security Architecture & Permissions Audit
**Phase:** 5.1 — Backend Security, Permissions & Persistence Corrections  
**Product:** SAHAYAK (DS-02 Government Schemes in Your Language)  
**Security Model:** Explicit Least-Privilege Role Grants with Defense-in-Depth RLS

---

## 1. Database Role & Permission Matrix

SAHAYAK enforces strict separation of privileges across three PostgreSQL roles: `anon` (unauthenticated public/guest), `authenticated` (signed-in citizens), and `service_role` (internal automated migrations only).

| Schema Entity | `anon` (Public / Guest) | `authenticated` (Citizen) | `service_role` (Admin Only) | RLS Policy In Effect |
| :--- | :--- | :--- | :--- | :--- |
| `public.schemes` | **SELECT** only | **SELECT** only | **ALL** | Active schemes readable by anyone (`is_active = true`) |
| `public.profiles` | *None* | **SELECT, INSERT, UPDATE, DELETE** | **ALL** | Strictly isolated to `auth.uid() = id` |
| `public.assessments` | *None* | **SELECT, INSERT, UPDATE, DELETE** | **ALL** | Strictly isolated to `auth.uid() = user_id` |
| `public.assessment_results`| *None* | **SELECT, INSERT, UPDATE, DELETE** | **ALL** | Subquery check on parent `assessments.user_id = auth.uid()` |
| `public.saved_schemes` | *None* | **SELECT, INSERT, UPDATE, DELETE** | **ALL** | Strictly isolated to `auth.uid() = user_id` |
| `public.applications` | *None* | **SELECT, INSERT, UPDATE, DELETE** | **ALL** | Strictly isolated to `auth.uid() = user_id` |
| `public.household_members` | *None* | **SELECT, INSERT, UPDATE, DELETE** | **ALL** | Strictly isolated to `auth.uid() = user_id` |

---

## 2. PostgreSQL Least-Privilege Grants

In [supabase/migrations/20261122000005_permissions_and_household.sql](file:///C:/Users/vacha/.gemini/antigravity/scratch/pixel-theory/supabase/migrations/20261122000005_permissions_and_household.sql), explicit grants are applied to ensure that no role possesses more permissions than necessary:

```sql
-- Schema access
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Public schemes catalog: read-only
GRANT SELECT ON public.schemes TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.schemes FROM anon, authenticated;

-- Citizen data tables: authenticated only
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_results TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_schemes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.household_members TO authenticated;
```

---

## 3. Row Level Security (RLS) Specification

Row Level Security is enabled on 100% of tables. Even if a user attempts a raw query, PostgreSQL rejects cross-user access:

### 3.1 Household Members Policy
```sql
CREATE POLICY "Users can manage own household members"
    ON public.household_members
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

### 3.2 Assessment Integrity & Rollback Protection
Parent assessments and individual scheme evaluations are linked via foreign key cascade. When an assessment fails during child result insertion, the parent is immediately deleted to prevent orphaned records or false positive audit states.

### 3.3 Storage Security Contract
- Bucket `user-documents` is strictly private (`public = false`).
- Storage RLS isolates uploads using path convention `(storage.foldername(name))[1] = auth.uid()::text`.
- Ephemeral signed URLs expire after 300 seconds, preventing long-term link leaking.
