# TUM HN Hiking Club Website
A web platform developed for the TUM HN Hiking Club to manage event discovery, user enrollment, and administrative organization.

### Tech Stack
- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS, shadcn/ui
- State Management: TanStack Query (React Query)
- Backend & Database: Supabase (PostgreSQL, Auth, Storage)
- Mapping: Leaflet.js & React-Leaflet
- Forms: React Hook Form & Zod
## Project Architecture:
```
/
├── public/
│   ├── images/
│   └── robots.txt
├── src/
│   ├── assets/             # Static assets (images) imported in code
│   ├── components/
│   │   ├── layout/         # Layout components (Navigation, Footer, etc.)
│   │   └── ui/             # shadcn/ui primitives (Button, Input, etc.)
│   ├── features/           # Feature-specific logic (The core of your app)
│   │   ├── auth/           # AuthContext, login forms, protection logic
│   │   └── hikes/          # Hike cards, maps, enrollment logic
│   ├── hooks/              # Global custom hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── useUserEnrollments.ts
│   │   └── useUsers.ts
│   ├── lib/                # Utilities and static data
│   │   ├── data.ts         # Mock data or constants
│   │   ├── types.ts        # (Legacy) types, moving toward src/types
│   │   └── utils.ts        # cn() helper
│   ├── pages/              # Route components
│   │   ├── admin/          # Admin dashboard routes
│   │   ├── Auth.tsx
│   │   ├── Index.tsx
│   │   ├── NotFound.tsx
│   │   ├── Organisers.tsx
│   │   ├── Participants.tsx
│   │   └── Profile.tsx
│   ├── services/           # External API integration
│   │   └── supabase/       # Supabase client configuration
│   ├── types/              # Global TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx             # Main Router setup
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles & Tailwind directives
│   └── vite-env.d.ts
├── supabase/
│   ├── migrations/         # SQL history
│   └── config.toml
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```
## Setup & Installation 

To run this project locally, follow these steps:

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase CLI

### Installation

1. Clone the repository:
```
git clone https://github.com/flaferty/tum-hiking-club-website.git
cd tum-hiking-club-website
```
2. Install dependencies:
```
npm i
```
3. Set up your Supabase project:

- Log in to the Supabase CLI: supabase login.
- Link your local project to your Supabase project: supabase link --project-ref yjdsekbintlevafarmko. You will need your database password.
- Push the database migrations to your Supabase project:
```
supabase db push
```
4. Configure Environment Variables: Create a .env file in the root of the project and add your Supabase project URL and Anon Key. You can find these in your Supabase project's "Project Settings" > "API".
```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
```
5. Run the development server:
```
npm run dev
```
The application will be available at http://localhost:8080.

## Backend Overview

The backend relies on Supabase (PostgreSQL). Security is handled via Row-Level Security (RLS) policies.

### Database

The database schema is defined in the `supabase/migrations` directory. Key tables include:

*   `hikes`: Stores all information about hiking events.
*   `profiles`: Stores user profile data, extending the default `auth.users` table.
*   `hike_enrollments`: Manages the relationship between users and the hikes they are enrolled in or waitlisted for.
*   `user_roles`: Assigns roles (e.g., `admin`, `user`) to users for authorization.

### Authentication

Authentication is handled by Supabase Auth. The application implements email/password sign-up and sign-in. User profiles are automatically created using a trigger that populates the `profiles` table upon new user registration.

### Authorization

Row-Level Security (RLS) policies are used to control data access. A custom `has_role` function and the `user_roles` table manage permissions, ensuring that only administrators can access management features.

### Storage

Hike photos are uploaded to and served from Supabase Storage in a public bucket named `hike-images`.
