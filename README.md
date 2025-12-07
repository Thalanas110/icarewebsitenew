# iCare Church Website

A modern, full-featured church website built with React, TypeScript, and Supabase. This application provides a comprehensive platform for church members and visitors to stay connected, view events, watch sermons, and engage with the church community.

## 🌟 Features

### Public Features
- **Home Page**: Welcome section with church information and mission
- **About**: Church history, beliefs, and leadership information
- **Services**: Service times and schedule
- **Ministries**: Overview of church ministries and programs
- **Events**: Upcoming church events with status tracking (upcoming/ongoing/completed)
- **Sermons**: Browse and watch sermon recordings with search and filtering
- **Gallery**: Photo gallery showcasing church life and events (max 15 images)
- **Giving**: Online giving options and donation information
- **Contact**: Contact form and church location with interactive map

### Admin Features
- **Dashboard**: Analytics and website statistics
- **Content Management**: 
  - Manage church information
  - Create and edit events
  - Upload and manage sermons
  - Configure service times
  - Manage ministries
  - Upload gallery images (max 15)
  - Configure giving settings
- **Analytics**: Track page views and user engagement

### Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Authentication**: Secure admin authentication via Supabase Auth
- **Real-time Data**: Live updates using Supabase real-time subscriptions
- **Optimized Loading**: Progressive loading with Bible verses during initial load
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Analytics Tracking**: Built-in page view tracking

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **pnpm** or **yarn**
- **Supabase Account** (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd icarewebsitenew
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   
   Apply the migrations in `supabase/migrations/` to your Supabase project

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🛠️ Technology Stack

### Frontend
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[React Router v6](https://reactrouter.com/)** - Client-side routing
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching

### UI Framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend & Services
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage (for images and files)
  - Row Level Security (RLS)
  - Real-time subscriptions

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation

### Additional Libraries
- **[Leaflet](https://leafletjs.com/)** - Interactive maps
- **[Recharts](https://recharts.org/)** - Analytics charts
- **[date-fns](https://date-fns.org/)** - Date utilities
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

## 📁 Project Structure

```
icarewebsitenew/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin panel components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Third-party integrations
│   │   └── supabase/       # Supabase client and types
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── supabase/
│   └── migrations/         # Database migrations
├── public/                 # Static assets
└── docs/                   # Documentation (see below)
```

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design decisions
- **[COMPONENTS.md](./COMPONENTS.md)** - Component documentation and usage
- **[API.md](./API.md)** - API and data layer documentation
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development guide and workflows
- **[SECURITY.md](./SECURITY.md)** - Security considerations and best practices
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide for Netlify

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run typecheck    # Run TypeScript type checking

# Building
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🚀 Deployment

This application is configured for deployment on **Netlify**. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy to Netlify

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

## 🔐 Security

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Row Level Security (RLS) policies on all tables
- **Protected Routes**: Admin pages require authentication
- **Input Validation**: All forms validated with Zod schemas
- **File Upload**: Restricted file types and size limits

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [DEVELOPMENT.md](./DEVELOPMENT.md) for development guidelines.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the [documentation](./DEVELOPMENT.md)
- Review [common troubleshooting steps](./DEVELOPMENT.md#troubleshooting)

---

**Made with ❤️ for the church community**
