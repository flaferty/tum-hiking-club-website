# TUM Hiking Club Website
This repository contains the source code for the TUM Hiking Club, a web application designed to connect hiking enthusiasts at the Technical University of Munich. 
The platform allows users to discover, enroll in, and organize hiking events. It features an interactive map, detailed hike information, user profiles with statistics, and an admin dashboard for site management.

### Tech Stack
- Frontend: React, TypeScript, Vite
- Backend & Database: Supabase (PostgreSQL, Auth, Storage)
- Styling: Tailwind CSS, shadcn/ui
- State Management: TanStack Query (React Query)
- Routing: React Router
- Mapping: Leaflet.js & React-Leaflet
- Forms: React Hook Form & Zod
- UI Components: Radix UI
## Project Strcture:
```
/
├── public/                 # Static assets like robots.txt
├── src/
│   ├── assets/             # Static images and assets for the app
│   ├── components/         # Reusable React components
│   │   └── ui/             # Unstyled components from shadcn/ui
│   ├── contexts/           # React Context providers (e.g., AuthContext)
│   ├── hooks/              # Custom React hooks for data fetching and logic
│   ├── integrations/       # Supabase client and generated types
│   ├── lib/                # Shared utilities, types, and mock data
│   └── pages/              # Top-level page components for each route
│       └── admin/          # Components for the admin dashboard
├── supabase/
│   └── migrations/         # Supabase database migration scripts
├── index.html              # Main HTML entry point
├── package.json            # Project dependencies and scripts
└── vite.config.ts          # Vite configuration
```
## Getting Started

To run this project locally, follow these steps:
### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Supabase Account and Supabase CLI
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

## Backend (Supabase)

This project uses Supabase for its backend services, including authentication, database, and file storage.

### Database

The database schema is defined in the `supabase/migrations` directory. Key tables include:

*   `hikes`: Stores all information about hiking events.
*   `profiles`: Stores user profile data, extending the default `auth.users` table.
*   `hike_enrollments`: Manages the relationship between users and the hikes they are enrolled in or waitlisted for.
*   `user_roles`: Assigns roles (e.g., `admin`, `user`) to users for authorization.
*   `hike_images`: Stores URLs for hike-related photos.
*   `waypoints`: Stores geographical points for multi-day hikes, such as overnight stops.

### Authentication

Authentication is handled by Supabase Auth. The application implements email/password sign-up and sign-in. User profiles are automatically created using a trigger that populates the `profiles` table upon new user registration.

### Authorization

Row-Level Security (RLS) policies are used to control data access. A custom `has_role` function and the `user_roles` table manage permissions, ensuring that only administrators can access management features.

### Storage

Hike photos are uploaded to and served from Supabase Storage in a public bucket named `hike-images`.
