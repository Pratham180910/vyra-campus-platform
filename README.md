# VYRA — Campus Event Management Platform

**Discover campus events. Join communities. Stay involved.**

[**Live Demo**](https://vyra-campus-platform.vercel.app/) · [**GitHub Repository**](https://github.com/Pratham180910/vyra-campus-platform)

**Recruitment submission:** ACM Student Chapter SRMIST — Web Development Recruitment

---

## Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [Authentication and Security](#authentication-and-security)
- [Recruitment Task Alignment](#recruitment-task-alignment)
- [Demo Accounts](#demo-accounts)
- [Run Locally](#run-locally)
- [Environment Variables](#environment-variables)
- [Available Commands](#available-commands)
- [Project Structure](#project-structure)
- [Testing and Known Limitations](#testing-and-known-limitations)
- [Deployment](#deployment)
- [Acknowledgements](#acknowledgements)

---

## Overview

**VYRA** is a campus event and community platform designed to bring student activities into one place. Students can discover events and clubs, explore event details, register for activities, save events, and review their activity. Organizers have a dedicated workspace for managing events and viewing registration information.

This project was developed for the **ACM Student Chapter SRMIST Web Development Recruitment** task, with an emphasis on responsive frontend development, authentication, persistent data, event workflows, and role-based access.

## Problem Statement

Campus event information is often spread across posters, social media, and messaging groups. Students may miss relevant activities, while organizers need a consistent way to publish events and review participation.

VYRA aims to provide:

- A central interface for campus event discovery.
- Search and filtering to help students find relevant events.
- Event detail pages and online registration workflows.
- Saved events and a student activity dashboard.
- An organizer workspace for event and club administration.
- Authentication and database-level access controls.

## Features

### Student experience

- Browse campus events and search/filter listings.
- View event detail pages.
- Register for events and view registrations in the student dashboard.
- Save and unsave events.
- Discover clubs and view club details.
- Explore events through calendar views.
- Use account authentication and profile features.
- View in-app notifications where configured.

### Organizer experience

- Protected organizer dashboard.
- Create and edit event listings.
- Review registrations and attendee information for managed events.
- View organizer analytics based on available database records.
- Access club-management screens to view, create, and edit club information.

**Club-management status:** The screens and data service have been implemented, but club creation previously encountered a Supabase Row Level Security (RLS) error. Do not consider organizer club creation fully verified until the appropriate database policy has been reviewed, applied, and tested.

### Interface and experience

- Responsive layouts for desktop and smaller screens.
- Dark visual styling with bright accent colors.
- Interactive 3D visuals using Three.js / React Three Fiber where implemented.
- Animated UI elements using GSAP where implemented.

## Technology Stack

| Area | Technology | Purpose |
|---|---|---|
| Frontend | React | Component-based interface |
| Language | TypeScript | Typed application code |
| Build tool | Vite | Development server and production build |
| Styling | Tailwind CSS | Utility-based styling |
| Routing | React Router | Client-side navigation and protected routes |
| Icons | Lucide React | Interface icons |
| 3D visuals | Three.js, React Three Fiber, Drei | Interactive visuals |
| Animation | GSAP | UI animation |
| Authentication | Supabase Auth | Authentication and session management |
| Database | Supabase PostgreSQL | Persistent application data |
| Data access | `@supabase/supabase-js` | Frontend access to Supabase services |
| Database security | PostgreSQL Row Level Security | Row-level access control |
| Hosting | Vercel | Web deployment |
| Linting | Oxlint | Static code checks |

## Architecture

The current application is a client-side React application. It uses the Supabase JavaScript client for its primary authentication and data access; this project does not use a separate Express/Node.js API server for the primary application data flow.

```text
USER'S BROWSER
      |
      v
React + TypeScript (Vite)
      |
      v
Pages, Components, Context and Services
      |
      v
Supabase JavaScript Client
      |
      +----------------------+
      |                      |
      v                      v
Supabase Auth          Supabase Data API
                             |
                             v
                     PostgreSQL RLS Policies
                             |
                             v
                      PostgreSQL Database

Vercel hosts the frontend application.
```

This diagram intentionally uses a plain text code block rather than Mermaid, so it renders reliably on GitHub without a rich-diagram rendering error.

## Database Design

The repository contains SQL migrations under `supabase/migrations/`. The main application tables include:

| Table | Purpose |
|---|---|
| `profiles` | Application profile details and role |
| `clubs` | Campus club records and metadata |
| `club_members` | Relationships between users and clubs |
| `events` | Event information, ownership, status, and capacity fields |
| `registrations` | Student event registrations |
| `saved_events` | Events saved by users |
| `notifications` | In-app notification records |
| `attendance` | Event attendance/check-in records |

The actual deployed schema and permissions depend on the migrations applied to the connected Supabase project. Keep the repository migrations and deployed database synchronized.

## Authentication and Security

- Supabase Auth manages authentication and sessions.
- Application roles are stored in `public.profiles`.
- Frontend route guards help direct users to the correct areas.
- PostgreSQL RLS policies should enforce permissions at the database level.
- The browser should use only the Supabase publishable/anonymous key with suitable RLS policies.
- Never put a Supabase service-role key, database password, or other private credential in frontend code, a `VITE_*` variable, or a public repository.

Frontend route protection alone is not database security. Review and test the deployed RLS policies before relying on privileged organizer operations.

---

## Recruitment Task Alignment

The following table maps the project to common requirements in the recruitment task. Status distinguishes implemented code from end-to-end verification.

| Requirement | Status | Notes |
|---|---|---|
| Responsive event discovery | Implemented in frontend | Verify layout on the deployed site |
| Event search and filtering | Implemented in frontend | Test with available database records |
| Event detail page | Implemented in frontend | Verify required details on live records |
| Authentication | Implemented with Supabase Auth | Test registration, login, logout, and session behavior |
| Event registration | Implemented in application | Verify a complete live database flow |
| Duplicate registration prevention | Database uniqueness/service handling is reported in the project | Confirm with repeated registration attempts |
| Event cancellation | Implemented in application | Verify cancellation and dashboard updates |
| Event capacity enforcement | Needs verification / improvement | Do not claim strict database-level enforcement until confirmed |
| Persistent event and registration data | Supabase tables and services are present | Verify live reads and writes |
| Student dashboard | Implemented in frontend | Check live registrations and saved events |
| Organizer access restrictions | Frontend guards and RLS policies are present | Test with student and organizer accounts |
| Organizer event management | Implemented in organizer workspace | Verify create/edit and permissions against Supabase |
| Organizer analytics and attendee information | Implemented in organizer workspace | Compare displayed information with database records |
| Organizer club management | UI/service implemented; database flow not yet verified | Club creation previously returned an RLS error |
| Calendar | Additional feature | Verify event display against live data |
| Saved events | Additional feature | Uses the `saved_events` table |
| Attendance records | Additional feature | Uses the `attendance` table where configured |
| Deployment | Deployed | [Open VYRA](https://vyra-campus-platform.vercel.app/) |

A successful build confirms that the code compiles; it does not prove that every workflow succeeds against the deployed database.

## Demo Accounts

The following dedicated demonstration accounts were supplied for recruitment evaluation.

| Role | Display Name | Email | Password |
|---|---|---|---|
| Organizer | `TestOrganiser` | `testorganiser@vyra-test.com` | `VyraOrg#2026Test` |
| Student | `TestUser1` | `testuser1@vyra-test.com` | `VyraUser1#2026` |
| Student | `TestUser2` | `testuser2@vyra-test.com` | `VyraUser2#2026` |

**Security note:** This is a public repository, so the demo credentials are publicly visible. Use them only for dedicated test accounts with no sensitive information or privileged infrastructure access. Rotate or disable the accounts when they are no longer needed for evaluation.

Suggested evaluation flow:

1. Open the [live demo](https://vyra-campus-platform.vercel.app/).
2. Sign in with a student account to explore event discovery, details, registration, saved events, and the student dashboard.
3. Sign in with the organizer account to inspect organizer routes, event management, attendee information, and analytics.
4. Confirm that student accounts cannot access organizer-only actions.

## Run Locally

### Prerequisites

- Node.js and npm
- A Supabase project with the required schema and policies

### 1. Clone the repository

```bash
git clone https://github.com/Pratham180910/vyra-campus-platform.git
cd vyra-campus-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a root `.env` file based on `.env.example`. Add the required Supabase configuration; see [Environment Variables](#environment-variables).

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

### 5. Build the project

```bash
npm run build
```

### 6. Run lint checks

```bash
npm run lint
```

## Environment Variables

Use the exact names required by the checked-in `.env.example` and `src/lib/supabase.ts`. The frontend commonly uses:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable/anonymous key |

Example format:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

The example values above are placeholders. Do not commit `.env` files or use a service-role key in frontend environment variables.

## Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production frontend |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview the production build locally |

Inspect any data-seeding or provisioning scripts before using them. They may create or modify database records and should not be run casually against production.

## Project Structure

```text
vyra-campus-platform/
├── public/                 # Static assets and images
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/             # Shared React state and providers
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Supabase client setup
│   ├── pages/               # Student and organizer pages
│   ├── services/             # Data access and application services
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Application routes
│   └── main.tsx              # Application entry point
├── supabase/
│   └── migrations/          # Database schema and policy migrations
├── .env.example             # Environment variable template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Testing and Known Limitations

The project has previously passed `npm run build` and `npm run lint`. The reported lint run contained warnings but no errors. These checks do not replace end-to-end testing.

Known items to verify or improve:

1. **Capacity enforcement:** Confirm that the database rejects registrations once event capacity is reached. UI-only capacity checks are insufficient under concurrent requests.
2. **Club-management RLS:** Organizer club creation previously failed with a Supabase RLS error. Review and apply the correct policy to the intended Supabase project, then test create and edit operations.
3. **End-to-end testing:** Test registration, duplicate registration attempts, cancellation, authorization, and persistence against the deployed application.
4. **Email delivery:** Do not assume that registration sends an email unless an email provider and workflow are configured.
5. **Production data:** Avoid running seed scripts or destructive tests against production records.

## Deployment

- **Live application:** [https://vyra-campus-platform.vercel.app/](https://vyra-campus-platform.vercel.app/)
- **Source code:** [https://github.com/Pratham180910/vyra-campus-platform](https://github.com/Pratham180910/vyra-campus-platform)
- **Frontend hosting:** Vercel
- **Authentication and database:** Supabase

Configure the required frontend environment variables in Vercel. Redeploy after changing build-time environment variables.

## Acknowledgements

Developed as a submission for the **ACM Student Chapter SRMIST Web Development Recruitment Task**, demonstrating practical frontend development, authentication, database integration, event workflows, role-based access, and deployment.
