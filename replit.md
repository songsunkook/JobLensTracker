# JobLens - 취업 데이터 통합 인사이트 서비스

## Overview

JobLens is a Korean job market analytics platform that provides data-driven insights for job seekers. Unlike traditional job listing aggregators, this service focuses on analyzing employment market trends, salary distributions, and skill requirements to help users make informed career decisions. The platform serves two primary personas: university students starting their job search and experienced professionals considering career transitions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds
- **UI Library**: Radix UI primitives with custom theming
- **Maps**: Leaflet for geographical visualization
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for session storage
- **API Pattern**: RESTful endpoints with JSON responses

### Project Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── lib/          # Utilities and configurations
│   │   └── hooks/        # Custom React hooks
├── server/               # Backend Express application
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data access layer
│   └── vite.ts           # Development server setup
├── shared/               # Shared TypeScript schemas
└── migrations/           # Database migration files
```

## Key Components

### Data Models
- **Companies**: Business entities with location, industry, and culture data
- **Job Postings**: Positions with requirements, salary ranges, and metadata
- **Bookmarks**: User-saved job postings
- **Users**: Basic user authentication system

### Core Features
1. **Filter System**: Multi-dimensional filtering by industry, location, salary, experience level
2. **Statistics Dashboard**: Aggregated insights including salary distributions and trending skills
3. **Geographic Visualization**: Interactive map showing company locations and job density
4. **Bookmark Management**: Personal job saving functionality
5. **Responsive Design**: Mobile-first approach with adaptive layouts

### UI Components
- **Filter Panel**: Comprehensive filtering interface with checkboxes, sliders, and radio groups
- **Job Cards**: Individual job posting displays with company information
- **Statistics Overview**: Key metrics and trends visualization
- **Salary Charts**: Bar charts showing compensation distributions
- **Keyword Tags**: Popular skills and requirements with percentage indicators
- **Map Visualization**: Geographic distribution of opportunities

## Data Flow

### Client-Side Flow
1. User interacts with filter controls
2. Filter state updates trigger API calls via TanStack Query
3. Server responds with filtered job data and statistics
4. Components re-render with updated information
5. Charts and visualizations reflect current filter selections

### Server-Side Flow
1. Express routes receive API requests with query parameters
2. Storage layer translates filters into database queries
3. Drizzle ORM executes PostgreSQL queries
4. Results are aggregated and formatted
5. JSON responses sent back to client

### Database Operations
- **Read-Heavy Workload**: Optimized for job search and analytics queries
- **Aggregation Queries**: Real-time statistics calculation
- **Filtering Logic**: Complex multi-column filtering with efficient indexing
- **Geographic Queries**: Location-based search and mapping

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe SQL query builder
- **@tanstack/react-query**: Server state management
- **express**: Web application framework
- **@radix-ui/***: Headless UI component primitives
- **recharts**: Chart library for data visualization
- **leaflet**: Interactive maps (loaded via CDN)

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **drizzle-kit**: Database schema management
- **vite**: Frontend build tool and development server

### Styling and UI
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class conflict resolution
- **@radix-ui/react-***: Accessible component primitives

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React application to static assets
2. **Backend Build**: esbuild bundles Express server into single file
3. **Database Migration**: Drizzle Kit manages schema changes
4. **Asset Optimization**: Vite handles code splitting and optimization

### Environment Configuration
- **Development**: Hot module replacement with Vite middleware
- **Production**: Served static files with Express
- **Database**: Environment-specific connection strings
- **Session Storage**: PostgreSQL-backed session management

### Deployment Architecture
- **Database**: Hosted on Neon (serverless PostgreSQL)
- **Application**: Single Node.js process serving both API and static files
- **Assets**: Static files served directly by Express
- **Maps**: Leaflet CSS/JS loaded from CDN

The application is designed for cloud deployment with minimal infrastructure requirements, leveraging serverless database capabilities and efficient resource utilization.

## Changelog

```
Changelog:
- July 01, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```