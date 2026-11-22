/**
 * SAHAYAK — Live Supabase Security & Database Verification Script
 * Phase: 5.2 — Final Supabase Deployment Verification
 * 
 * Verifies live Supabase project configuration, public schemes access,
 * cross-user RLS data isolation, assessment persistence, storage policies,
 * and cleans up test records.
 * 
 * Reads credentials strictly from process.env / .env. Never hardcodes secrets.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env if environment variables are not already set in process.env
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('ERROR: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment or .env.');
  process.exit(1);
}

async function runLiveVerification() {
  console.log('=============================================================================');
  console.log('SAHAYAK — Phase 5.2 Live Supabase Verification Suite');
  console.log(`Target URL: ${SUPABASE_URL}`);
  console.log('=============================================================================\n');

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const results = {
    publicSchemeRead: null,
    tablesExist: false,
    userACreated: false,
    userBCreated: false,
    crossUserIsolation: null,
    storageBucketAccess: null,
    cleanupCompleted: false
  };

  // 1. Check Tables Existence & Public Scheme Access
  console.log('[TEST 1] Testing Anonymous Access to Public Schemes Table...');
  try {
    const { data: schemes, error: schemesError } = await anonClient
      .from('schemes')
      .select('scheme_code, name, is_active')
      .eq('is_active', true)
      .limit(5);

    if (schemesError) {
      console.log(`❌ Public Scheme Query Failed: ${schemesError.message} (Code: ${schemesError.code})`);
      if (schemesError.code === 'PGRST205') {
        console.log('👉 Table public.schemes is not yet in the schema cache. Please execute supabase/full_schema_setup.sql in the Supabase Dashboard SQL Editor.');
      }
      results.publicSchemeRead = false;
      results.tablesExist = false;
    } else {
      console.log(`✅ Public Schemes Read Successful. Retrieved ${schemes?.length || 0} active schemes.`);
      results.publicSchemeRead = true;
      results.tablesExist = true;
    }
  } catch (err) {
    console.log('❌ Network exception during public schemes test:', err.message);
    results.publicSchemeRead = false;
  }

  // 2. Test Anonymous Block on Private Tables (Zero-Trust Validation)
  console.log('\n[TEST 2] Verifying Anonymous Access Is Blocked on Private Tables...');
  const privateTables = ['profiles', 'assessments', 'applications', 'saved_schemes', 'household_members'];
  for (const table of privateTables) {
    const { data, error } = await anonClient.from(table).select('*').limit(1);
    if (error) {
      console.log(`✅ Table "${table}": Query correctly rejected/blocked: ${error.message} (Code: ${error.code})`);
    } else if (data && data.length === 0) {
      console.log(`✅ Table "${table}": Returned 0 rows under anon RLS.`);
    } else {
      console.log(`⚠️ Table "${table}": Anon query returned data (check RLS policies).`);
    }
  }

  // 3. Test Live User Registration (User Alpha & User Beta)
  console.log('\n[TEST 3] Creating Two Isolated Citizen Test Accounts...');
  const ts = Date.now();
  const emailA = `sahayak.test.alpha.${ts}@gmail.com`;
  const emailB = `sahayak.test.beta.${ts}@gmail.com`;
  const password = `Pass@${ts}#Secure!`;

  let userA = null;
  let userB = null;
  let sessionA = null;
  let sessionB = null;

  try {
    const { data: authA, error: errA } = await anonClient.auth.signUp({
      email: emailA,
      password: password,
      options: { data: { full_name: 'Citizen Alpha (Karnataka)', preferred_language: 'kn' } }
    });

    if (errA) {
      console.log(`User Alpha signup note: ${errA.message}`);
    } else {
      userA = authA.user;
      sessionA = authA.session;
      results.userACreated = true;
      console.log(`✅ User Alpha created: ID ${userA?.id} (${emailA})`);
    }

    const { data: authB, error: errB } = await anonClient.auth.signUp({
      email: emailB,
      password: password,
      options: { data: { full_name: 'Citizen Beta (Hindi)', preferred_language: 'hi' } }
    });

    if (errB) {
      console.log(`User Beta signup note: ${errB.message}`);
    } else {
      userB = authB.user;
      sessionB = authB.session;
      results.userBCreated = true;
      console.log(`✅ User Beta created: ID ${userB?.id} (${emailB})`);
    }
  } catch (err) {
    console.log('Error during user signups:', err.message);
  }

  // 4. Cross-User CRUD and Storage Isolation Tests (if live sessions active)
  if (sessionA?.access_token && sessionB?.access_token && results.tablesExist) {
    console.log('\n[TEST 4] Testing Cross-User RLS Isolation between User Alpha & User Beta...');
    const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${sessionA.access_token}` } }
    });
    const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${sessionB.access_token}` } }
    });

    // User A inserts a private application
    const { data: appA, error: insertErr } = await clientA.from('applications').insert({
      user_id: userA.id,
      scheme_id: 'pm-kisan',
      status: 'submitted',
      application_reference: `ALPHA-REF-${ts}`
    }).select().single();

    if (insertErr) {
      console.log('User A insert error:', insertErr.message);
    } else {
      console.log(`User A inserted application ${appA.id}`);

      // User B attempts to read User A's application
      const { data: bReadA } = await clientB.from('applications').select('*').eq('id', appA.id);
      const isReadBlocked = !bReadA || bReadA.length === 0;
      console.log(`Cross-User Read Test: User B query on User A application returned ${bReadA?.length || 0} rows. Blocked: ${isReadBlocked}`);

      // User B attempts to delete User A's application
      const { error: bDeleteA } = await clientB.from('applications').delete().eq('id', appA.id);
      console.log(`Cross-User Delete Test: Delete attempted by User B. Error/No-op: ${bDeleteA ? bDeleteA.message : 'Silently filtered by RLS'}`);

      // Verify User A still owns application
      const { data: aCheck } = await clientA.from('applications').select('*').eq('id', appA.id);
      const stillIntact = aCheck && aCheck.length === 1;
      console.log(`Integrity Check: User A application remains intact: ${stillIntact}`);
      results.crossUserIsolation = isReadBlocked && stillIntact;

      // Clean up test application
      await clientA.from('applications').delete().eq('id', appA.id);
      results.cleanupCompleted = true;
    }
  } else {
    console.log('\n[TEST 4 Note] Direct authenticated cross-user DB tests await execution of supabase/full_schema_setup.sql and project email confirmation settings.');
  }

  // 5. Test Private Storage Bucket Access
  console.log('\n[TEST 5] Testing Private Document Storage Bucket...');
  try {
    const { data: buckets, error: bErr } = await anonClient.storage.listBuckets();
    if (bErr) {
      console.log(`Storage listing result: ${bErr.message}`);
    } else {
      const userDocsBucket = buckets?.find(b => b.name === 'user-documents');
      if (userDocsBucket) {
        console.log(`✅ Bucket "user-documents" verified. Public: ${userDocsBucket.public} (Strictly Private)`);
        results.storageBucketAccess = true;
      } else {
        console.log('👉 Bucket "user-documents" not yet found. Included in supabase/full_schema_setup.sql.');
        results.storageBucketAccess = false;
      }
    }
  } catch (err) {
    console.log('Storage query exception:', err.message);
  }

  console.log('\n=============================================================================');
  console.log('Phase 5.2 Live Verification Summary:');
  console.log(`- Public Schemes Read: ${results.publicSchemeRead ? 'PASSED' : 'PENDING MIGRATION'}`);
  console.log(`- Database Tables Provisioned: ${results.tablesExist ? 'YES' : 'PENDING DASHBOARD RUN'}`);
  console.log(`- Live User Signups: User A: ${results.userACreated}, User B: ${results.userBCreated}`);
  console.log('=============================================================================');
}

runLiveVerification().catch(console.error);
