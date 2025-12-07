# DX Education Platform - Database Schema Documentation

**Database:** MongoDB (via Mongoose ODM)
**Total Collections:** 8

---

## Table of Contents

1. [Users](#1-users-collection)
2. [Courses](#2-courses-collection)
3. [Categories](#3-categories-collection)
4. [Enrollments](#4-enrollments-collection)
5. [Quizzes](#5-quizzes-collection)
6. [Orders](#6-orders-collection)
7. [Reviews](#7-reviews-collection)
8. [Badges](#8-badges-collection)
9. [Entity Relationships](#entity-relationship-diagram)

---

## 1. Users Collection

**Collection Name:** `users`
**Model File:** `apps/api/src/models/User.ts`

### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Primary key |
| `email` | String | Yes | - | Unique, lowercase, validated email |
| `password` | String | No | - | Hashed (bcrypt, 12 rounds), select: false |

#### Profile (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `profile.firstName` | String | Yes | - | Max 50 characters |
| `profile.lastName` | String | Yes | - | Max 50 characters |
| `profile.avatar` | String | No | - | Avatar image URL |
| `profile.bio` | String | No | - | Max 500 characters |
| `profile.timezone` | String | No | 'UTC' | User timezone |
| `profile.language` | String | No | 'en' | Preferred language |

#### Role & Subscription

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `role` | Enum | No | 'student' | 'student' \| 'instructor' \| 'admin' \| 'superadmin' |
| `subscription.plan` | Enum | No | 'free' | 'free' \| 'basic' \| 'premium' \| 'enterprise' |
| `subscription.stripeCustomerId` | String | No | - | Stripe customer ID |
| `subscription.stripeSubscriptionId` | String | No | - | Stripe subscription ID |
| `subscription.currentPeriodStart` | Date | No | - | Billing period start |
| `subscription.currentPeriodEnd` | Date | No | - | Billing period end |
| `subscription.status` | Enum | No | 'inactive' | 'active' \| 'canceled' \| 'past_due' \| 'trialing' \| 'inactive' |

#### Gamification (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `gamification.points` | Number | No | 0 | Total points earned |
| `gamification.level` | Number | No | 1 | Current level |
| `gamification.badges` | Array | No | [] | [{badgeId: ObjectId, earnedAt: Date}] |
| `gamification.streak.current` | Number | No | 0 | Current streak days |
| `gamification.streak.longest` | Number | No | 0 | Longest streak achieved |
| `gamification.streak.lastActivityDate` | Date | No | - | Last activity timestamp |

#### Preferences (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `preferences.emailNotifications` | Boolean | No | true | Email notifications enabled |
| `preferences.pushNotifications` | Boolean | No | true | Push notifications enabled |
| `preferences.darkMode` | Boolean | No | false | Dark mode preference |

#### Social Authentication (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `socialAuth.google.id` | String | No | - | Google OAuth ID |
| `socialAuth.google.email` | String | No | - | Google email |
| `socialAuth.github.id` | String | No | - | GitHub OAuth ID |
| `socialAuth.github.username` | String | No | - | GitHub username |

#### Account Status

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `isVerified` | Boolean | No | false | Email verified status |
| `isActive` | Boolean | No | true | Account active status |
| `verificationToken` | String | No | - | Email verification token |
| `resetPasswordToken` | String | No | - | Password reset token |
| `resetPasswordExpires` | Date | No | - | Reset token expiry |
| `lastLoginAt` | Date | No | - | Last login timestamp |
| `createdAt` | Date | Auto | - | Creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

### Virtuals

| Name | Returns | Description |
|------|---------|-------------|
| `fullName` | String | Concatenates `profile.firstName` + `profile.lastName` |

### Indexes

| Fields | Type | Description |
|--------|------|-------------|
| `email` | Unique | Fast email lookups |
| `role` | Standard | Filter by role |
| `subscription.status` | Standard | Filter by subscription |
| `createdAt` | Descending | Sort by creation date |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `comparePassword` | candidatePassword: string | Promise\<boolean\> | Compares password with hash |

### Middleware

- **Pre-save:** Hashes password with bcrypt (12 rounds) if modified

---

## 2. Courses Collection

**Collection Name:** `courses`
**Model File:** `apps/api/src/models/Course.ts`

### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Primary key |
| `title` | String | Yes | - | Max 100 characters |
| `slug` | String | Yes | - | Unique, auto-generated from title |
| `description` | String | Yes | - | Max 5000 characters |
| `shortDescription` | String | Yes | - | Max 300 characters |
| `thumbnail` | String | No | - | Thumbnail image URL |
| `previewVideo` | String | No | - | Preview video URL |
| `instructor` | ObjectId | Yes | - | Reference to User |
| `category` | ObjectId | Yes | - | Reference to Category |
| `subcategory` | ObjectId | No | - | Reference to Category |
| `tags` | [String] | No | [] | Array of tag strings |
| `level` | Enum | No | 'beginner' | 'beginner' \| 'intermediate' \| 'advanced' |
| `language` | String | No | 'en' | Course language code |

#### Pricing (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `pricing.type` | Enum | No | 'free' | 'free' \| 'paid' \| 'subscription' |
| `pricing.price` | Number | No | 0 | Price in currency units |
| `pricing.currency` | String | No | 'USD' | Currency code |
| `pricing.discount.percentage` | Number | No | - | Discount percentage (0-100) |
| `pricing.discount.validUntil` | Date | No | - | Discount expiry date |
| `pricing.stripePriceId` | String | No | - | Stripe price ID |

#### Content (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `content.totalDuration` | Number | No | 0 | Total duration in seconds |
| `content.totalLessons` | Number | No | 0 | Total lesson count |
| `content.totalQuizzes` | Number | No | 0 | Total quiz count |
| `content.modules` | [Module] | No | [] | Array of modules |

#### Stats (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `stats.enrollments` | Number | No | 0 | Total enrollments |
| `stats.completions` | Number | No | 0 | Total completions |
| `stats.averageRating` | Number | No | 0 | Average rating (1-5) |
| `stats.totalReviews` | Number | No | 0 | Total review count |

#### SEO (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `seo.metaTitle` | String | No | - | SEO meta title |
| `seo.metaDescription` | String | No | - | SEO meta description |
| `seo.keywords` | [String] | No | [] | SEO keywords |

#### Status & Timestamps

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `status` | Enum | No | 'draft' | 'draft' \| 'review' \| 'published' \| 'archived' |
| `publishedAt` | Date | No | - | Publication date |
| `createdAt` | Date | Auto | - | Creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

### Module Schema (Embedded)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Module ID |
| `title` | String | Yes | - | Module title |
| `description` | String | No | - | Module description |
| `order` | Number | Yes | - | Sort order |
| `lessons` | [Lesson] | No | [] | Array of lessons |

### Lesson Schema (Embedded in Module)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Lesson ID |
| `title` | String | Yes | - | Lesson title |
| `slug` | String | Yes | - | URL-friendly slug |
| `type` | Enum | Yes | - | 'video' \| 'article' \| 'quiz' \| 'exercise' |
| `duration` | Number | No | 0 | Duration in seconds |
| `content.videoUrl` | String | No | - | Video URL |
| `content.videoProvider` | Enum | No | - | 'bunny' \| 'vimeo' \| 'youtube' |
| `content.articleContent` | String | No | - | HTML article content |
| `content.resources` | [Object] | No | [] | [{title, url, type}] |
| `isPreview` | Boolean | No | false | Free preview enabled |
| `order` | Number | Yes | - | Sort order within module |

### Indexes

| Fields | Type | Description |
|--------|------|-------------|
| `slug` | Unique | Fast slug lookups |
| `status, publishedAt` | Compound (desc) | Published courses listing |
| `category, status` | Compound | Category filtering |
| `instructor` | Standard | Instructor's courses |
| `pricing.type` | Standard | Pricing filter |
| `tags` | Standard | Tag search |
| `title, description, tags` | Text (weighted) | Full-text search (weights: title=10, tags=5, description=1) |

### Middleware

- **Pre-save:** Auto-generates slug from title if not set

---

## 3. Categories Collection

**Collection Name:** `categories`
**Model File:** `apps/api/src/models/Category.ts`

### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Primary key |
| `name` | String | Yes | - | Max 50 characters |
| `slug` | String | Yes | - | Unique, auto-generated |
| `description` | String | No | - | Max 500 characters |
| `icon` | String | No | - | Icon name or URL |
| `image` | String | No | - | Category image URL |
| `parent` | ObjectId | No | null | Reference to parent Category |
| `order` | Number | No | 0 | Sort order |
| `courseCount` | Number | No | 0 | Number of courses |
| `isActive` | Boolean | No | true | Category is active |
| `seo.metaTitle` | String | No | - | SEO meta title |
| `seo.metaDescription` | String | No | - | SEO meta description |
| `createdAt` | Date | Auto | - | Creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

### Virtuals

| Name | Returns | Description |
|------|---------|-------------|
| `subcategories` | [Category] | Populates child categories where parent = this._id |

### Indexes

| Fields | Type | Description |
|--------|------|-------------|
| `slug` | Unique | Fast slug lookups |
| `parent` | Standard | Find subcategories |
| `isActive, order` | Compound | Active categories sorted |

### Middleware

- **Pre-save:** Auto-generates slug from name if not set

---

## 4. Enrollments Collection

**Collection Name:** `enrollments`
**Model File:** `apps/api/src/models/Enrollment.ts`

### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Primary key |
| `user` | ObjectId | Yes | - | Reference to User |
| `course` | ObjectId | Yes | - | Reference to Course |
| `enrolledAt` | Date | No | Date.now | Enrollment date |
| `completedAt` | Date | No | - | Completion date |
| `status` | Enum | No | 'active' | 'active' \| 'completed' \| 'expired' \| 'refunded' |
| `createdAt` | Date | Auto | - | Creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

#### Progress (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `progress.percentage` | Number | No | 0 | Completion percentage (0-100) |
| `progress.completedLessons` | [ObjectId] | No | [] | Array of completed lesson IDs |
| `progress.currentLesson` | ObjectId | No | - | Current lesson ID |
| `progress.lastAccessedAt` | Date | No | - | Last access timestamp |
| `progress.timeSpent` | Number | No | 0 | Total time spent in seconds |

#### Quiz Attempts (Embedded Array)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `quizAttempts[].quizId` | ObjectId | Yes | - | Reference to Quiz |
| `quizAttempts[].attemptNumber` | Number | Yes | - | Attempt number |
| `quizAttempts[].score` | Number | Yes | - | Score achieved |
| `quizAttempts[].maxScore` | Number | Yes | - | Maximum possible score |
| `quizAttempts[].answers` | [Object] | No | [] | [{questionId, answer, isCorrect}] |
| `quizAttempts[].completedAt` | Date | No | Date.now | Completion timestamp |
| `quizAttempts[].timeSpent` | Number | No | 0 | Time spent in seconds |

#### Certificate (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `certificate.issued` | Boolean | No | false | Certificate issued |
| `certificate.issuedAt` | Date | No | - | Issue date |
| `certificate.certificateId` | String | No | - | Unique certificate ID |
| `certificate.certificateUrl` | String | No | - | Certificate PDF URL |

#### Payment (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `payment.orderId` | ObjectId | No | - | Reference to Order |
| `payment.amount` | Number | No | 0 | Amount paid |
| `payment.method` | String | No | - | Payment method used |

### Indexes

| Fields | Type | Description |
|--------|------|-------------|
| `user, course` | Unique Compound | One enrollment per user/course |
| `user, status` | Compound | User's enrollments by status |
| `course` | Standard | Course enrollments |

---

## 5. Quizzes Collection

**Collection Name:** `quizzes`
**Model File:** `apps/api/src/models/Quiz.ts`

### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Primary key |
| `course` | ObjectId | Yes | - | Reference to Course |
| `module` | ObjectId | No | - | Module ID (for module-specific quizzes) |
| `lesson` | ObjectId | No | - | Lesson ID (for lesson-specific quizzes) |
| `title` | String | Yes | - | Quiz title |
| `description` | String | No | - | Quiz description |
| `type` | Enum | No | 'practice' | 'practice' \| 'graded' \| 'final' |
| `isActive` | Boolean | No | true | Quiz is active |
| `createdAt` | Date | Auto | - | Creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

#### Settings (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `settings.timeLimit` | Number | No | - | Time limit in seconds |
| `settings.passingScore` | Number | No | 70 | Passing score percentage |
| `settings.maxAttempts` | Number | No | - | Maximum attempts allowed |
| `settings.shuffleQuestions` | Boolean | No | true | Randomize question order |
| `settings.shuffleAnswers` | Boolean | No | true | Randomize answer order |
| `settings.showCorrectAnswers` | Boolean | No | true | Show correct answers after submission |
| `settings.showExplanations` | Boolean | No | true | Show explanations after submission |

#### Stats (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `stats.totalAttempts` | Number | No | 0 | Total attempts across all users |
| `stats.averageScore` | Number | No | 0 | Average score percentage |
| `stats.passRate` | Number | No | 0 | Pass rate percentage |

### Question Schema (Embedded Array)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `questions[]._id` | ObjectId | Auto | - | Question ID |
| `questions[].type` | Enum | Yes | - | Question type (see below) |
| `questions[].question` | String | Yes | - | Question text |
| `questions[].questionMedia` | Object | No | - | {type: string, url: string} |
| `questions[].options` | [Object] | No | [] | [{text, isCorrect, media}] |
| `questions[].correctAnswer` | Mixed | No | - | For non-MCQ types |
| `questions[].explanation` | String | No | - | Answer explanation |
| `questions[].points` | Number | No | 10 | Points for correct answer |
| `questions[].difficulty` | Enum | No | 'medium' | 'easy' \| 'medium' \| 'hard' |
| `questions[].tags` | [String] | No | [] | Question tags |
| `questions[].order` | Number | Yes | - | Question order |

#### Question Types

| Type | Description |
|------|-------------|
| `multiple-choice` | Single correct answer from multiple options |
| `multiple-select` | Multiple correct answers |
| `true-false` | True or False |
| `fill-blank` | Fill in the blank |
| `matching` | Match items |
| `ordering` | Put items in order |
| `short-answer` | Short text answer |

### Indexes

| Fields | Type | Description |
|--------|------|-------------|
| `course` | Standard | Quizzes by course |
| `lesson` | Standard | Quizzes by lesson |

---

## 6. Orders Collection

**Collection Name:** `orders`
**Model File:** `apps/api/src/models/Order.ts`

### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Primary key |
| `user` | ObjectId | Yes | - | Reference to User |
| `orderNumber` | String | Yes | - | Unique, auto-generated (ORD-xxx-xxx) |
| `status` | Enum | No | 'pending' | 'pending' \| 'completed' \| 'cancelled' \| 'refunded' |
| `createdAt` | Date | Auto | - | Creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

#### Items (Embedded Array)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `items[].type` | Enum | Yes | - | 'course' \| 'subscription' \| 'bundle' |
| `items[].itemId` | ObjectId | Yes | - | Reference to item |
| `items[].title` | String | Yes | - | Item title |
| `items[].price` | Number | Yes | - | Item price |
| `items[].discount` | Number | No | 0 | Item discount |

#### Pricing (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `pricing.subtotal` | Number | Yes | - | Subtotal before discounts/tax |
| `pricing.discount` | Number | No | 0 | Total discount amount |
| `pricing.tax` | Number | No | 0 | Tax amount |
| `pricing.total` | Number | Yes | - | Final total |
| `pricing.currency` | String | No | 'USD' | Currency code |

#### Coupon (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `coupon.code` | String | No | - | Coupon code used |
| `coupon.discountAmount` | Number | No | - | Discount from coupon |

#### Payment (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `payment.provider` | Enum | No | 'stripe' | Payment provider |
| `payment.stripePaymentIntentId` | String | No | - | Stripe PaymentIntent ID |
| `payment.stripeChargeId` | String | No | - | Stripe Charge ID |
| `payment.status` | Enum | No | 'pending' | 'pending' \| 'processing' \| 'succeeded' \| 'failed' \| 'refunded' |
| `payment.paidAt` | Date | No | - | Payment timestamp |

#### Billing (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `billing.name` | String | Yes | - | Billing name |
| `billing.email` | String | Yes | - | Billing email |
| `billing.address.line1` | String | No | - | Address line 1 |
| `billing.address.line2` | String | No | - | Address line 2 |
| `billing.address.city` | String | No | - | City |
| `billing.address.state` | String | No | - | State/Province |
| `billing.address.postalCode` | String | No | - | Postal/ZIP code |
| `billing.address.country` | String | No | - | Country code |

#### Invoice (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `invoice.number` | String | No | - | Invoice number |
| `invoice.url` | String | No | - | Invoice PDF URL |

### Indexes

| Fields | Type | Description |
|--------|------|-------------|
| `orderNumber` | Unique | Fast order lookups |
| `user, createdAt` | Compound (desc) | User's order history |
| `payment.stripePaymentIntentId` | Standard | Stripe webhook lookups |
| `status` | Standard | Filter by status |

### Middleware

- **Pre-save:** Auto-generates orderNumber if not set (format: `ORD-{timestamp}-{random}`)

---

## 7. Reviews Collection

**Collection Name:** `reviews`
**Model File:** `apps/api/src/models/Review.ts`

### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Primary key |
| `user` | ObjectId | Yes | - | Reference to User |
| `course` | ObjectId | Yes | - | Reference to Course |
| `rating` | Number | Yes | - | Rating 1-5 |
| `title` | String | No | - | Review title (max 100 chars) |
| `content` | String | Yes | - | Review content (max 2000 chars) |
| `status` | Enum | No | 'pending' | 'pending' \| 'approved' \| 'rejected' |
| `createdAt` | Date | Auto | - | Creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

#### Helpful (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `helpful.count` | Number | No | 0 | Number of helpful votes |
| `helpful.users` | [ObjectId] | No | [] | Users who marked helpful |

#### Instructor Response (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `instructorResponse.content` | String | No | - | Response text |
| `instructorResponse.respondedAt` | Date | No | - | Response timestamp |

### Indexes

| Fields | Type | Description |
|--------|------|-------------|
| `course, status, createdAt` | Compound (desc) | Course reviews listing |
| `user` | Standard | User's reviews |
| `user, course` | Unique Compound | One review per user/course |

---

## 8. Badges Collection

**Collection Name:** `badges`
**Model File:** `apps/api/src/models/Badge.ts`

### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Primary key |
| `name` | String | Yes | - | Unique badge name |
| `description` | String | Yes | - | Max 300 characters |
| `icon` | String | Yes | - | Icon name or URL |
| `type` | Enum | Yes | - | 'achievement' \| 'milestone' \| 'skill' \| 'special' |
| `points` | Number | No | 0 | Points awarded for earning |
| `rarity` | Enum | No | 'common' | 'common' \| 'uncommon' \| 'rare' \| 'epic' \| 'legendary' |
| `isActive` | Boolean | No | true | Badge is active |
| `createdAt` | Date | Auto | - | Creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

#### Criteria (Embedded Object)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `criteria.type` | Enum | Yes | - | Criteria type (see below) |
| `criteria.threshold` | Number | Yes | - | Threshold value to earn |
| `criteria.courseIds` | [ObjectId] | No | [] | Specific courses (for skill badges) |
| `criteria.customLogic` | String | No | - | Custom evaluation logic |

#### Criteria Types

| Type | Description |
|------|-------------|
| `courses_completed` | Number of courses completed |
| `quizzes_passed` | Number of quizzes passed |
| `streak_days` | Learning streak in days |
| `points_earned` | Total points earned |
| `reviews_written` | Number of reviews written |
| `custom` | Custom logic evaluation |

### Indexes

| Fields | Type | Description |
|--------|------|-------------|
| `name` | Unique | Fast name lookups |
| `type, isActive` | Compound | Active badges by type |
| `criteria.type` | Standard | Filter by criteria |

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────┐                              ┌─────────────┐               │
│  │             │         enrolls in           │             │               │
│  │    USER     │─────────────────────────────▶│   COURSE    │               │
│  │             │                              │             │               │
│  └─────────────┘                              └─────────────┘               │
│        │                                            │                       │
│        │ places                                     │ belongs to            │
│        ▼                                            ▼                       │
│  ┌─────────────┐                              ┌─────────────┐               │
│  │             │                              │             │               │
│  │   ORDER     │                              │  CATEGORY   │◀──┐           │
│  │             │                              │             │   │ parent    │
│  └─────────────┘                              └─────────────┘───┘           │
│        │                                            ▲                       │
│        │ contains                                   │ categorized by        │
│        ▼                                            │                       │
│  ┌─────────────┐                              ┌─────────────┐               │
│  │ ORDER ITEMS │                              │             │               │
│  │ (embedded)  │─────────────────────────────▶│   COURSE    │               │
│  └─────────────┘       references             │             │               │
│                                               └─────────────┘               │
│                                                     │                       │
│                                                     │ has                   │
│                                                     ▼                       │
│  ┌─────────────┐                              ┌─────────────┐               │
│  │             │         reviews              │   MODULES   │               │
│  │   REVIEW    │◀────────────────────────────▶│ (embedded)  │               │
│  │             │                              └─────────────┘               │
│  └─────────────┘                                    │                       │
│        │                                            │ contains              │
│        │ written by                                 ▼                       │
│        ▼                                      ┌─────────────┐               │
│  ┌─────────────┐                              │   LESSONS   │               │
│  │    USER     │                              │ (embedded)  │               │
│  └─────────────┘                              └─────────────┘               │
│        │                                                                    │
│        │ earns                                                              │
│        ▼                                                                    │
│  ┌─────────────┐                              ┌─────────────┐               │
│  │   BADGES    │                              │             │               │
│  │ (reference) │                              │    QUIZ     │───────────────┤
│  └─────────────┘                              │             │  belongs to   │
│                                               └─────────────┘   Course      │
│                                                     │                       │
│                                                     │ contains              │
│                                                     ▼                       │
│                                               ┌─────────────┐               │
│  ┌─────────────┐       tracks attempts        │  QUESTIONS  │               │
│  │ ENROLLMENT  │─────────────────────────────▶│ (embedded)  │               │
│  │             │                              └─────────────┘               │
│  └─────────────┘                                                            │
│        │                                                                    │
│        │ links                                                              │
│        ▼                                                                    │
│  ┌─────────────┐                                                            │
│  │    USER     │◀───────────────────────────────────────────────────────────┤
│  │   COURSE    │                                                            │
│  └─────────────┘                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Relationships Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Enrollment → Course | Many-to-Many | Users enroll in courses via Enrollment |
| User → Order | One-to-Many | Users can have multiple orders |
| User → Review → Course | Many-to-Many | Users review courses (max 1 per course) |
| User → Badge | Many-to-Many | Users earn badges (stored in User.gamification.badges) |
| Course → Category | Many-to-One | Each course belongs to one category |
| Category → Category | Self-referencing | Subcategories reference parent |
| Course → Quiz | One-to-Many | Courses can have multiple quizzes |
| Course → Module → Lesson | Embedded | Modules and lessons are embedded in courses |
| Order → OrderItems | Embedded | Order items are embedded in orders |
| Enrollment → QuizAttempts | Embedded | Quiz attempts are embedded in enrollments |

---

## Data Types Reference

### MongoDB/Mongoose Types Used

| Type | Description |
|------|-------------|
| `ObjectId` | MongoDB unique identifier |
| `String` | Text data |
| `Number` | Numeric data (integers and floats) |
| `Boolean` | True/False |
| `Date` | Date and time |
| `Array` | Array of values |
| `Mixed` | Any type (Schema.Types.Mixed) |
| `Embedded Object` | Nested document |

### Enum Values Summary

| Field | Values |
|-------|--------|
| User.role | student, instructor, admin, superadmin |
| User.subscription.plan | free, basic, premium, enterprise |
| User.subscription.status | active, canceled, past_due, trialing, inactive |
| Course.level | beginner, intermediate, advanced |
| Course.pricing.type | free, paid, subscription |
| Course.status | draft, review, published, archived |
| Lesson.type | video, article, quiz, exercise |
| Lesson.content.videoProvider | bunny, vimeo, youtube |
| Quiz.type | practice, graded, final |
| Question.type | multiple-choice, multiple-select, true-false, fill-blank, matching, ordering, short-answer |
| Question.difficulty | easy, medium, hard |
| Enrollment.status | active, completed, expired, refunded |
| Order.status | pending, completed, cancelled, refunded |
| Order.payment.status | pending, processing, succeeded, failed, refunded |
| Order.items[].type | course, subscription, bundle |
| Review.status | pending, approved, rejected |
| Badge.type | achievement, milestone, skill, special |
| Badge.rarity | common, uncommon, rare, epic, legendary |
| Badge.criteria.type | courses_completed, quizzes_passed, streak_days, points_earned, reviews_written, custom |

---

*Document generated for DX Education Platform database reference.*
