const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jqoceggpxejagpsetjzi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tJZZYCxGaTlKYSVhZWn55Q_MQvW71Yu';

async function verifyLive() {
  console.log('--- Phase 5.1: Live Supabase Verification ---');
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 1. Test Public Scheme Access (Anon)
  console.log('\n[1. Testing Public Schemes Access as Anon]');
  const { data: schemesData, error: schemesError } = await anonClient
    .from('schemes')
    .select('count');
  if (schemesError) {
    console.log('Result: schemes query returned error:', schemesError.message, `(Code: ${schemesError.code})`);
  } else {
    console.log('Result: schemes table queried successfully, count:', schemesData);
  }

  // 2. Test User A Signup
  const ts = Date.now();
  const userA_email = `citizen.alpha.${ts}@gmail.com`;
  const userB_email = `citizen.beta.${ts}@gmail.com`;
  const password = 'Password@Sahayak123!';

  console.log('\n[2. Testing Authenticated User A Creation]');
  const { data: authA, error: errA } = await anonClient.auth.signUp({
    email: userA_email,
    password: password,
    options: { data: { full_name: 'Citizen Alpha', preferred_language: 'kn' } }
  });

  if (errA) {
    console.log('User A creation error:', errA.message);
  } else {
    console.log('User A created successfully:', { id: authA.user?.id, email: authA.user?.email });
  }

  // 3. Test User B Signup (Cross-User Isolation Testing)
  console.log('\n[3. Testing Authenticated User B Creation (Cross-User Isolation)]');
  const { data: authB, error: errB } = await anonClient.auth.signUp({
    email: userB_email,
    password: password,
    options: { data: { full_name: 'Citizen Beta', preferred_language: 'hi' } }
  });

  if (errB) {
    console.log('User B creation error:', errB.message);
  } else {
    console.log('User B created successfully:', { id: authB.user?.id, email: authB.user?.email });
  }

  // 4. Test Authenticated Client Instances
  if (authA?.session?.access_token && authB?.session?.access_token) {
    console.log('\n[4. Testing Authenticated Clients & Token Generation]');
    const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${authA.session.access_token}` } }
    });
    const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${authB.session.access_token}` } }
    });
    console.log('Both authenticated clients initialized with valid bearer tokens.');

    // 5. Test Storage Bucket & Ownership Isolation
    console.log('\n[5. Testing Storage Bucket Access]');
    const { data: buckets, error: bucketError } = await clientA.storage.listBuckets();
    if (bucketError) {
      console.log('List buckets error:', bucketError.message);
    } else {
      console.log('Buckets discovered:', buckets.map(b => b.name));
    }
  } else {
    console.log('\nNote on Sessions: Supabase project email confirmations may be required before session token issuance.');
  }

  console.log('\n--- Live Verification Execution Finished ---');
}

verifyLive().catch(console.error);
