# HEMIS - Integrated Hospital Management System

This application combines the HEMIS landing page with the dashboard into a single Next.js application.

## Features

### Landing Page
- Modern, responsive design
- Hospital information sections
- Contact information
- FAQ section
- Login modal with navigation to dashboard

### Dashboard
- Executive dashboard with KPIs
- Finance reporting
- HR management
- Compliance tracking
- Analytics and insights
- AI-powered insights

## Project Structure

```
├── app/
│   ├── (dashboard)/           # Dashboard routes with authentication
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   ├── dashboard/        # Main dashboard
│   │   ├── analytics/        # Analytics page
│   │   ├── compliance/       # Compliance page
│   │   ├── finance/          # Finance page
│   │   └── hr/              # HR page
│   ├── landing/             # Landing page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Root page (redirects to landing)
├── components/
│   ├── landing/             # Landing page components
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── about-us.tsx
│   │   ├── more-info.tsx
│   │   ├── get-in-touch.tsx
│   │   ├── faq.tsx
│   │   └── login-modal.tsx
│   ├── ui/                  # Reusable UI components
│   ├── auth-check.tsx       # Authentication wrapper
│   ├── header.tsx           # Dashboard header
│   ├── sidebar.tsx          # Dashboard sidebar
│   └── kpi-card.tsx         # KPI display component
└── public/
    └── assets/              # Landing page assets
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Navigation

- **Landing Page**: `/landing` - Marketing and information page
- **Dashboard**: `/dashboard` - Main executive dashboard (requires authentication)
- **Finance**: `/finance` - Financial reporting
- **HR**: `/hr` - Human resources management
- **Compliance**: `/compliance` - Compliance tracking
- **Analytics**: `/analytics` - Predictive analytics

## Authentication

The application uses a simple client-side authentication system:
- Login with any username/password combination
- Authentication state is stored in localStorage
- Dashboard routes are protected and redirect to landing if not authenticated
- Logout clears authentication and returns to landing page

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Icons for dashboard
- **React Icons** - Icons for landing page
- **Recharts** - Data visualization for dashboard
- **Radix UI** - Accessible UI components

## Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start
```

The application is optimized for deployment on Vercel, Netlify, or any other Next.js-compatible hosting platform.