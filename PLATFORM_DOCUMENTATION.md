# Digital Transformation Education Platform
## Comprehensive Technical & Feature Documentation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Platform Overview](#2-platform-overview)
3. [Technical Architecture](#3-technical-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Database Design](#5-database-design)
   - 5.3 [Current Seed Data](#53-current-seed-data)
6. [Feature Specifications](#6-feature-specifications)
7. [User Roles & Permissions](#7-user-roles--permissions)
8. [Payment & Monetization](#8-payment--monetization)
9. [Quiz & Assessment System](#9-quiz--assessment-system)
10. [Gamification System](#10-gamification-system)
11. [Analytics & Reporting](#11-analytics--reporting)
12. [Security Implementation](#12-security-implementation)
13. [Third-Party Integrations](#13-third-party-integrations)
14. [API Specifications](#14-api-specifications)
15. [Deployment Strategy](#15-deployment-strategy)
16. [Development Phases](#16-development-phases)

---

## 1. Executive Summary

This document outlines the comprehensive architecture and features for a robust digital transformation education platform. The platform enables users to:

- **Purchase premium courses** with secure Stripe payment integration
- **Access free courses** for skill development
- **Take interactive quizzes** with instant feedback
- **Practice skills** through hands-on exercises
- **Track progress** with detailed analytics
- **Earn certificates** and badges upon completion
- **Engage with gamification** elements for motivation

The platform is built on modern web technologies prioritizing scalability, performance, and user experience.

---

## 2. Platform Overview

### 2.1 Vision Statement

A comprehensive e-learning platform focused on digital transformation skills, providing accessible education through a combination of free and premium content, interactive assessments, and practical exercises.

### 2.2 Target Audience

| Audience Segment | Description |
|------------------|-------------|
| **Individual Learners** | Professionals seeking to upskill in digital transformation |
| **Corporate Teams** | Organizations training employees on digital tools |
| **Students** | Academic learners exploring technology careers |
| **Career Changers** | Individuals transitioning into tech roles |

### 2.3 Core Value Propositions

1. **Accessible Learning**: Free courses alongside premium content
2. **Practical Focus**: Hands-on exercises and real-world projects
3. **Certification**: Industry-recognized completion certificates
4. **Flexible Pacing**: Self-paced learning with progress tracking
5. **Community**: Discussion forums and peer interaction

---

## 3. Technical Architecture

### 3.1 Architecture Overview

The platform follows a **modular monolith architecture** initially, with the capability to evolve into microservices as scaling demands increase. This approach balances development speed with future scalability.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Web App   │  │ Mobile PWA  │  │   Admin Dashboard       │  │
│  │  (React/    │  │  (React +   │  │   (React Admin)         │  │
│  │   Next.js)  │  │   PWA)      │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Express.js API Gateway                          ││
│  │    (Rate Limiting, Auth, Logging, Request Routing)          ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │    Auth      │ │   Course     │ │    Quiz      │             │
│  │   Module     │ │   Module     │ │   Module     │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │   Payment    │ │   User       │ │  Analytics   │             │
│  │   Module     │ │   Module     │ │   Module     │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ Gamification │ │   Video      │ │ Notification │             │
│  │   Module     │ │  Streaming   │ │   Module     │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │  MongoDB     │ │    Redis     │ │  Cloudinary/ │             │
│  │   Atlas      │ │   Cache      │ │  Bunny CDN   │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  Stripe  │ │ SendGrid │ │  AWS S3  │ │ Firebase │            │
│  │ Payments │ │  Email   │ │ Storage  │ │   Auth   │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Content Hierarchy

```
Categories (hierarchical with parent/child)
    └── Courses
            └── Modules
                    └── Lessons
                            ├── Article (HTML content)
                            └── Quiz (linked to Quiz collection)
```

### 3.3 Key Architecture Principles

1. **Separation of Concerns**: Clear boundaries between modules
2. **API-First Design**: RESTful APIs with optional GraphQL
3. **Event-Driven Communication**: For async operations (notifications, analytics)
4. **Caching Strategy**: Multi-tier caching (Browser → CDN → Redis → Database)
5. **Horizontal Scalability**: Stateless services for easy scaling

---

## 4. Technology Stack

### 4.1 Frontend Stack

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **React 18+** | UI Framework | Component-based, large ecosystem, excellent DX |
| **Next.js 14+** | React Framework | SSR/SSG, routing, API routes, SEO optimization |
| **TypeScript** | Type Safety | Maintainability, better IDE support, fewer bugs |
| **TanStack Query** | Server State | Caching, background updates, optimistic updates |
| **Zustand/Redux Toolkit** | Client State | Lightweight, predictable state management |
| **Tailwind CSS** | Styling | Utility-first, rapid development, consistent design |
| **Shadcn/ui** | UI Components | Accessible, customizable component library |
| **React Hook Form** | Form Handling | Performance, validation, easy integration |
| **Zod** | Schema Validation | TypeScript-first validation |
| **Framer Motion** | Animations | Smooth, declarative animations |

### 4.2 Backend Stack

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Node.js 20+** | Runtime | Non-blocking I/O, JavaScript ecosystem |
| **Express.js** | Web Framework | Mature, flexible, extensive middleware |
| **TypeScript** | Type Safety | Consistent with frontend, better maintainability |
| **MongoDB Atlas** | Database | Flexible schema, horizontal scaling, managed service |
| **Mongoose** | ODM | Schema validation, middleware, query building |
| **Redis** | Caching/Sessions | In-memory speed, pub/sub, session storage |
| **Bull/BullMQ** | Job Queues | Background jobs, scheduled tasks, retries |
| **Socket.io** | Real-time | WebSocket abstraction, fallbacks |
| **Winston** | Logging | Structured logging, multiple transports |
| **Jest** | Testing | Unit/integration testing |

### 4.3 DevOps & Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Local development |
| **GitHub Actions** | CI/CD pipelines |
| **Vercel/Railway** | Frontend/Backend hosting |
| **MongoDB Atlas** | Managed database |
| **Cloudflare** | CDN, DDoS protection |
| **Bunny CDN** | Video streaming CDN |
| **AWS S3** | File storage |
| **Sentry** | Error monitoring |
| **LogRocket** | Session replay |

### 4.4 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint + Prettier** | Code quality & formatting |
| **Husky** | Git hooks |
| **Commitlint** | Commit message standards |
| **Playwright/Cypress** | E2E testing |
| **Storybook** | Component documentation |
| **Swagger/OpenAPI** | API documentation |

---

## 5. Database Design

### 5.1 MongoDB Collections Schema

#### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  passwordHash: String,
  profile: {
    firstName: String,
    lastName: String,
    avatar: String (URL),
    bio: String,
    timezone: String,
    language: String
  },
  role: String (enum: ['student', 'instructor', 'admin', 'superadmin']),
  subscription: {
    plan: String (enum: ['free', 'basic', 'premium', 'enterprise']),
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    status: String (enum: ['active', 'canceled', 'past_due', 'trialing'])
  },
  gamification: {
    points: Number,
    level: Number,
    badges: [{ badgeId: ObjectId, earnedAt: Date }],
    streak: {
      current: Number,
      longest: Number,
      lastActivityDate: Date
    }
  },
  preferences: {
    emailNotifications: Boolean,
    pushNotifications: Boolean,
    darkMode: Boolean
  },
  socialAuth: {
    google: { id: String, email: String },
    github: { id: String, username: String }
  },
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  isVerified: Boolean,
  isActive: Boolean
}
```

#### Courses Collection

```javascript
{
  _id: ObjectId,
  title: String,
  slug: String (unique, indexed),
  description: String,
  shortDescription: String,
  thumbnail: String (URL),
  previewVideo: String (URL),
  instructor: ObjectId (ref: Users),
  category: ObjectId (ref: Categories),
  subcategory: ObjectId (ref: Categories),
  tags: [String],
  level: String (enum: ['beginner', 'intermediate', 'advanced']),
  language: String,
  pricing: {
    type: String (enum: ['free', 'paid', 'subscription']),
    price: Number,
    currency: String,
    discount: {
      percentage: Number,
      validUntil: Date
    },
    stripePriceId: String
  },
  content: {
    totalDuration: Number (minutes),
    totalLessons: Number,
    totalQuizzes: Number,
    modules: [{
      _id: ObjectId,
      title: String,
      description: String,
      order: Number,
      lessons: [{
        _id: ObjectId,
        title: String,
        type: String (enum: ['article', 'quiz']),
        duration: Number,
        content: {
          articleContent: String (HTML content for articles),
          resources: [{ title: String, url: String, type: String }]
        },
        isPreview: Boolean,
        order: Number
      }]
    }]
  },
  requirements: [String],
  outcomes: [String],
  targetAudience: [String],
  stats: {
    enrollments: Number,
    completions: Number,
    averageRating: Number,
    totalReviews: Number
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  status: String (enum: ['draft', 'review', 'published', 'archived']),
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Enrollments Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: Users, indexed),
  course: ObjectId (ref: Courses, indexed),
  enrolledAt: Date,
  completedAt: Date,
  progress: {
    percentage: Number,
    completedLessons: [ObjectId],
    currentLesson: ObjectId,
    lastAccessedAt: Date,
    timeSpent: Number (minutes)
  },
  quizAttempts: [{
    quizId: ObjectId,
    attemptNumber: Number,
    score: Number,
    maxScore: Number,
    answers: [{ questionId: ObjectId, answer: Mixed, isCorrect: Boolean }],
    completedAt: Date,
    timeSpent: Number (seconds)
  }],
  certificate: {
    issued: Boolean,
    issuedAt: Date,
    certificateId: String,
    certificateUrl: String
  },
  payment: {
    orderId: ObjectId (ref: Orders),
    amount: Number,
    method: String
  },
  status: String (enum: ['active', 'completed', 'expired', 'refunded'])
}
```

#### Quizzes Collection

```javascript
{
  _id: ObjectId,
  course: ObjectId (ref: Courses),
  module: ObjectId,
  lesson: ObjectId,
  title: String,
  description: String,
  type: String (enum: ['practice', 'graded', 'final']),
  settings: {
    timeLimit: Number (minutes, null for unlimited),
    passingScore: Number (percentage),
    maxAttempts: Number (null for unlimited),
    shuffleQuestions: Boolean,
    shuffleAnswers: Boolean,
    showCorrectAnswers: Boolean,
    showExplanations: Boolean
  },
  questions: [{
    _id: ObjectId,
    type: String (enum: ['multiple-choice', 'multiple-select', 'true-false',
                         'fill-blank', 'matching', 'ordering', 'short-answer']),
    question: String,
    questionMedia: { type: String, url: String },
    options: [{
      _id: ObjectId,
      text: String,
      isCorrect: Boolean,
      media: { type: String, url: String }
    }],
    correctAnswer: Mixed,
    explanation: String,
    points: Number,
    difficulty: String (enum: ['easy', 'medium', 'hard']),
    tags: [String],
    order: Number
  }],
  stats: {
    totalAttempts: Number,
    averageScore: Number,
    passRate: Number
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: Users, indexed),
  orderNumber: String (unique),
  items: [{
    type: String (enum: ['course', 'subscription', 'bundle']),
    itemId: ObjectId,
    title: String,
    price: Number,
    discount: Number
  }],
  pricing: {
    subtotal: Number,
    discount: Number,
    tax: Number,
    total: Number,
    currency: String
  },
  coupon: {
    code: String,
    discountAmount: Number
  },
  payment: {
    provider: String (enum: ['stripe']),
    stripePaymentIntentId: String,
    stripeChargeId: String,
    status: String (enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded']),
    paidAt: Date
  },
  billing: {
    name: String,
    email: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  invoice: {
    number: String,
    url: String
  },
  status: String (enum: ['pending', 'completed', 'cancelled', 'refunded']),
  createdAt: Date,
  updatedAt: Date
}
```

#### Categories Collection

```javascript
{
  _id: ObjectId,
  name: String,
  slug: String (unique),
  description: String,
  icon: String,
  image: String (URL),
  parent: ObjectId (ref: Categories, null for top-level),
  order: Number,
  courseCount: Number,
  isActive: Boolean,
  seo: {
    metaTitle: String,
    metaDescription: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Reviews Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: Users),
  course: ObjectId (ref: Courses, indexed),
  rating: Number (1-5),
  title: String,
  content: String,
  helpful: {
    count: Number,
    users: [ObjectId]
  },
  instructorResponse: {
    content: String,
    respondedAt: Date
  },
  status: String (enum: ['pending', 'approved', 'rejected']),
  createdAt: Date,
  updatedAt: Date
}
```

#### Badges Collection

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  icon: String (URL),
  type: String (enum: ['achievement', 'milestone', 'skill', 'special']),
  criteria: {
    type: String (enum: ['courses_completed', 'quizzes_passed', 'streak_days',
                         'points_earned', 'reviews_written', 'custom']),
    threshold: Number,
    courseIds: [ObjectId],
    customLogic: String
  },
  points: Number,
  rarity: String (enum: ['common', 'uncommon', 'rare', 'epic', 'legendary']),
  isActive: Boolean,
  createdAt: Date
}
```

#### Notifications Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: Users, indexed),
  type: String (enum: ['course_update', 'quiz_result', 'badge_earned',
                       'certificate_ready', 'payment', 'system', 'promotional']),
  title: String,
  message: String,
  data: Mixed,
  link: String,
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}
```

### 5.2 Database Indexes

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ "subscription.status": 1, "subscription.currentPeriodEnd": 1 });
db.users.createIndex({ role: 1 });

// Courses
db.courses.createIndex({ slug: 1 }, { unique: true });
db.courses.createIndex({ status: 1, publishedAt: -1 });
db.courses.createIndex({ category: 1, status: 1 });
db.courses.createIndex({ instructor: 1 });
db.courses.createIndex({ "pricing.type": 1 });
db.courses.createIndex({ tags: 1 });
db.courses.createIndex({
  title: "text",
  description: "text",
  tags: "text"
}, { weights: { title: 10, tags: 5, description: 1 } });

// Enrollments
db.enrollments.createIndex({ user: 1, course: 1 }, { unique: true });
db.enrollments.createIndex({ user: 1, status: 1 });
db.enrollments.createIndex({ course: 1 });

// Orders
db.orders.createIndex({ user: 1, createdAt: -1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ "payment.stripePaymentIntentId": 1 });

// Reviews
db.reviews.createIndex({ course: 1, status: 1, createdAt: -1 });
db.reviews.createIndex({ user: 1 });

// Notifications
db.notifications.createIndex({ user: 1, isRead: 1, createdAt: -1 });
```

---

## 5.3 Current Seed Data

The platform is pre-populated with seed data for development and testing. This section documents the current data structure.

### 5.3.1 Users

| Field | Value |
|-------|-------|
| **Email** | instructor@example.com |
| **Role** | instructor |
| **Name** | Instructor User |
| **Status** | Verified, Active |

### 5.3.2 Categories (14 Total)

```
📁 Digital Transformation (parent: null)
    ├── 🤖 AI & Machine Learning
    ├── ☁️ Cloud Computing
    └── 📊 Data Analytics

📁 Web Development (parent: null)
    ├── 🎨 Frontend Development
    ├── ⚙️ Backend Development
    └── 🔗 Full-Stack Development

📁 Business & Tech (parent: null)
    ├── 📋 Project Management
    └── 👔 Leadership

📁 DevOps & Infrastructure (parent: null)
    ├── 🔄 CI/CD & Automation
    └── 🔒 Security
```

### 5.3.3 Courses (13 Total)

| # | Course Title | Category | Level | Lessons | Quizzes |
|---|--------------|----------|-------|---------|---------|
| 1 | Introduction to Artificial Intelligence | AI & ML | Beginner | 19 | 4 |
| 2 | Machine Learning Fundamentals | AI & ML | Intermediate | 19 | 0 |
| 3 | AWS Solutions Architect - Complete Guide | Cloud | Advanced | 22 | 3 |
| 4 | React 18 - The Complete Guide | Frontend | Beginner | 26 | 0 |
| 5 | Next.js 14 - Full-Stack Development | Full-Stack | Intermediate | 22 | 0 |
| 6 | Node.js & Express Bootcamp | Backend | Beginner | 22 | 0 |
| 7 | TypeScript Deep Dive | Frontend | Intermediate | 22 | 0 |
| 8 | Docker & Kubernetes Essentials | DevOps | Intermediate | 22 | 0 |
| 9 | CI/CD Pipeline Mastery | CI/CD | Intermediate | 18 | 0 |
| 10 | Agile Project Management with Scrum | Project Mgmt | Beginner | 19 | 2 |
| 11 | Tech Leadership Essentials | Leadership | Advanced | 18 | 0 |
| 12 | Data Analytics Masterclass | Data Analytics | Beginner | 17 | 0 |
| 13 | Cloud Security Fundamentals | Security | Beginner | 20 | 0 |

### 5.3.4 Course Structure Details

#### Course 1: Introduction to Artificial Intelligence

**Modules:**
1. **Introduction to AI** (5 lessons)
   - What is Artificial Intelligence? (article, preview)
   - History of AI (article)
   - Types of AI Systems (article)
   - AI vs Machine Learning vs Deep Learning (article)
   - Module 1 Quiz (quiz)

2. **Machine Learning Basics** (5 lessons)
   - What is Machine Learning? (article)
   - Supervised vs Unsupervised Learning (article)
   - Common ML Algorithms (article)
   - Hands-on: Your First ML Model (article)
   - Module 2 Quiz (quiz)

3. **Neural Networks Introduction** (4 lessons)
   - How Neural Networks Work (article)
   - Perceptrons and Activation Functions (article)
   - Building a Simple Neural Network (article)
   - Module 3 Quiz (quiz)

4. **AI Applications** (5 lessons)
   - AI in Healthcare (article)
   - AI in Finance (article)
   - AI in Transportation (article)
   - Ethical Considerations in AI (article)
   - Final Course Quiz (quiz)

#### Course 3: AWS Solutions Architect - Complete Guide

**Modules:**
1. **AWS Fundamentals** (4 lessons)
   - AWS Global Infrastructure (article)
   - IAM - Identity and Access Management (article)
   - AWS CLI and SDK Setup (article)
   - IAM Best Practices Quiz (quiz)

2. **Compute Services** (5 lessons)
   - EC2 Instance Types and Pricing (article)
   - EC2 Security Groups and Key Pairs (article)
   - Auto Scaling and Load Balancers (article)
   - Hands-on: Deploy a Web Application (article)
   - Compute Quiz (quiz)

3. **Storage Solutions** (4 lessons)
   - S3 Deep Dive (article)
   - EBS Volume Types (article)
   - S3 Lifecycle Policies (article)
   - Hands-on: Static Website on S3 (article)

4. **Database Services** (4 lessons)
   - RDS Overview and Setup (article)
   - DynamoDB Fundamentals (article)
   - ElastiCache for Performance (article)
   - Hands-on: Multi-AZ Database Setup (article)

5. **Serverless Architecture** (5 lessons)
   - AWS Lambda Deep Dive (article)
   - API Gateway Setup (article)
   - Step Functions for Workflows (article)
   - Build a Serverless API (article)
   - Final Exam (quiz)

#### Course 4: React 18 - The Complete Guide

**Modules:**
1. **React Fundamentals** (5 lessons)
2. **React Hooks** (6 lessons)
3. **State Management** (6 lessons)
4. **React Router** (5 lessons)
5. **Building Production Apps** (5 lessons)

#### Course 5: Next.js 14 - Full-Stack Development

**Modules:**
1. **Next.js Fundamentals** (5 lessons)
2. **Server Components** (5 lessons)
3. **Server Actions** (5 lessons)
4. **Authentication** (5 lessons)
5. **Database Integration** (4 lessons)

#### Course 6: Node.js & Express Bootcamp

**Modules:**
1. **Node.js Fundamentals** (5 lessons)
2. **Express.js Framework** (5 lessons)
3. **MongoDB & Mongoose** (5 lessons)
4. **Authentication & Security** (5 lessons)
5. **Production Ready** (4 lessons)

#### Course 10: Agile Project Management with Scrum

**Modules:**
1. **Agile Fundamentals** (5 lessons)
   - The Agile Manifesto (article)
   - Agile vs Waterfall (article)
   - Agile Principles (article)
   - Agile Mindset (article)
   - Agile Quiz (quiz)

2. **Scrum Framework** (5 lessons)
3. **Sprint Execution** (5 lessons)
4. **Advanced Scrum** (5 lessons, includes quiz)

### 5.3.5 Quizzes (9 Total)

| Quiz | Course | Type | Time Limit | Passing Score |
|------|--------|------|------------|---------------|
| Introduction to AI Quiz | Intro to AI | practice | 5 min | 70% |
| Machine Learning Basics Quiz | Intro to AI | practice | 5 min | 70% |
| Neural Networks Quiz | Intro to AI | practice | 5 min | 70% |
| AI Applications Quiz | Intro to AI | practice | 5 min | 70% |
| AWS Fundamentals Quiz | AWS Solutions | practice | 5 min | 70% |
| Compute Services Quiz | AWS Solutions | practice | 5 min | 70% |
| Serverless Architecture Quiz | AWS Solutions | practice | 5 min | 70% |
| Agile Fundamentals Quiz | Agile/Scrum | practice | 5 min | 70% |
| Advanced Scrum Quiz | Agile/Scrum | practice | 5 min | 70% |

**Quiz Settings (default for all):**
- Max Attempts: 3
- Shuffle Questions: Yes
- Shuffle Answers: Yes
- Show Correct Answers: Yes
- Show Explanations: Yes

**Question Format:**
Each quiz contains multiple-choice questions with:
- 4 options per question
- 1 correct answer
- Points awarded per correct answer

### 5.3.6 Quiz Random Selection System

The quiz system uses a **question pool** approach where each quiz can contain many questions, but only a subset is shown per attempt:

- **Default Questions Per Attempt:** 10
- **Random Selection:** Fisher-Yates shuffle algorithm
- **Unique Per Attempt:** Each attempt gets a different random set
- **Configurable:** API supports `?questionCount=N` parameter

**API Flow:**
1. `POST /quizzes/:id/start` - Returns 10 random questions from pool
2. Client receives `questionIds` array to track selected questions
3. `POST /quizzes/:id/submit` - Client sends back `questionIds` with answers
4. Server grades only the questions that were presented

---

## 5.4 AI Content Generation (Premium Feature)

Premium users (Basic, Premium, Enterprise plans) with instructor role can use AI to generate content.

### 5.4.1 AI Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /ai/generate-article` | Generate article content for a lesson |
| `POST /ai/generate-and-save-article` | Generate and save article to lesson |
| `POST /ai/generate-questions` | Generate quiz questions from lesson content |
| `POST /ai/generate-course-outline` | Generate complete course structure |
| `POST /ai/improve-article` | Improve existing article with AI |
| `POST /ai/add-questions-to-pool` | Add AI questions to quiz pool |

### 5.4.2 Access Requirements

- **Authentication:** Required (JWT token)
- **Subscription:** Basic, Premium, or Enterprise plan
- **Subscription Status:** Active or Trialing
- **Role:** Instructor, Admin, or Superadmin

### 5.4.3 AI Model

- **Provider:** OpenAI
- **Model:** GPT-4o-mini (cost-effective for content generation)
- **Features:**
  - Course outline generation
  - Article content in HTML format
  - Quiz question generation (multiple-choice, true-false, multiple-select)
  - Content improvement/enhancement

---

## 6. Feature Specifications

### 6.1 User Management Features

#### Authentication
- **Email/Password Registration** with email verification
- **Social Authentication** (Google, GitHub, LinkedIn)
- **Magic Link Login** for passwordless access
- **Two-Factor Authentication (2FA)** with TOTP
- **Password Reset** with secure token flow
- **Session Management** with JWT + refresh tokens
- **Remember Me** functionality

#### User Profile
- Profile photo upload with cropping
- Bio and professional information
- Social links (LinkedIn, GitHub, Twitter)
- Timezone and language preferences
- Notification preferences
- Privacy settings
- Learning goals and interests

#### Account Management
- Email change with verification
- Password change
- Account deletion (GDPR compliance)
- Data export (GDPR compliance)
- Connected accounts management
- Login history and active sessions

### 6.2 Course Features

#### Course Discovery
- **Category Browsing** with hierarchical navigation
- **Search** with filters (level, duration, price, rating)
- **Recommendations** based on user interests and history
- **Trending Courses** based on enrollments
- **New Releases** section
- **Featured Courses** (admin curated)
- **Learning Paths** (curated course sequences)

#### Course Detail Page
- Course overview with instructor info
- Curriculum preview with lesson titles
- Free preview lessons
- Student reviews and ratings
- Course requirements and outcomes
- Similar course recommendations
- Social sharing buttons
- Wishlist functionality

#### Course Player
- **Video Player** with:
  - Playback speed control (0.5x - 2x)
  - Quality selection (auto, 360p, 720p, 1080p)
  - Picture-in-Picture mode
  - Keyboard shortcuts
  - Closed captions/subtitles
  - Bookmark timestamps
  - Auto-resume from last position
- **Progress Sidebar** with lesson list
- **Notes Taking** synced with video timestamp
- **Resource Downloads** (PDFs, code files)
- **Discussion Thread** per lesson
- **Mark Complete** button
- **Next/Previous** navigation

#### Course Engagement
- Course Q&A section
- Discussion forums per course
- Student reviews and ratings
- Course announcements from instructor
- Downloadable resources
- Code playgrounds for exercises

### 6.3 Free vs Paid Course Structure

| Feature | Free Courses | Paid Courses |
|---------|--------------|--------------|
| Access Duration | Unlimited | Unlimited after purchase |
| Certificate | Basic completion | Professional certificate |
| Video Quality | Up to 720p | Up to 1080p |
| Downloadable Resources | Limited | Full access |
| Instructor Q&A | Community only | Direct instructor support |
| Quizzes | Basic quizzes | Full assessment suite |
| Projects | None | Hands-on projects |
| Priority Support | No | Yes |

### 6.4 Instructor Features

- Course creation wizard
- Rich text editor for lesson content
- Video upload with processing status
- Quiz and assessment builder
- Resource file management
- Student analytics dashboard
- Revenue and payout reports
- Student Q&A management
- Course announcement system
- Bulk actions (lessons, students)

### 6.5 Admin Features

- Dashboard with key metrics
- User management (CRUD, roles, bans)
- Course management and moderation
- Category management
- Coupon/discount management
- Revenue reports and analytics
- Platform settings
- Email template management
- Content moderation queue
- System logs and audit trail

---

## 7. User Roles & Permissions

### 7.1 Role Hierarchy

```
SuperAdmin
    └── Admin
            └── Instructor
                    └── Student
                            └── Guest
```

### 7.2 Permission Matrix

| Permission | Guest | Student | Instructor | Admin | SuperAdmin |
|------------|-------|---------|------------|-------|------------|
| Browse courses | ✓ | ✓ | ✓ | ✓ | ✓ |
| View free content | ✓ | ✓ | ✓ | ✓ | ✓ |
| Enroll in courses | ✗ | ✓ | ✓ | ✓ | ✓ |
| Purchase courses | ✗ | ✓ | ✓ | ✓ | ✓ |
| Take quizzes | ✗ | ✓ | ✓ | ✓ | ✓ |
| Write reviews | ✗ | ✓ | ✓ | ✓ | ✓ |
| Create courses | ✗ | ✗ | ✓ | ✓ | ✓ |
| Manage own courses | ✗ | ✗ | ✓ | ✓ | ✓ |
| View student data | ✗ | ✗ | Own students | ✓ | ✓ |
| Manage all courses | ✗ | ✗ | ✗ | ✓ | ✓ |
| Manage users | ✗ | ✗ | ✗ | ✓ | ✓ |
| Manage categories | ✗ | ✗ | ✗ | ✓ | ✓ |
| View revenue reports | ✗ | ✗ | Own | All | All |
| Manage coupons | ✗ | ✗ | ✗ | ✓ | ✓ |
| System settings | ✗ | ✗ | ✗ | ✗ | ✓ |
| Manage admins | ✗ | ✗ | ✗ | ✗ | ✓ |

### 7.3 RBAC Implementation

```javascript
// Role-based middleware example
const permissions = {
  student: ['courses.enroll', 'courses.view', 'quizzes.take', 'reviews.create'],
  instructor: ['courses.create', 'courses.update', 'quizzes.create', 'analytics.own'],
  admin: ['courses.manage', 'users.manage', 'categories.manage', 'coupons.manage'],
  superadmin: ['*']
};

// JWT payload includes role
{
  userId: "...",
  email: "...",
  role: "instructor",
  permissions: ["courses.create", "courses.update", ...],
  iat: ...,
  exp: ...
}
```

---

## 8. Payment & Monetization

### 8.1 Pricing Models

#### One-Time Purchase
- Single course purchase
- Course bundles at discounted rates
- Lifetime access upon purchase

#### Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0/mo | Access to free courses only |
| **Basic** | $19/mo | Access to all courses, basic certificates |
| **Premium** | $49/mo | All Basic + priority support, downloadable resources |
| **Enterprise** | Custom | Team management, analytics, SSO, dedicated support |

### 8.2 Stripe Integration

#### Payment Methods
- Credit/Debit Cards
- Apple Pay / Google Pay
- Bank transfers (SEPA, ACH)
- Regional payment methods

#### Stripe Features Used
- **Stripe Checkout** for seamless payment flow
- **Stripe Elements** for custom payment forms
- **Stripe Billing** for subscriptions
- **Stripe Invoicing** for enterprise customers
- **Stripe Connect** for instructor payouts
- **Stripe Webhooks** for payment events

#### Webhook Events Handled

```javascript
const webhookEvents = [
  'checkout.session.completed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.updated',
  'charge.refunded'
];
```

### 8.3 Coupon & Discount System

| Coupon Type | Description |
|-------------|-------------|
| Percentage Off | 10%, 25%, 50% discounts |
| Fixed Amount | $5, $10, $20 off |
| Free Trial Extension | Extra trial days |
| Bundle Discount | Discount on multiple courses |
| First Purchase | One-time new user discount |
| Referral | Discount for referrer and referee |

#### Coupon Settings
- Usage limits (total and per-user)
- Valid date range
- Minimum purchase amount
- Applicable products/categories
- Stackable with other offers

### 8.4 Instructor Revenue Share

```
Revenue Split:
├── Platform: 30%
└── Instructor: 70%

Payout Schedule:
├── Minimum threshold: $50
├── Payout frequency: Monthly
└── Payment method: Stripe Connect
```

### 8.5 Refund Policy

- 30-day money-back guarantee
- Automatic refund if <10% course completed
- Manual review for partial completions
- No refunds for completed courses
- Subscription pro-rata refunds available

---

## 9. Quiz & Assessment System

### 9.1 Question Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Multiple Choice** | Single correct answer | Factual recall |
| **Multiple Select** | Multiple correct answers | Comprehensive understanding |
| **True/False** | Binary choice | Quick checks |
| **Fill in the Blank** | Text input completion | Terminology |
| **Matching** | Pair items from two lists | Associations |
| **Ordering** | Arrange items in sequence | Process understanding |
| **Short Answer** | Free text response | Deeper understanding |
| **Code Challenge** | Write/complete code | Programming courses |

### 9.2 Quiz Settings

```javascript
{
  // Time settings
  timeLimit: 30, // minutes, null for unlimited

  // Attempt settings
  maxAttempts: 3, // null for unlimited
  retakeDelay: 24, // hours between attempts

  // Scoring
  passingScore: 70, // percentage
  pointsPerQuestion: 10,
  negativeMarking: false,
  partialCredit: true,

  // Display settings
  shuffleQuestions: true,
  shuffleAnswers: true,
  showOneQuestionAtATime: false,
  allowBackNavigation: true,

  // Feedback settings
  showScoreImmediately: true,
  showCorrectAnswers: 'after_attempt', // 'never', 'after_passing', 'after_attempt'
  showExplanations: true,

  // Proctoring (future)
  requireCamera: false,
  preventTabSwitch: true
}
```

### 9.3 Quiz Flow

```
1. Quiz Introduction
   └── Instructions, time limit, attempts remaining

2. Question Display
   ├── Progress bar
   ├── Timer (if applicable)
   ├── Question navigation
   └── Flag for review

3. Answer Submission
   ├── Auto-save answers
   ├── Review flagged questions
   └── Final submission confirmation

4. Results Screen
   ├── Score breakdown
   ├── Time taken
   ├── Correct/incorrect answers
   ├── Explanations (if enabled)
   └── Retry option (if attempts remaining)

5. Progress Update
   ├── Update course progress
   ├── Award points
   ├── Check badge criteria
   └── Update leaderboard
```

### 9.4 Practice Mode vs Graded Mode

| Feature | Practice Mode | Graded Mode |
|---------|--------------|-------------|
| Time Limit | No | Yes (optional) |
| Attempts | Unlimited | Limited |
| Score Recording | No | Yes |
| Affects Progress | Partial | Full |
| Immediate Feedback | Yes | Configurable |
| Certificate Requirement | No | Yes |

### 9.5 Assessment Analytics

- Question difficulty analysis
- Discrimination index
- Time per question statistics
- Common wrong answers
- Pass/fail trends
- Improvement over attempts

---

## 10. Gamification System

### 10.1 Points System

| Activity | Points |
|----------|--------|
| Daily login | 5 |
| Complete lesson | 10 |
| Complete module | 25 |
| Complete course | 100 |
| Pass quiz (first attempt) | 50 |
| Pass quiz (retry) | 25 |
| Perfect quiz score | 75 |
| Write review | 20 |
| Helpful review (upvoted) | 5 |
| Refer a friend | 100 |
| Streak milestone (7 days) | 50 |
| Streak milestone (30 days) | 200 |

### 10.2 Level System

```
Level Progression:
├── Level 1: Beginner (0 - 500 points)
├── Level 2: Apprentice (501 - 1,500 points)
├── Level 3: Learner (1,501 - 3,500 points)
├── Level 4: Achiever (3,501 - 7,000 points)
├── Level 5: Expert (7,001 - 15,000 points)
├── Level 6: Master (15,001 - 30,000 points)
└── Level 7: Legend (30,001+ points)
```

### 10.3 Badge Categories

#### Achievement Badges
- **First Steps**: Complete first lesson
- **Quick Learner**: Complete 5 courses
- **Dedicated**: Complete 10 courses
- **Scholar**: Complete 25 courses
- **Polymath**: Complete courses in 5+ categories

#### Streak Badges
- **Consistent**: 7-day streak
- **Committed**: 30-day streak
- **Unstoppable**: 100-day streak
- **Legendary**: 365-day streak

#### Quiz Badges
- **Quiz Whiz**: Pass 10 quizzes
- **Perfect Score**: Get 100% on 5 quizzes
- **Speed Demon**: Complete quiz in under 50% time limit
- **Persistence**: Pass quiz after 3 attempts

#### Community Badges
- **Reviewer**: Write 5 reviews
- **Helpful**: Get 10 upvotes on reviews
- **Ambassador**: Refer 5 friends

#### Special Badges
- **Early Adopter**: Join in first month
- **Beta Tester**: Report bugs
- **Founding Member**: First 1000 users

### 10.4 Leaderboards

- **Weekly Leaderboard**: Points earned this week
- **Monthly Leaderboard**: Points earned this month
- **All-Time Leaderboard**: Total points
- **Course Leaderboard**: Per-course competition
- **Friends Leaderboard**: Compare with connections

### 10.5 Streak System

```javascript
{
  currentStreak: 15,
  longestStreak: 45,
  lastActivityDate: "2025-01-15",

  // Grace period
  gracePeriodHours: 24,

  // Streak protection (premium feature)
  freezesAvailable: 2,
  freezesUsed: 0,

  // Rewards
  streakMilestones: [7, 14, 30, 60, 100, 365],
  rewardsEarned: [7, 14, 30]
}
```

### 10.6 Certificates

#### Certificate Types
1. **Course Completion Certificate**
   - Issued upon 100% completion
   - Includes course name, date, instructor
   - Unique verification code
   - Shareable on LinkedIn

2. **Specialization Certificate**
   - Complete a learning path
   - Multiple courses in a track
   - Enhanced credentials

3. **Quiz Mastery Certificate**
   - Score 90%+ on final assessment
   - Demonstrates proficiency

#### Certificate Features
- PDF download
- Unique verification URL
- LinkedIn sharing integration
- Blockchain verification (future)
- Printable format
- Company branding for enterprise

---

## 11. Analytics & Reporting

### 11.1 Student Dashboard Metrics

```
Learning Overview
├── Courses in progress: 3
├── Courses completed: 12
├── Total learning hours: 45.5
├── Current streak: 15 days
├── Points earned: 4,520
└── Badges earned: 8

This Week
├── Hours learned: 3.5
├── Lessons completed: 12
├── Quizzes passed: 3
└── Points earned: 180

Course Progress
├── Course A: 75% ████████░░
├── Course B: 45% █████░░░░░
└── Course C: 20% ██░░░░░░░░
```

### 11.2 Instructor Analytics

| Metric | Description |
|--------|-------------|
| Total Enrollments | Students enrolled in all courses |
| Active Students | Students active in last 30 days |
| Completion Rate | % of enrolled students who complete |
| Average Rating | Mean rating across all courses |
| Revenue | Total and per-course earnings |
| Student Engagement | Video watch time, quiz attempts |
| Top Performing Content | Highest-rated lessons |
| Drop-off Points | Where students stop |

### 11.3 Admin Dashboard

```
Platform Overview
├── Total Users: 15,420
├── Active Subscriptions: 3,210
├── Monthly Revenue: $45,230
├── New Signups (30d): 890
└── Churn Rate: 5.2%

Content Stats
├── Total Courses: 245
├── Published: 198
├── In Review: 12
├── Total Lessons: 4,520
└── Total Video Hours: 850

Engagement
├── Daily Active Users: 2,340
├── Avg Session Duration: 25 min
├── Courses Started (30d): 1,234
├── Courses Completed (30d): 456
└── Avg Completion Rate: 37%
```

### 11.4 Report Types

| Report | Audience | Frequency |
|--------|----------|-----------|
| Learner Progress | Students | Real-time |
| Course Performance | Instructors | Weekly |
| Revenue Summary | Instructors, Admin | Monthly |
| User Acquisition | Admin | Weekly |
| Content Engagement | Admin | Weekly |
| Quiz Analytics | Instructors | Per-quiz |
| Subscription Metrics | Admin | Monthly |
| Cohort Analysis | Admin | Monthly |

### 11.5 Data Export

- CSV export for all reports
- PDF report generation
- Integration with Google Analytics
- Integration with business analytics tools (Power BI, Tableau)
- Scheduled email reports

---

## 12. Security Implementation

### 12.1 Authentication Security

```
Authentication Stack
├── JWT Access Tokens (15 min expiry)
├── Refresh Tokens (7 days, rotating)
├── HttpOnly Cookies (production)
├── CSRF Protection
├── Rate Limiting (login attempts)
└── Password Requirements
    ├── Minimum 8 characters
    ├── Uppercase + lowercase
    ├── Numbers
    └── Special characters
```

### 12.2 Authorization Security

- Role-Based Access Control (RBAC)
- Resource-level permissions
- JWT claim validation
- API endpoint protection
- Admin action audit logging

### 12.3 Data Security

| Measure | Implementation |
|---------|----------------|
| Encryption at Rest | MongoDB Atlas encryption |
| Encryption in Transit | TLS 1.3 everywhere |
| Password Hashing | bcrypt (cost factor 12) |
| Sensitive Data | AES-256 encryption |
| PII Handling | Tokenization, masking |
| Backup Encryption | AES-256 |

### 12.4 Application Security

- **Input Validation**: Zod schemas on all inputs
- **Output Encoding**: XSS prevention
- **SQL Injection**: N/A (MongoDB), but NoSQL injection prevention
- **CSRF Protection**: Token-based
- **Security Headers**: Helmet.js implementation
- **Content Security Policy**: Strict CSP
- **Dependency Scanning**: npm audit, Snyk
- **Secret Management**: Environment variables, Vault

### 12.5 Infrastructure Security

```
Security Layers
├── Cloudflare WAF
├── DDoS Protection
├── Rate Limiting (per IP, per user)
├── Geo-blocking (optional)
├── Bot Protection
├── SSL/TLS Termination
└── VPC Isolation (MongoDB Atlas)
```

### 12.6 Compliance

- **GDPR**: Data export, deletion, consent
- **CCPA**: California privacy compliance
- **PCI DSS**: Stripe handles card data
- **SOC 2**: Infrastructure providers

### 12.7 Security Monitoring

- Real-time threat detection
- Login anomaly detection
- Failed login alerts
- Unusual activity patterns
- Security event logging
- Incident response procedures

---

## 13. Third-Party Integrations

### 13.1 Payment & Finance

| Service | Purpose |
|---------|---------|
| **Stripe** | Payment processing, subscriptions, payouts |
| **Stripe Tax** | Automatic tax calculation |
| **Stripe Radar** | Fraud detection |

### 13.2 Communication

| Service | Purpose |
|---------|---------|
| **SendGrid** | Transactional emails |
| **Twilio** | SMS notifications (optional) |
| **Intercom/Crisp** | Customer support chat |
| **Pusher/Socket.io** | Real-time notifications |

### 13.3 Media & Content

| Service | Purpose |
|---------|---------|
| **Bunny CDN** | Video streaming |
| **Cloudinary** | Image optimization |
| **AWS S3** | File storage |
| **Vimeo OTT** | Alternative video hosting |

### 13.4 Analytics & Monitoring

| Service | Purpose |
|---------|---------|
| **Google Analytics 4** | User analytics |
| **Mixpanel** | Product analytics |
| **Sentry** | Error tracking |
| **LogRocket** | Session replay |
| **Hotjar** | Heatmaps, recordings |

### 13.5 Authentication

| Service | Purpose |
|---------|---------|
| **Google OAuth** | Social login |
| **GitHub OAuth** | Developer social login |
| **LinkedIn OAuth** | Professional social login |

### 13.6 Development & DevOps

| Service | Purpose |
|---------|---------|
| **GitHub** | Code repository |
| **GitHub Actions** | CI/CD |
| **Vercel** | Frontend hosting |
| **Railway/Render** | Backend hosting |
| **MongoDB Atlas** | Database hosting |
| **Redis Cloud** | Caching |

### 13.7 Future Integrations

- **OpenAI/Claude API**: AI-powered tutoring
- **Zoom/Google Meet**: Live sessions
- **Calendly**: Scheduling
- **Zapier**: Workflow automation
- **Slack**: Team notifications

---

## 14. API Specifications

### 14.1 API Design Principles

- RESTful API design
- JSON request/response format
- Consistent error handling
- Pagination with cursor-based navigation
- Rate limiting per endpoint
- API versioning (URL-based)

### 14.2 API Endpoints Overview

```
Authentication
├── POST   /api/v1/auth/register
├── POST   /api/v1/auth/login
├── POST   /api/v1/auth/logout
├── POST   /api/v1/auth/refresh
├── POST   /api/v1/auth/forgot-password
├── POST   /api/v1/auth/reset-password
├── POST   /api/v1/auth/verify-email
├── GET    /api/v1/auth/me
└── POST   /api/v1/auth/oauth/:provider

Users
├── GET    /api/v1/users/profile
├── PATCH  /api/v1/users/profile
├── PATCH  /api/v1/users/password
├── DELETE /api/v1/users/account
├── GET    /api/v1/users/enrollments
├── GET    /api/v1/users/certificates
├── GET    /api/v1/users/progress
└── GET    /api/v1/users/notifications

Courses
├── GET    /api/v1/courses
├── GET    /api/v1/courses/:slug
├── GET    /api/v1/courses/:slug/curriculum
├── POST   /api/v1/courses/:slug/enroll
├── GET    /api/v1/courses/:slug/progress
├── PATCH  /api/v1/courses/:slug/lessons/:lessonId/complete
├── GET    /api/v1/courses/:slug/reviews
├── POST   /api/v1/courses/:slug/reviews
└── GET    /api/v1/courses/categories/:category

Quizzes
├── GET    /api/v1/quizzes/:quizId
├── POST   /api/v1/quizzes/:quizId/start
├── POST   /api/v1/quizzes/:quizId/submit
├── GET    /api/v1/quizzes/:quizId/results
└── GET    /api/v1/quizzes/:quizId/attempts

Payments
├── POST   /api/v1/payments/checkout
├── POST   /api/v1/payments/webhook
├── GET    /api/v1/payments/orders
├── GET    /api/v1/payments/orders/:orderId
├── POST   /api/v1/payments/subscription
├── DELETE /api/v1/payments/subscription
└── POST   /api/v1/payments/apply-coupon

Instructor (Protected)
├── GET    /api/v1/instructor/courses
├── POST   /api/v1/instructor/courses
├── PATCH  /api/v1/instructor/courses/:id
├── DELETE /api/v1/instructor/courses/:id
├── POST   /api/v1/instructor/courses/:id/lessons
├── POST   /api/v1/instructor/courses/:id/quizzes
├── GET    /api/v1/instructor/analytics
└── GET    /api/v1/instructor/revenue

Admin (Protected)
├── GET    /api/v1/admin/users
├── PATCH  /api/v1/admin/users/:id
├── GET    /api/v1/admin/courses
├── PATCH  /api/v1/admin/courses/:id/status
├── GET    /api/v1/admin/categories
├── POST   /api/v1/admin/categories
├── GET    /api/v1/admin/coupons
├── POST   /api/v1/admin/coupons
├── GET    /api/v1/admin/analytics
└── GET    /api/v1/admin/reports
```

### 14.3 Response Format

```javascript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "hasMore": true
    }
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### 14.4 Rate Limits

| Endpoint Category | Limit |
|-------------------|-------|
| Authentication | 10 requests/minute |
| Public API | 100 requests/minute |
| Authenticated API | 300 requests/minute |
| Admin API | 500 requests/minute |
| Webhooks | 1000 requests/minute |

---

## 15. Deployment Strategy

### 15.1 Environment Setup

```
Environments
├── Development (local)
│   ├── Local Node.js server
│   ├── Local MongoDB (Docker)
│   └── Local Redis (Docker)
├── Staging
│   ├── Vercel Preview
│   ├── Railway Staging
│   └── MongoDB Atlas (Dev cluster)
└── Production
    ├── Vercel Production
    ├── Railway Production
    └── MongoDB Atlas (Production cluster)
```

### 15.2 CI/CD Pipeline

```yaml
# GitHub Actions Workflow
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    - Lint code
    - Run unit tests
    - Run integration tests
    - Check types

  build:
    - Build frontend
    - Build backend
    - Build Docker images

  deploy-staging:
    - Deploy to staging (on develop)
    - Run E2E tests

  deploy-production:
    - Deploy to production (on main)
    - Health checks
    - Notify team
```

### 15.3 Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE                                   │
│              (CDN, DDoS Protection, WAF)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│     VERCEL       │ │    RAILWAY       │ │   BUNNY CDN      │
│   (Frontend)     │ │   (Backend)      │ │   (Video)        │
│   - Next.js      │ │   - Node.js      │ │   - HLS Stream   │
│   - Static       │ │   - Express      │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  MONGODB ATLAS   │ │   REDIS CLOUD    │ │     AWS S3       │
│   (Database)     │ │   (Cache)        │ │   (Storage)      │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

### 15.4 Scaling Strategy

| Component | Scaling Approach |
|-----------|------------------|
| Frontend | Vercel automatic scaling, edge caching |
| Backend | Railway auto-scaling, horizontal pods |
| Database | MongoDB Atlas auto-scaling, sharding |
| Cache | Redis Cluster mode |
| Video | Bunny CDN edge locations |
| Storage | S3 with CloudFront |

### 15.5 Monitoring & Alerting

```
Monitoring Stack
├── Application Monitoring
│   ├── Sentry (errors)
│   ├── LogRocket (sessions)
│   └── Custom logging (Winston)
├── Infrastructure Monitoring
│   ├── Railway metrics
│   ├── MongoDB Atlas monitoring
│   └── Vercel analytics
├── Alerting
│   ├── PagerDuty / OpsGenie
│   ├── Slack notifications
│   └── Email alerts
└── Uptime Monitoring
    └── Better Uptime / Pingdom
```

---

## 16. Development Phases

### Phase 1: Foundation (MVP)

**Core Features:**
- User registration/login (email + Google OAuth)
- Course listing and detail pages
- Free course access
- Basic video player
- Course progress tracking
- Simple quiz system (multiple choice)
- User profile
- Mobile-responsive design

**Technical:**
- Next.js frontend setup
- Express backend setup
- MongoDB Atlas configuration
- Basic API endpoints
- JWT authentication
- Basic CI/CD pipeline

### Phase 2: Monetization

**Features:**
- Stripe payment integration
- Course purchasing flow
- Order history
- Basic subscription system
- Coupon/discount codes
- Invoice generation
- Instructor dashboard (basic)

**Technical:**
- Stripe Checkout integration
- Webhook handling
- Subscription billing
- Email notifications (SendGrid)

### Phase 3: Enhanced Learning

**Features:**
- Advanced quiz types (all types)
- Timed assessments
- Certificate generation
- Course reviews and ratings
- Course search with filters
- Learning paths
- Bookmarks and notes

**Technical:**
- Advanced quiz engine
- PDF certificate generation
- Elasticsearch integration (optional)
- Redis caching

### Phase 4: Gamification & Engagement

**Features:**
- Points system
- Badges and achievements
- Leaderboards
- Streak tracking
- Progress milestones
- Social sharing
- Email drip campaigns

**Technical:**
- Gamification service
- Background job processing
- Push notifications
- Analytics events

### Phase 5: Advanced Features

**Features:**
- Full instructor tools
- Course creation wizard
- Video upload processing
- Advanced analytics
- Admin dashboard
- Content moderation
- Multi-language support

**Technical:**
- Video transcoding pipeline
- Admin panel (React Admin)
- Advanced reporting
- i18n implementation

### Phase 6: Scale & Optimize

**Features:**
- Live sessions (Zoom integration)
- Discussion forums
- AI-powered recommendations
- Mobile app (React Native)
- Enterprise features
- API access for partners

**Technical:**
- Microservices migration (as needed)
- Performance optimization
- Advanced caching
- CDN optimization
- Load testing

---

## Appendix A: Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourplatform.com
API_URL=https://api.yourplatform.com

# Database
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...

# Authentication
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@yourplatform.com

# Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_REGION=us-east-1

# Video
BUNNY_API_KEY=...
BUNNY_LIBRARY_ID=...
BUNNY_CDN_URL=...

# Monitoring
SENTRY_DSN=https://...
```

---

## Appendix B: Recommended Packages

### Frontend (package.json)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-*": "latest",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.0",
    "video.js": "^8.6.0",
    "@stripe/stripe-js": "^2.2.0",
    "@stripe/react-stripe-js": "^2.4.0",
    "next-auth": "^4.24.0",
    "axios": "^1.6.0",
    "date-fns": "^2.30.0",
    "react-markdown": "^9.0.0"
  }
}
```

### Backend (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^8.0.0",
    "stripe": "^14.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "ioredis": "^5.3.0",
    "bullmq": "^4.14.0",
    "zod": "^3.22.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.0",
    "winston": "^3.11.0",
    "nodemailer": "^6.9.0",
    "@sendgrid/mail": "^7.7.0",
    "multer": "^1.4.5",
    "sharp": "^0.33.0",
    "uuid": "^9.0.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "socket.io": "^4.7.0"
  }
}
```

---

## Appendix C: Folder Structure

```
project/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/                # App router pages
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilities
│   │   ├── stores/             # Zustand stores
│   │   └── styles/             # Global styles
│   │
│   └── api/                    # Express backend
│       ├── src/
│       │   ├── config/         # Configuration
│       │   ├── controllers/    # Route handlers
│       │   ├── middleware/     # Express middleware
│       │   ├── models/         # Mongoose models
│       │   ├── routes/         # Route definitions
│       │   ├── services/       # Business logic
│       │   ├── utils/          # Helpers
│       │   ├── validators/     # Zod schemas
│       │   └── app.ts          # Express app
│       └── tests/              # Test files
│
├── packages/
│   ├── shared/                 # Shared types/utils
│   └── ui/                     # Shared UI components
│
├── docker/                     # Docker configs
├── scripts/                    # Build/deploy scripts
├── docs/                       # Documentation
└── .github/                    # GitHub Actions
```

---

## Document Information

| Item | Details |
|------|---------|
| **Version** | 1.0.0 |
| **Created** | December 2025 |
| **Last Updated** | December 2025 |
| **Author** | Platform Development Team |

---

## Sources & References

- [Building Smart Learning Platforms: Modern Tech Stack & Best Practices for 2025](https://dev.to/gloobia/building-smart-learning-platforms-modern-tech-stack-best-practices-for-2025-4n6c)
- [Site Architecture and System Design for E-Learning Platform](https://www.fastpix.io/blog/site-architecture-and-system-design-for-an-e-learning-platform)
- [Building a Modern Learning Platform: Architecture and Implementation Secrets](https://classloom.com/2025/10/31/building-a-modern-learning-platform-architecture-and-implementation-secrets/)
- [E-Learning Platform Requirements Checklist | Complete Guide for 2025](https://www.paradisosolutions.com/blog/elearning-platform-requirements/)
- [Stripe Payment Processing Best Practices](https://stripe.com/guides/payment-processing-best-practices)
- [Build a Subscriptions Integration | Stripe Documentation](https://docs.stripe.com/billing/subscriptions/build-subscriptions)
- [MongoDB Atlas Learning Hub](https://www.mongodb.com/resources/product/platform/atlas-learning-hub)
- [Authentication and Authorization: JWT, OAuth2, and RBAC](https://toxigon.com/authentication-and-authorization-jwt-oauth2-rbac)
- [11 LMS Reports You Need to Track and Optimize in 2025](https://www.educate-me.co/blog/lms-reporting)
- [Gamification for Learning: How to Boost Engagement with Points, Badges & Rewards](https://www.buddyboss.com/blog/gamification-for-learning-to-boost-engagement-with-points-badges-rewards/)
- [The Role of Gamified E-quizzes on Student Learning and Engagement](https://www.sciencedirect.com/science/article/abs/pii/S0360131519302829)
