# SAHAYAK — Security Architecture & Row Level Security (RLS) Specification
**Phase:** 5 — Supabase Backend Integration  
**Product:** SAHAYAK (DS-02 Government Schemes in Your Language)  
**Security Model:** Zero-Trust Client Architecture with Defense-in-Depth

---

## 1. Zero-Trust Security Philosophy

In civic tech and public welfare discovery, user trust and data privacy are paramount. Citizens frequently access government discovery platforms from shared community kiosks (CSC, Gram One centers) or low-cost shared mobile devices. 

SAHAYAK adheres to five foundational security mandates:
1. **Zero Client Trust**: The frontend client bundle is treated as untrusted. No administrative authority or bypass keys are ever present in client code.
2. **Mandatory Row Level Security (RLS)**: PostgreSQL RLS is enabled on 100% of public database tables. Unauthenticated and cross-user data access is blocked at the database engine level.
3. **No Direct Public URLs for Documents**: All citizen verification documents are stored in a private bucket (`public = false`) and accessed solely through short-lived signed URLs (expiring in 300 seconds).
4. **Zero Raw PII Persistence**: Aadhaar numbers and bank account numbers are never stored in plain text or database tables.
5. **Strict Multi-Factor Storage Isolation**: Storage object paths enforce `{auth.uid()}/{doc_type}-{timestamp}.{ext}` folder ownership.

---

## 2. Table-by-Table RLS Policy Breakdown

Row Level Security is enabled on all tables via `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`.

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
```

### 2.1 `public.profiles`
- **Read (SELECT)**: `auth.uid() = id` (Citizens can only inspect their own profile).
- **Insert (INSERT)**: Handled by trusted database trigger `on_auth_user_created` (`SECURITY DEFINER`) or `auth.uid() = id`.
- **Update (UPDATE)**: `auth.uid() = id` with check `auth.uid() = id`.
- **Delete (DELETE)**: `auth.uid() = id`.

### 2.2 `public.schemes`
- **Read (SELECT)**: `is_active = true` (Public read-only catalog accessible to all citizens, including guests).
- **Mutations (INSERT, UPDATE, DELETE)**: Disallowed for all client sessions. Only backend administrators with migration access or service-role can modify schemes.

### 2.3 `public.assessments`
- **Read (SELECT)**: `auth.uid() = user_id` (Citizens can only query assessments they conducted).
- **Insert (INSERT)**: `user_id IS NULL OR auth.uid() = user_id` (Allows authenticated persistence as well as anonymous submissions).
- **Update / Delete**: Restricted to `auth.uid() = user_id`.

### 2.4 `public.assessment_results`
- **Read (SELECT)**: Bound to parent assessment ownership via subquery:
  ```sql
  EXISTS (
    SELECT 1 FROM public.assessments
    WHERE assessments.id = assessment_results.assessment_id
      AND assessments.user_id = auth.uid()
  )
  ```
- **Insert (INSERT)**: Allowed when parent assessment is owned by `auth.uid()` or is anonymous.

### 2.5 `public.saved_schemes` (Bookmarks)
- **Read (SELECT)**: `auth.uid() = user_id`.
- **Insert (INSERT)**: `auth.uid() = user_id`.
- **Delete (DELETE)**: `auth.uid() = user_id`.

### 2.6 `public.applications` (Application Tracking)
- **Read (SELECT)**: `auth.uid() = user_id`.
- **Insert (INSERT)**: `auth.uid() = user_id`.
- **Update (UPDATE)**: `auth.uid() = user_id`.

---

## 3. Storage Security & Document Isolation

### 3.1 Private Bucket Definition
The storage bucket `user-documents` is strictly configured with `public = false`.

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-documents',
  'user-documents',
  false,
  5242880, -- 5MB Statutory Limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
);
```

### 3.2 Storage RLS Policies
Storage policies isolate files using folder paths corresponding to the citizen's authenticated `auth.uid()`:

1. **Upload Policy (`storage.objects` INSERT)**:
   ```sql
   CREATE POLICY "Citizens can upload to own isolated directory"
   ON storage.objects FOR INSERT TO authenticated
   WITH CHECK (
     bucket_id = 'user-documents' 
     AND (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

2. **Read Policy (`storage.objects` SELECT)**:
   ```sql
   CREATE POLICY "Citizens can access only own uploaded documents"
   ON storage.objects FOR SELECT TO authenticated
   USING (
     bucket_id = 'user-documents' 
     AND (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

3. **Delete Policy (`storage.objects` DELETE)**:
   ```sql
   CREATE POLICY "Citizens can delete own documents"
   ON storage.objects FOR DELETE TO authenticated
   USING (
     bucket_id = 'user-documents' 
     AND (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

### 3.3 Ephemeral Signed URLs
Files cannot be downloaded or viewed via static URLs. The application issues signed URLs with a strict 300-second (5 minute) Time-To-Live (TTL):
```typescript
const { data } = await supabase.storage
  .from('user-documents')
  .createSignedUrl(filePath, 300);
```

---

## 4. Exclusion of Service-Role Key

The service-role key (`SUPABASE_SERVICE_ROLE_KEY`) bypasses all Row Level Security policies.
- It is **never** embedded in `.env`, `.env.example`, client bundles, or frontend code.
- Frontend bundles strictly use `VITE_SUPABASE_ANON_KEY`, ensuring every query is executed under PostgreSQL RLS constraints.
- Automated Vitest tests verify that `VITE_SUPABASE_SERVICE_ROLE_KEY` is undefined in the client environment.
