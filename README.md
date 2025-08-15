# FreelanceHub - SaaS Freelancing Marketplace

A comprehensive SaaS freelancing marketplace platform built with Next.js, Supabase, and modern web technologies. This platform connects businesses with freelancers in a private community environment.

## Features

### 🚀 Core Platform Features
- **Role-based Authentication** - Admin and Freelancer user types
- **Job Management** - Post, browse, and manage freelance projects
- **Bidding System** - Freelancers can submit proposals with custom pricing
- **Real-time Messaging** - Chat system for project communication
- **Task Tracking** - Kanban-style project management workrooms
- **Rating & Reviews** - Mutual feedback system for trust building
- **Premium Subscriptions** - Multiple pricing tiers with feature gating

### 🎨 Design & UX
- **Professional Green Theme** - Growth-focused color palette
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern UI Components** - Built with shadcn/ui and Radix UI
- **Dark Mode Support** - Automatic theme switching

### 🏢 Business Features
- **Advanced Analytics** - Revenue tracking and performance insights
- **Community Features** - Forums, knowledge base, and success stories
- **Marketing Pages** - Complete website with About, Features, Contact
- **Admin Dashboard** - Comprehensive platform management tools

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **TypeScript**: Full type safety

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install

\`\`\`bash
# Download and extract the ZIP file, then:
cd freelancehub-saas-platform
npm install
\`\`\`

### 2. Environment Setup

Create a `.env.local` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Development URLs
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL scripts in order:
   \`\`\`bash
   # Copy and paste these SQL scripts in your Supabase SQL Editor:
   # 1. scripts/01-create-database-schema.sql
   # 2. scripts/02-complete-job-and-enable-ratings.sql
   # 3. scripts/03-add-subscription-tables.sql
   # 4. scripts/04-add-community-tables.sql
   \`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and management
│   ├── freelancer/        # Freelancer dashboard and features
│   ├── auth/              # Authentication pages
│   ├── community/         # Community features
│   ├── workroom/          # Task tracking interface
│   └── messages/          # Real-time messaging
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── jobs/              # Job management components
│   ├── tasks/             # Task tracking components
│   ├── messaging/         # Chat and messaging
│   ├── reviews/           # Rating and review system
│   ├── premium/           # Subscription features
│   ├── analytics/         # Charts and analytics
│   └── landing/           # Marketing page components
├── lib/                   # Utility functions and configurations
│   └── supabase/          # Supabase client configuration
└── scripts/               # Database migration scripts
\`\`\`

## Key Pages

- **Landing Page** (`/`) - Marketing homepage with features and pricing
- **Authentication** (`/auth/login`, `/auth/sign-up`) - User registration and login
- **Admin Dashboard** (`/admin/dashboard`) - Platform management and analytics
- **Freelancer Dashboard** (`/freelancer/dashboard`) - Job browsing and management
- **Job Details** (`/freelancer/jobs/[id]`) - Individual job pages with bidding
- **Workroom** (`/workroom/[jobId]`) - Task tracking and project management
- **Community** (`/community`) - Forums and knowledge sharing
- **Pricing** (`/pricing`) - Subscription plans and features

## User Roles

### Admin (Business Users)
- Post and manage job listings
- Review and accept/reject bids
- Create tasks for accepted freelancers
- Access advanced analytics and reporting
- Manage platform settings

### Freelancer
- Browse available jobs
- Submit bids and proposals
- Communicate with clients
- Track task progress
- Build reputation through ratings

## Database Schema

The platform uses 10+ interconnected tables:
- `users` - User profiles and authentication
- `jobs` - Job listings and details
- `bids` - Freelancer proposals
- `messages` - Real-time chat system
- `tasks` - Project task management
- `reviews` - Rating and feedback system
- `subscriptions` - Premium plan management
- `community_posts` - Forum discussions
- And more...

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

## License

This project is private and proprietary. All rights reserved.

---

Built with ❤️ using Next.js, Supabase, and modern web technologies.
