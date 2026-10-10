# VYRA --- Campus Event Management Platform

> A campus-focused platform for discovering events, managing
> registrations, and coordinating student activities.

**Live demo:**
[vyra-campus-platform.vercel.app](https://vyra-campus-platform.vercel.app/)\
**Source code:**
[github.com/Pratham180910/vyra-campus-platform](https://github.com/Pratham180910/vyra-campus-platform)\
**Recruitment task:** ACM Student Chapter SRMIST --- Web Development
Recruitment

------------------------------------------------------------------------

## Table of Contents

-   [Overview](#overview)
-   [Problem Statement](#problem-statement)
-   [Features](#features)
-   [Technology Stack](#technology-stack)
-   [Architecture](#architecture)
-   [Database](#database)
-   [Authentication and Security](#authentication-and-security)
-   [Recruitment Task Alignment](#recruitment-task-alignment)
-   [Demo Accounts](#demo-accounts)
-   [Run Locally](#run-locally)
-   [Environment Variables](#environment-variables)
-   [Available Scripts](#available-scripts)
-   [Project Structure](#project-structure)
-   [Testing Status and Limitations](#testing-status-and-limitations)
-   [Deployment](#deployment)
-   [Acknowledgements](#acknowledgements)

------------------------------------------------------------------------

## Overview

**VYRA** is a responsive campus event management platform designed to
bring event discovery and student participation into one place. Students
can explore campus events and clubs, view event details, register for
events, save events, and manage their activity. Authorized organizers
have a separate workspace for event management and registration
insights.

The project was built for the ACM Student Chapter SRMIST Web Development
Recruitment task, which asks candidates to demonstrate frontend
development, authentication, persistent data, registration logic, and
full-stack integration.

## Problem Statement

Campus event information can be scattered across posters, messaging
groups, and social platforms. This can make events difficult to discover
and leave organizers managing registrations manually.

VYRA aims to provide:

-   A central place to discover and filter campus events.
-   Event detail pages with relevant information before registration.
-   Student registration and saved-event experiences.
-   An organizer workspace for managing events and reviewing
    registration data.
-   Role-aware access and database-level authorization.

## Features

### Student experience

-   Browse and search event listings.
-   Filter events by category and other available criteria.
-   View event details, including event timing, venue, description, and
    organizer information where provided.
-   Register for events and view registrations from the student
    dashboard.
-   Save and unsave events.
-   Browse clubs and view club details.
-   Explore events through calendar views.
-   Use account authentication and profile features.
-   View in-app notifications where available.

### Organizer experience

-   Access a protected organizer workspace.
-   Create and edit event listings.
-   Review registrations and attendee information for managed events.
-   View organizer analytics based on available database records.
-   Access club-management screens to view, create, and edit club
    information.

**Club-management note:** The club-management interface is implemented,
but organizer club creation depends on the correct Supabase Row Level
Security (RLS) policies being applied. Treat this workflow as pending
verification until it has been tested successfully against the deployed
database.

### Interface

-   Responsive layouts for desktop and smaller screens.
-   Dark visual theme with bright accent colors.
-   Interactive hero visuals using Three.js / React Three Fiber.
-   Reduced-motion handling where implemented.

------------------------------------------------------------------------

## Technology Stack

  -------------------------------------------------------------------------
  Area                    Technology                Purpose
  ----------------------- ------------------------- -----------------------
  Frontend                React                     Component-based user
                                                    interface

  Language                TypeScript                Typed application code

  Build tool              Vite                      Development server and
                                                    production build

  Styling                 Tailwind CSS              Utility-based styling

  Routing                 React Router              Client-side navigation
                                                    and protected routes

  Icons                   Lucide React              Interface icons

  3D visuals              Three.js, React Three     Interactive hero
                          Fiber, Drei               visuals

  Animation               GSAP                      UI animation

  Authentication          Supabase Auth             Email/password
                                                    authentication and
                                                    sessions

  Database                Supabase PostgreSQL       Persistent application
                                                    data

  Data access             `@supabase/supabase-js`   Frontend access to
                                                    Supabase services

  Database security       PostgreSQL RLS            Row-level access
                                                    control

  Hosting                 Vercel                    Web deployment

  Linting                 Oxlint                    Static code checks
  -------------------------------------------------------------------------

### Architecture

VYRA is a client-side React application that uses the Supabase
JavaScript client to communicate with Supabase. The current project does
not use a separate Express or Node.js API server for its primary
application data flow.

``` mermaid
flowchart TD
    A[Browser: React + TypeScript] --> B[Pages, Components and Services]
    B --> C[Supabase JavaScript Client]
    C --> D[Supabase Auth]
    C --> E[Supabase Data API]
    E --> F[PostgreSQL RLS Policies]
    F --> G[(PostgreSQL Database)]
    H[Vercel] --> A
```

Authorization must be enforced by database policies, not only by hiding
or protecting frontend routes.

## Database

The repository contains SQL migrations under `supabase/migrations/`. The
application schema includes these principal tables:

  Table             Purpose
  ----------------- -------------------------------------------------------
  `profiles`        Application profile information and role
  `clubs`           Campus club records and metadata
  `club_members`    Relationships between users and clubs
  `events`          Event details, ownership, status, and capacity fields
  `registrations`   Student registrations for events
  `saved_events`    User-saved events
  `notifications`   In-app notifications
  `attendance`      Event attendance/check-in records

The exact deployed schema and policies are determined by the migrations
actually applied to the connected Supabase project. Keeping local
migrations and the deployed database in sync is required.

## Authentication and Security

-   Supabase Auth handles email/password authentication and session
    management.
-   User roles are represented in `public.profiles`.
-   Frontend route guards direct users to the appropriate application
    areas.
-   PostgreSQL Row Level Security policies are intended to restrict data
    access according to user identity, role, and record ownership.
-   The frontend should use only the Supabase publishable/anonymous key
    with appropriate RLS policies.
-   **Never place a Supabase service-role key, database password, or
    other private secret in frontend code, a `VITE_*` variable, or a
    public repository.**

Frontend route protection is not a substitute for database
authorization. Review and test the policies in the target Supabase
project before relying on privileged organizer actions.

------------------------------------------------------------------------

## Recruitment Task Alignment

The ACM Student Chapter SRMIST task asks for event discovery,
search/filtering, event details, authentication, registration and
cancellation, persistent database records, validation, a student
dashboard, and organizer functionality. The table below distinguishes
implementation from verification.

  --------------------------------------------------------------------------------------------------------
  Recruitment requirement Current status          Notes
  ----------------------- ----------------------- --------------------------------------------------------
  Responsive home page    Implemented in the      Verify appearance and data on the deployed site
  and event discovery     frontend                

  Event listing and       Implemented in the      Test filters against available database records
  search/filtering        frontend                

  Event detail page       Implemented in the      Check all required fields for each event
                          frontend                

  Authentication          Implemented using       Test registration, login, logout, and session behavior
                          Supabase Auth           

  Event registration      Implemented with        Test the complete flow using a demo account
                          Supabase persistence    

  Duplicate registration  Database uniqueness and Confirm behavior in the deployed environment
  prevention              service handling are    
                          reported in the project 

  Event cancellation      Implemented in the      Test cancellation and resulting dashboard state
                          application             

  Capacity enforcement    **Partially             Capacity is represented in event data/UI; hard
                          implemented**           database-level rejection at capacity has been identified
                                                  as a limitation

  Persistent users,       Supabase PostgreSQL     Confirm live reads/writes against the deployed project
  events, and             schema and services are 
  registrations           present                 

  Student dashboard       Implemented in the      Verify registrations and saved events for a test account
                          frontend                

  Organizer               Implemented in the      Test with both organizer and student accounts
  authentication and      frontend and supported  
  role-based access       by RLS policies         

  Organizer event CRUD    Implemented in the      Verify create, edit, and delete permissions against
                          organizer workspace     Supabase

  Attendee lists and      Implemented in the      Confirm results match live database records
  analytics               organizer workspace     

  Organizer club          UI and service          Organizer club creation previously returned an RLS
  management              implemented; **database error; do not consider it verified until the policy is
                          workflow requires       corrected and the operation succeeds
                          verification**          

  Calendar                Additional feature      Calendar views are available in the application

  Saved events            Additional feature      Uses the `saved_events` table

  Attendance tracking     Additional feature      Uses the `attendance` table where configured

  Deployment              Deployed to Vercel      [Open live
                                                  application](https://vyra-campus-platform.vercel.app/)
  --------------------------------------------------------------------------------------------------------

A successful production build confirms that the application compiles; it
does not, by itself, prove every end-to-end workflow works against the
live database.

------------------------------------------------------------------------

## Demo Accounts

Use these dedicated test accounts for recruitment evaluation.

| Role | Display Name | Email | Password |
|---|---|---|---|
| Organizer | `TestOrganiser` | `testorganiser@vyra-test.com` | `VyraOrg#2026Test` |
| Student | `TestUser1` | `testuser1@vyra-test.com` | `VyraUser1#2026` |
| Student | `TestUser2` | `testuser2@vyra-test.com` | `VyraUser2#2026` |

**Security note:** This repository is public, so these credentials are publicly visible. Use them only for dedicated demo accounts with no sensitive data or privileged access. Rotate or disable them when they are no longer needed for evaluation.

Suggested evaluation flow:

1. Open the [live demo](https://vyra-campus-platform.vercel.app/).
2. Sign in with a student account to explore event discovery, event details, registration, saved events, and the student dashboard.
3. Sign in with the organizer account to inspect organizer routes, event management, attendee lists, and analytics.
4. Confirm that student accounts cannot access organizer-only actions.

------------------------------------------------------------------------

## Run Locally

### Prerequisites

-   Node.js and npm
-   Access to a Supabase project with the required schema and policies

### 1. Clone the repository

``` bash
git clone https://github.com/Pratham180910/vyra-campus-platform.git
cd vyra-campus-platform
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a root `.env` file based on `.env.example` and provide the
required Supabase values. See [Environment
Variables](#environment-variables).

### 4. Start the development server

``` bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### 5. Build for production

``` bash
npm run build
```

### 6. Run lint checks

``` bash
npm run lint
```

## Environment Variables

The frontend expects the following variables, subject to the names in
`.env.example` and the Supabase client configuration:

  -----------------------------------------------------------------------
  Variable                            Description
  ----------------------------------- -----------------------------------
  `VITE_SUPABASE_URL`                 Supabase project URL

  `VITE_SUPABASE_ANON_KEY`            Supabase publishable/anonymous key
                                      used by the frontend
  -----------------------------------------------------------------------

Example `.env` format:

``` env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

Use the actual variable names required by the checked-in `.env.example`
and source code. Do not commit `.env` files. Do not use a service-role
key in the browser.

## Available Scripts

  -----------------------------------------------------------------------
  Command                             Purpose
  ----------------------------------- -----------------------------------
  `npm run dev`                       Start the Vite development server

  `npm run build`                     Run the production build and
                                      associated TypeScript checks

  `npm run lint`                      Run Oxlint

  `npm run preview`                   Preview the production build
                                      locally
  -----------------------------------------------------------------------

Additional test-data scripts may exist in the repository. They are
intentionally not listed as routine setup steps because they can create
or modify database records and should only be run after inspecting their
safeguards and target environment.

## Project Structure

``` text
vyra-campus-platform/
├── public/                 # Static assets and images
├── src/
│   ├── assets/             # Bundled visual assets
│   ├── components/         # Reusable UI components
│   ├── context/            # Shared React state and providers
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Supabase client setup
│   ├── pages/              # Student and organizer pages
│   ├── services/           # Data access and application services
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── App.tsx              # Application routes
│   └── main.tsx             # Application entry point
├── supabase/
│   └── migrations/         # SQL schema and policy migrations
├── .env.example            # Environment-variable template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Testing Status and Limitations

The project has previously passed `npm run build` and `npm run lint`.
The reported lint run contained warnings but no errors. These are
code-quality checks, not a substitute for testing the deployed
application.

Known items to verify or improve:

1.  **Capacity enforcement:** A database-level mechanism that rejects
    registrations once event capacity is reached was identified as not
    yet enforced. This should be implemented and tested before claiming
    strict capacity protection.
2.  **Club-management RLS:** Organizer club creation previously failed
    with a Supabase RLS error. The required migration must be reviewed,
    applied to the correct Supabase project, and tested before club
    creation/editing can be described as fully working.
3.  **End-to-end coverage:** Automated browser/unit/integration test
    coverage was not confirmed in the project report. Manually test the
    core registration flow, duplicate attempts, cancellation,
    authorization, and persistence.
4.  **Email delivery:** External transactional email delivery was
    identified as future work; do not assume that registration sends an
    email.
5.  **Production data:** Avoid running seed scripts or destructive tests
    against production data.

## Deployment

-   **Production application:**
    <https://vyra-campus-platform.vercel.app/>
-   **GitHub repository:**
    <https://github.com/Pratham180910/vyra-campus-platform>
-   **Hosting:** Vercel
-   **Database and authentication:** Supabase

The Vercel project must have the frontend's required Supabase
environment variables configured. If the variable names or values
change, redeploy the application after updating the hosting
configuration.

## Acknowledgements

Developed as a submission for the **ACM Student Chapter SRMIST Web
Development Recruitment Task**. The project is intended to demonstrate
practical frontend development, authentication, database integration,
event workflows, role-based access, and deployment.

------------------------------------------------------------------------
