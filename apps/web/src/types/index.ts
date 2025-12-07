// User types
export interface User {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    timezone?: string;
    language?: string;
  };
  role: 'student' | 'instructor' | 'admin' | 'superadmin';
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive';
    currentPeriodEnd?: string;
  };
  gamification: {
    points: number;
    level: number;
    badges: Badge[];
    streak: {
      current: number;
      longest: number;
      lastActivityDate?: string;
    };
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    darkMode: boolean;
  };
  isVerified: boolean;
  createdAt: string;
}

// Course types
export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail?: string;
  instructor: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
      bio?: string;
    };
  };
  category: Category;
  subcategory?: Category;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  pricing: {
    type: 'free' | 'paid' | 'subscription';
    price: number;
    currency: string;
    discount?: {
      percentage: number;
      validUntil?: string;
    };
  };
  content: {
    totalDuration: number;
    totalLessons: number;
    totalQuizzes: number;
    modules: Module[];
  };
  requirements: string[];
  outcomes: string[];
  targetAudience: string[];
  stats: {
    enrollments: number;
    completions: number;
    averageRating: number;
    totalReviews: number;
  };
  status: 'draft' | 'review' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
}

export interface Module {
  _id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  _id: string;
  title: string;
  slug: string;
  type: 'article' | 'quiz';
  duration: number;
  content?: {
    articleContent?: string;
    resources?: Resource[];
  };
  isPreview: boolean;
  order: number;
}

export interface Resource {
  title: string;
  url: string;
  type: string;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parent?: string;
  courseCount: number;
  subcategories?: Category[];
}

// Enrollment types
export interface Enrollment {
  _id: string;
  user: string;
  course: Course;
  enrolledAt: string;
  completedAt?: string;
  progress: {
    percentage: number;
    completedLessons: string[];
    currentLesson?: string;
    lastAccessedAt?: string;
    timeSpent: number;
  };
  certificate?: {
    issued: boolean;
    issuedAt?: string;
    certificateId?: string;
    certificateUrl?: string;
  };
  status: 'active' | 'completed' | 'expired' | 'refunded';
}

// Quiz types
export interface Quiz {
  _id: string;
  course: string;
  title: string;
  description?: string;
  type: 'practice' | 'graded' | 'final';
  settings: {
    timeLimit?: number;
    passingScore: number;
    maxAttempts?: number;
    shuffleQuestions: boolean;
    shuffleAnswers: boolean;
    showCorrectAnswers: boolean;
    showExplanations: boolean;
  };
  questions: Question[];
}

export interface Question {
  _id: string;
  type: 'multiple-choice' | 'multiple-select' | 'true-false' | 'fill-blank' | 'matching' | 'ordering' | 'short-answer';
  question: string;
  questionMedia?: { type: string; url: string };
  options?: QuestionOption[];
  points: number;
}

export interface QuestionOption {
  _id: string;
  text: string;
  media?: { type: string; url: string };
}

// Badge types
export interface Badge {
  badgeId: {
    _id: string;
    name: string;
    description: string;
    icon: string;
    type: 'achievement' | 'milestone' | 'skill' | 'special';
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  };
  earnedAt: string;
}

// Review types
export interface Review {
  _id: string;
  user: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
  rating: number;
  title?: string;
  content: string;
  helpful: {
    count: number;
  };
  instructorResponse?: {
    content: string;
    respondedAt: string;
  };
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}
