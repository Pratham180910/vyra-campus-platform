#!/usr/bin/env node
/**
 * scripts/seed-test-data.mjs
 * 
 * Safe, idempotent test-data seeding script for VYRA.
 * 
 * Features:
 * - Creates 5 recognizable test campus events owned by TestOrganiser
 * - Creates realistic registrations across test students
 * - Creates saved events for test students
 * - Creates gate check-in attendance records for realistic analytics
 * - Automatically triggers database notifications via Postgres triggers
 * - Non-destructive (safe upserts / skip existing; never deletes records)
 * - Requires explicit ALLOW_TEST_SEEDING="true" environment confirmation
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
const allowSeeding = process.env.ALLOW_TEST_SEEDING === 'true';

console.log('====================================================');
console.log('  VYRA — Test Event & Registration Seeding');
console.log('====================================================');

if (!supabaseUrl) {
  console.error('[ABORT] Missing SUPABASE_URL.');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('[ABORT] SUPABASE_SERVICE_ROLE_KEY environment variable is not set.');
  console.error('Run with:');
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" (PowerShell)');
  process.exit(1);
}

if (!allowSeeding) {
  console.error('[ABORT] Production guard ACTIVE.');
  console.error('To confirm seeding of non-destructive test records, specify:');
  console.error('  $env:ALLOW_TEST_SEEDING="true"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const TEST_EVENTS = [
  {
    id: 'vyra-tech-summit-2026',
    slug: 'vyra-tech-summit-2026',
    title: 'VYRA Tech Summit',
    subtitle: 'Annual SRM Institute of Science & Technology Campus Keynote',
    description: 'Join industry visionaries, alumni founders, and student innovators for keynotes, workshops, and rapid prototyping tracks across AI, Web3, and hardware engineering.',
    category: 'Tech',
    event_type: 'Free',
    date: '2026-10-28',
    start_time: '09:30 AM',
    end_time: '05:00 PM',
    venue: 'Dr. T.P. Ganesan Auditorium',
    capacity: 500,
    cover_image: '/images/events/hacksrm.jpg',
    status: 'published',
    tags: ['tech', 'keynote', 'summit', 'vyra-seeded'],
  },
  {
    id: 'campus-hackathon-2026',
    slug: 'campus-hackathon-2026',
    title: 'Campus Hackathon',
    subtitle: '36-Hour Continuous BuildSprint & Demo Day',
    description: 'Build real-world solutions under 36 hours. Mentors from top tech enterprises will be present for debugging, architecture reviews, and pitch coaching.',
    category: 'Hackathons',
    event_type: 'Free',
    date: '2026-11-05',
    start_time: '10:00 AM',
    end_time: '10:00 PM',
    venue: 'Tech Park Floor 3 Innovation Hub',
    capacity: 250,
    cover_image: '/images/events/hacksrm.jpg',
    status: 'published',
    tags: ['hackathon', 'buidl', 'code', 'vyra-seeded'],
  },
  {
    id: 'ai-innovation-workshop-2026',
    slug: 'ai-innovation-workshop-2026',
    title: 'AI Innovation Workshop',
    subtitle: 'Hands-on Autonomous Agents & Fine-Tuning Session',
    description: 'Deep dive into state-of-the-art transformer architectures, agentic workflows, and local LLM deployment with NVIDIA workstation access.',
    category: 'Workshops',
    event_type: 'Free',
    date: '2026-11-12',
    start_time: '02:00 PM',
    end_time: '06:00 PM',
    venue: 'Bio-Engineering Seminar Hall 2',
    capacity: 120,
    cover_image: '/images/events/ai-beyond.jpg',
    status: 'published',
    tags: ['ai', 'workshop', 'agents', 'vyra-seeded'],
  },
  {
    id: 'cultural-night-2026',
    slug: 'cultural-night-2026',
    title: 'Cultural Night',
    subtitle: 'Campus Rhythm, Live Music & Spotlight Performances',
    description: 'A vibrant evening showcasing collegiate dance troupes, live acoustic bands, and theatrical performances across regional arts.',
    category: 'Cultural',
    event_type: 'Free',
    date: '2026-11-20',
    start_time: '06:00 PM',
    end_time: '10:30 PM',
    venue: 'Open Air Theatre (OAT)',
    capacity: 800,
    cover_image: '/images/events/rhythms.jpg',
    status: 'published',
    tags: ['cultural', 'music', 'oat', 'vyra-seeded'],
  },
  {
    id: 'cloud-computing-bootcamp-2026',
    slug: 'cloud-computing-bootcamp-2026',
    title: 'Cloud Computing Bootcamp',
    subtitle: 'Serverless Architecture & Kubernetes Orchestration Lab',
    description: 'Practical masterclass covering cloud architecture, CI/CD pipelines, container orchestration, and disaster recovery strategies.',
    category: 'Workshops',
    event_type: 'Free',
    date: '2026-11-28',
    start_time: '11:00 AM',
    end_time: '04:00 PM',
    venue: 'Computing Block Lab 501',
    capacity: 90,
    cover_image: '/images/events/robotics.jpg',
    status: 'published',
    tags: ['cloud', 'kubernetes', 'devops', 'vyra-seeded'],
  },
];

async function seedData() {
  try {
    console.log('Resolving test accounts in Supabase...');

    // 1. Fetch profiles for test accounts
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id, email, role, full_name');

    if (profError) {
      console.error('[ERROR] Could not fetch profiles:', profError.message);
      process.exit(1);
    }

    const organizerProfile = profiles.find(
      (p) => p.email?.toLowerCase() === 'testorganiser@vyra-test.com'
    );

    if (!organizerProfile) {
      console.error('[ABORT] testorganiser@vyra-test.com profile not found.');
      console.error('Please ensure the organizer test account exists in Supabase first.');
      process.exit(1);
    }

    console.log(`Found organizer: ${organizerProfile.email} (${organizerProfile.id})`);

    const studentProfiles = profiles.filter(
      (p) =>
        p.email?.toLowerCase().startsWith('testuser') &&
        p.email?.toLowerCase().endsWith('@vyra-test.com')
    );

    console.log(`Found ${studentProfiles.length} student test accounts:`);
    studentProfiles.forEach((s) => console.log(`  - ${s.email} (${s.id})`));

    // 2. Insert / Update Test Events
    console.log('\nSeeding 5 realistic test events...');
    for (const event of TEST_EVENTS) {
      const payload = {
        ...event,
        organizer_id: organizerProfile.id,
      };

      const { error: evError } = await supabase.from('events').upsert(payload, {
        onConflict: 'id',
      });

      if (evError) {
        console.error(`[ERROR] Inserting event ${event.id}:`, evError.message);
      } else {
        console.log(`[SEEDED] Event "${event.title}" (${event.id})`);
      }
    }

    // 3. Seed Realistic Registrations
    console.log('\nSeeding registrations across test students...');
    const registrationRows = [];

    // Map test users to events
    const regAssignments = [
      { studentIndex: 0, eventIndex: 0, dept: 'Computer Science', year: '3rd Year' },
      { studentIndex: 0, eventIndex: 1, dept: 'Computer Science', year: '3rd Year' },
      { studentIndex: 0, eventIndex: 3, dept: 'Computer Science', year: '3rd Year' },
      { studentIndex: 1, eventIndex: 0, dept: 'Information Technology', year: '2nd Year' },
      { studentIndex: 1, eventIndex: 2, dept: 'Information Technology', year: '2nd Year' },
      { studentIndex: 2, eventIndex: 1, dept: 'Electronics & Comm', year: '4th Year' },
      { studentIndex: 2, eventIndex: 4, dept: 'Electronics & Comm', year: '4th Year' },
      { studentIndex: 3, eventIndex: 0, dept: 'Mechanical Engineering', year: '1st Year' },
      { studentIndex: 3, eventIndex: 3, dept: 'Mechanical Engineering', year: '1st Year' },
    ];

    for (const assign of regAssignments) {
      const student = studentProfiles[assign.studentIndex];
      const event = TEST_EVENTS[assign.eventIndex];
      if (!student || !event) continue;

      const regPayload = {
        event_id: event.id,
        user_id: student.id,
        full_name: student.full_name || student.email.split('@')[0],
        email: student.email,
        phone: '+91 98765 43210',
        department: assign.dept,
        academic_year: assign.year,
        status: 'confirmed',
        note: 'Seeded test registration for dashboard validation',
      };

      const { data: regResult, error: regError } = await supabase
        .from('registrations')
        .upsert(regPayload, { onConflict: 'event_id, user_id' })
        .select('id, event_id, user_id')
        .single();

      if (regError) {
        // If unique constraint is on (event_id, user_id) or insert fails
        console.warn(`[REG NOTICE] ${student.email} -> ${event.title}:`, regError.message);
      } else if (regResult) {
        console.log(`[REGISTERED] ${student.email} -> ${event.title} (ID: ${regResult.id})`);
        registrationRows.push(regResult);
      }
    }

    // 4. Seed Saved Events
    console.log('\nSeeding saved events for student accounts...');
    for (let i = 0; i < studentProfiles.length; i++) {
      const student = studentProfiles[i];
      // Save 1 or 2 events each
      const savedEvent1 = TEST_EVENTS[(i + 1) % TEST_EVENTS.length];
      const savedEvent2 = TEST_EVENTS[(i + 2) % TEST_EVENTS.length];

      for (const ev of [savedEvent1, savedEvent2]) {
        const { error: saveError } = await supabase.from('saved_events').insert({
          user_id: student.id,
          event_id: ev.id,
        });

        if (saveError && saveError.code !== '23505') {
          console.warn(`[SAVE NOTICE] ${student.email} saved ${ev.id}:`, saveError.message);
        } else {
          console.log(`[SAVED] ${student.email} saved "${ev.title}"`);
        }
      }
    }

    // 5. Seed Attendance Gate Records for realistic analytics
    console.log('\nSeeding attendance gate check-ins...');
    // Check in half the registrations, mark some as checked_in
    for (let i = 0; i < registrationRows.length; i++) {
      const reg = registrationRows[i];
      const isCheckedIn = i % 2 === 0;

      const attPayload = {
        event_id: reg.event_id,
        registration_id: reg.id,
        user_id: reg.user_id,
        status: isCheckedIn ? 'checked_in' : 'no_show',
        checked_in_at: isCheckedIn ? new Date().toISOString() : null,
      };

      try {
        const { error: attError } = await supabase
          .from('attendance')
          .upsert(attPayload, { onConflict: 'registration_id' });

        if (attError) {
          // Attendance table might not have unique on registration_id
          const { error: insertErr } = await supabase.from('attendance').insert(attPayload);
          if (!insertErr) {
            console.log(`[ATTENDANCE] Recorded ${attPayload.status} for reg ${reg.id}`);
          }
        } else {
          console.log(`[ATTENDANCE] Recorded ${attPayload.status} for reg ${reg.id}`);
        }
      } catch (e) {
        // Attendance table optional
      }
    }

    console.log('\n====================================================');
    console.log('Test data seeding complete!');
    console.log('Summary:');
    console.log(`  - 5 Events created & owned by ${organizerProfile.email}`);
    console.log(`  - Registrations linked across student test accounts`);
    console.log(`  - Wishlist records added in saved_events`);
    console.log(`  - Attendance check-ins recorded for realistic conversion rate`);
    console.log('====================================================');
  } catch (err) {
    console.error('[FATAL SEED EXCEPTION]', err);
    process.exit(1);
  }
}

seedData();
