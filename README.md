# DX Education Platform

A robust digital transformation education platform where users can purchase courses, study free courses, take quizzes, practice skills, and more.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form + Zod** - Form handling and validation

### Backend
- **Node.js + Express** - API server
- **TypeScript** - Type safety
- **MongoDB Atlas** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Stripe** - Payment processing

## Project Structure

```
dx_ed/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/           # App router pages
│   │   │   ├── components/    # React components
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── lib/           # Utilities & API
│   │   │   ├── stores/        # Zustand stores
│   │   │   └── types/         # TypeScript types
│   │   └── ...
│   │
│   └── api/                    # Express backend
│       └── src/
│           ├── config/        # Configuration
│           ├── controllers/   # Route handlers
│           ├── middleware/    # Express middleware
│           ├── models/        # Mongoose models
│           ├── routes/        # Route definitions
│           ├── services/      # Business logic
│           ├── utils/         # Helpers
│           └── validators/    # Zod schemas
│
└── packages/                   # Shared packages
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- MongoDB Atlas account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dx_ed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Backend (`apps/api/.env`):
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
   Edit the `.env` file with your values:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure random string
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret

   Frontend (`apps/web/.env.local`):
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start individually
   npm run dev:api   # Backend on http://localhost:5000
   npm run dev:web   # Frontend on http://localhost:3000
   ```

## Features

### For Students
- Browse free and premium courses
- Enroll in courses
- Track progress through lessons
- Take quizzes with various question types
- Earn badges and certificates
- View learning analytics

### For Instructors
- Create and manage courses
- Build modules and lessons
- Create quizzes and assessments
- View student analytics
- Manage course pricing

### For Admins
- User management
- Course moderation
- Category management
- Revenue reports
- Platform settings

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Courses
- `GET /api/v1/courses` - List courses
- `GET /api/v1/courses/:slug` - Get course details
- `POST /api/v1/courses/:slug/enroll` - Enroll in course
- `PATCH /api/v1/courses/:slug/lessons/:lessonId/complete` - Mark lesson complete

### Quizzes
- `GET /api/v1/quizzes/:quizId` - Get quiz
- `POST /api/v1/quizzes/:quizId/start` - Start quiz attempt
- `POST /api/v1/quizzes/:quizId/submit` - Submit answers

### Payments
- `POST /api/v1/payments/checkout` - Create checkout session
- `POST /api/v1/payments/subscription` - Create subscription
- `POST /api/v1/payments/webhook` - Stripe webhook

## Database Models

- **User** - User accounts and profiles
- **Course** - Course content and metadata
- **Enrollment** - User-course relationships and progress
- **Quiz** - Assessments and questions
- **Category** - Course categories
- **Order** - Purchase history
- **Review** - Course reviews
- **Badge** - Achievement badges

## Scripts

```bash
# Development
npm run dev          # Start all services
npm run dev:web      # Start frontend only
npm run dev:api      # Start backend only

# Building
npm run build        # Build all
npm run build:web    # Build frontend
npm run build:api    # Build backend

# Linting
npm run lint         # Lint all

# Testing
npm run test         # Run tests
```

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `STRIPE_SECRET_KEY` | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |

### Frontend
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key |

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Backend (Railway/Render)
1. Create new project
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Set up network access
3. Create database user
4. Get connection string

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details.
