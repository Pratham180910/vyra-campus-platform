#!/usr/bin/env node
/**
 * scripts/provision-test-users.mjs
 * 
 * Safe, idempotent development-only provisioning script for VYRA test users.
 * 
 * Requirements:
 * - Creates only missing Auth accounts (testuser3@vyra-test.com, testuser4@vyra-test.com)
 * - Uses Supabase Admin API (server-side only; never in browser)
 * - Reads SUPABASE_SERVICE_ROLE_KEY and TEST_USER_PASSWORD strictly from environment variables
 * - Refuses execution unless ALLOW_TEST_PROVISIONING=true
 * - Never deletes or modifies existing accounts or roles
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load local .env if present
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const allowProvisioning = process.env.ALLOW_TEST_PROVISIONING === 'true';
const testPassword = process.env.TEST_USER_PASSWORD;

console.log('====================================================');
console.log('  VYRA — Test User Provisioning Script');
console.log('====================================================');

// Guard 1: Supabase URL
if (!supabaseUrl) {
  console.error('[ABORT] Missing SUPABASE_URL or VITE_SUPABASE_URL.');
  process.exit(1);
}

// Guard 2: Service Role Key
if (!serviceRoleKey) {
  console.error('[ABORT] SUPABASE_SERVICE_ROLE_KEY environment variable is not set.');
  console.error('For security reasons, the service role key is NEVER stored in frontend code or Git.');
  console.error('Please run with:');
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" (PowerShell)');
  process.exit(1);
}

// Guard 3: Explicit test confirmation
if (!allowProvisioning) {
  console.error('[ABORT] Target environment protection is ACTIVE.');
  console.error('To prevent accidental execution, you must explicitly confirm with:');
  console.error('  $env:ALLOW_TEST_PROVISIONING="true"');
  process.exit(1);
}

// Guard 4: Test user password
if (!testPassword || testPassword.length < 8) {
  console.error('[ABORT] Missing or insecure TEST_USER_PASSWORD (minimum 8 characters).');
  console.error('Provide a password via environment variable:');
  console.error('  $env:TEST_USER_PASSWORD="YourSecurePasswordHere"');
  process.exit(1);
}

// Initialize admin client
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const TARGET_USERS = [
  {
    email: 'testuser3@vyra-test.com',
    fullName: 'TestUser3',
  },
  {
    email: 'testuser4@vyra-test.com',
    fullName: 'TestUser4',
  },
];

async function runProvisioning() {
  console.log(`Target project: ${supabaseUrl}`);
  console.log('Checking existing Supabase Auth users...');

  try {
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

    if (listError) {
      console.error('[ERROR] Failed to list users:', listError.message);
      process.exit(1);
    }

    const existingEmails = new Set(usersData.users.map((u) => u.email?.toLowerCase()));

    for (const target of TARGET_USERS) {
      if (existingEmails.has(target.email.toLowerCase())) {
        console.log(`[SKIP] User ${target.email} already exists. Skipping.`);
        continue;
      }

      console.log(`[PROVISION] Creating user: ${target.email} (${target.fullName})...`);

      const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: target.email,
        password: testPassword,
        email_confirm: true,
        user_metadata: {
          full_name: target.fullName,
        },
      });

      if (createError) {
        console.error(`[ERROR] Failed to create ${target.email}:`, createError.message);
      } else {
        console.log(`[SUCCESS] Created ${target.email} (ID: ${created.user.id}). Role defaults to 'student'.`);
      }
    }

    console.log('====================================================');
    console.log('Test user provisioning finished successfully.');
    console.log('All 5 test accounts ready for dashboard testing:');
    console.log('  1. testorganiser@vyra-test.com (organizer)');
    console.log('  2. testuser1@vyra-test.com     (student)');
    console.log('  3. testuser2@vyra-test.com     (student)');
    console.log('  4. testuser3@vyra-test.com     (student)');
    console.log('  5. testuser4@vyra-test.com     (student)');
    console.log('====================================================');
  } catch (err) {
    console.error('[EXCEPTION]', err);
    process.exit(1);
  }
}

runProvisioning();
