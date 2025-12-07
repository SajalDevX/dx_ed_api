import { Types } from 'mongoose';
import { categoryIds } from './categories.js';

// Pre-generate course IDs for quiz references
export const courseIds = {
  // AI & ML Courses
  introToAI: new Types.ObjectId(),
  mlFundamentals: new Types.ObjectId(),
  deepLearning: new Types.ObjectId(),
  // Cloud Computing Courses
  awsArchitect: new Types.ObjectId(),
  azureFundamentals: new Types.ObjectId(),
  gcpEssentials: new Types.ObjectId(),
  // Data Analytics Courses
  dataAnalytics: new Types.ObjectId(),
  powerBI: new Types.ObjectId(),
  pythonDataScience: new Types.ObjectId(),
  // Frontend Courses
  react18Complete: new Types.ObjectId(),
  nextjs14: new Types.ObjectId(),
  typescriptDeep: new Types.ObjectId(),
  // Backend Courses
  nodeExpress: new Types.ObjectId(),
  mongodbDev: new Types.ObjectId(),
  restApiDesign: new Types.ObjectId(),
  // Full Stack Courses
  mernStack: new Types.ObjectId(),
  fullStackNextjs: new Types.ObjectId(),
  // Project Management Courses
  agileScrum: new Types.ObjectId(),
  productManagement: new Types.ObjectId(),
  // Leadership Courses
  techLeadership: new Types.ObjectId(),
  digitalStrategy: new Types.ObjectId(),
  // DevOps Courses
  dockerKubernetes: new Types.ObjectId(),
  cicdPipelines: new Types.ObjectId(),
  terraformIaC: new Types.ObjectId(),
  // Security Courses
  cloudSecurity: new Types.ObjectId(),
  securityEngineering: new Types.ObjectId(),
};

// Helper function to create a lesson
const createLesson = (
  title: string,
  type: 'video' | 'article' | 'quiz' | 'exercise',
  order: number,
  duration: number,
  isPreview: boolean = false,
  content?: { articleContent?: string; videoUrl?: string }
) => {
  const baseContent: Record<string, unknown> = {};

  if (type === 'video') {
    baseContent.videoUrl = content?.videoUrl || 'https://stream.mux.com/sample-video.m3u8';
    baseContent.videoProvider = 'bunny';
  }

  if (type === 'article') {
    baseContent.articleContent = content?.articleContent || `<h2>${title}</h2><p>This is the content for ${title}. In a real course, this would contain detailed explanations, code examples, and learning materials.</p>`;
  }

  return {
    _id: new Types.ObjectId(),
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    type,
    duration,
    content: baseContent,
    isPreview,
    order,
  };
};

// Helper function to create a module
const createModule = (
  title: string,
  description: string,
  order: number,
  lessons: ReturnType<typeof createLesson>[]
) => ({
  _id: new Types.ObjectId(),
  title,
  description,
  order,
  lessons,
});

// Instructor placeholder - will be replaced by actual instructor ID
let instructorId: Types.ObjectId | null = null;

export const setInstructorId = (id: Types.ObjectId) => {
  instructorId = id;
};

export const getCoursesData = (instructorIdParam: Types.ObjectId) => [
  // ==================== AI & MACHINE LEARNING COURSES ====================
  {
    _id: courseIds.introToAI,
    title: 'Introduction to Artificial Intelligence',
    slug: 'introduction-to-artificial-intelligence',
    description: `Master the fundamentals of Artificial Intelligence in this comprehensive course. You'll learn about the history of AI, different types of AI systems, machine learning basics, neural networks, and practical applications of AI in the modern world.

This course is designed for beginners who want to understand AI concepts without heavy mathematics. We'll cover real-world examples and hands-on projects to solidify your understanding.

By the end of this course, you'll be able to:
- Understand key AI concepts and terminology
- Differentiate between AI, ML, and Deep Learning
- Build simple AI models using Python
- Evaluate AI solutions for business problems`,
    shortDescription: 'Learn the fundamentals of AI, from basic concepts to practical applications in the real world.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    previewVideo: 'https://stream.mux.com/sample-preview.m3u8',
    instructor: instructorIdParam,
    category: categoryIds.aiMl,
    subcategory: null,
    tags: ['AI', 'Machine Learning', 'Python', 'Beginner', 'Data Science'],
    level: 'beginner',
    language: 'en',
    pricing: {
      type: 'free',
      price: 0,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('Introduction to AI', 'Understanding the basics of artificial intelligence', 1, [
          createLesson('What is Artificial Intelligence?', 'video', 1, 900, true),
          createLesson('History of AI', 'video', 2, 720),
          createLesson('Types of AI Systems', 'article', 3, 600),
          createLesson('AI vs Machine Learning vs Deep Learning', 'video', 4, 840),
          createLesson('Module 1 Quiz', 'quiz', 5, 300),
        ]),
        createModule('Machine Learning Basics', 'Introduction to machine learning concepts', 2, [
          createLesson('What is Machine Learning?', 'video', 1, 780),
          createLesson('Supervised vs Unsupervised Learning', 'video', 2, 900),
          createLesson('Common ML Algorithms', 'article', 3, 720),
          createLesson('Hands-on: Your First ML Model', 'exercise', 4, 1800),
          createLesson('Module 2 Quiz', 'quiz', 5, 300),
        ]),
        createModule('Neural Networks Introduction', 'Understanding neural networks', 3, [
          createLesson('How Neural Networks Work', 'video', 1, 960),
          createLesson('Perceptrons and Activation Functions', 'video', 2, 840),
          createLesson('Building a Simple Neural Network', 'exercise', 3, 2400),
          createLesson('Module 3 Quiz', 'quiz', 4, 300),
        ]),
        createModule('AI Applications', 'Real-world AI applications', 4, [
          createLesson('AI in Healthcare', 'video', 1, 720),
          createLesson('AI in Finance', 'video', 2, 660),
          createLesson('AI in Transportation', 'article', 3, 540),
          createLesson('Ethical Considerations in AI', 'video', 4, 900),
          createLesson('Final Course Quiz', 'quiz', 5, 600),
        ]),
      ],
    },
    requirements: [
      'Basic computer literacy',
      'No programming experience required',
      'Curiosity about AI and technology',
    ],
    outcomes: [
      'Understand fundamental AI concepts',
      'Differentiate between AI, ML, and Deep Learning',
      'Know how to evaluate AI solutions',
      'Build simple AI models with Python',
    ],
    targetAudience: [
      'Beginners interested in AI',
      'Business professionals wanting to understand AI',
      'Students exploring tech careers',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },
  {
    _id: courseIds.mlFundamentals,
    title: 'Machine Learning Fundamentals',
    slug: 'machine-learning-fundamentals',
    description: `Dive deep into Machine Learning with this hands-on course. Learn the mathematical foundations, key algorithms, and practical implementation of ML models using Python and scikit-learn.

This intermediate course covers supervised learning, unsupervised learning, model evaluation, and feature engineering. You'll work on real datasets and build production-ready models.

Topics covered:
- Linear and Logistic Regression
- Decision Trees and Random Forests
- Support Vector Machines
- Clustering algorithms (K-Means, DBSCAN)
- Model evaluation and cross-validation
- Feature engineering techniques`,
    shortDescription: 'Master machine learning algorithms and build production-ready models with Python.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    instructor: instructorIdParam,
    category: categoryIds.aiMl,
    tags: ['Machine Learning', 'Python', 'scikit-learn', 'Data Science', 'Algorithms'],
    level: 'intermediate',
    language: 'en',
    pricing: {
      type: 'paid',
      price: 79,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('ML Foundations', 'Mathematical foundations of machine learning', 1, [
          createLesson('Linear Algebra for ML', 'video', 1, 1200, true),
          createLesson('Probability and Statistics Review', 'video', 2, 1080),
          createLesson('Calculus Essentials', 'article', 3, 900),
          createLesson('Python Environment Setup', 'exercise', 4, 1200),
        ]),
        createModule('Supervised Learning', 'Regression and classification algorithms', 2, [
          createLesson('Linear Regression Deep Dive', 'video', 1, 1500),
          createLesson('Logistic Regression', 'video', 2, 1200),
          createLesson('Decision Trees', 'video', 3, 1080),
          createLesson('Random Forests and Ensemble Methods', 'video', 4, 1320),
          createLesson('Hands-on: Classification Project', 'exercise', 5, 3600),
        ]),
        createModule('Unsupervised Learning', 'Clustering and dimensionality reduction', 3, [
          createLesson('K-Means Clustering', 'video', 1, 1080),
          createLesson('Hierarchical Clustering', 'video', 2, 900),
          createLesson('PCA and Dimensionality Reduction', 'video', 3, 1200),
          createLesson('Hands-on: Customer Segmentation', 'exercise', 4, 2700),
        ]),
        createModule('Model Evaluation', 'Evaluating and improving ML models', 4, [
          createLesson('Metrics for Classification', 'video', 1, 1080),
          createLesson('Metrics for Regression', 'video', 2, 900),
          createLesson('Cross-Validation Techniques', 'video', 3, 1200),
          createLesson('Hyperparameter Tuning', 'video', 4, 1320),
          createLesson('Final Project: End-to-End ML Pipeline', 'exercise', 5, 5400),
        ]),
      ],
    },
    requirements: [
      'Python programming basics',
      'Basic understanding of statistics',
      'Completed Intro to AI or equivalent',
    ],
    outcomes: [
      'Implement ML algorithms from scratch',
      'Use scikit-learn for production models',
      'Evaluate and improve model performance',
      'Handle real-world datasets',
    ],
    targetAudience: [
      'Developers wanting to add ML skills',
      'Data analysts transitioning to ML',
      'Students pursuing data science',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },

  // ==================== CLOUD COMPUTING COURSES ====================
  {
    _id: courseIds.awsArchitect,
    title: 'AWS Solutions Architect - Complete Guide',
    slug: 'aws-solutions-architect-complete-guide',
    description: `Become an AWS Solutions Architect with this comprehensive course. Learn to design and deploy scalable, highly available systems on Amazon Web Services.

This course prepares you for the AWS Solutions Architect Associate certification while teaching practical skills for building production cloud infrastructure.

Key topics:
- EC2, VPC, and core AWS services
- S3, EBS, and storage solutions
- RDS, DynamoDB, and database services
- Lambda, API Gateway, and serverless
- CloudFormation and infrastructure as code
- Security best practices and IAM`,
    shortDescription: 'Master AWS cloud architecture and prepare for the Solutions Architect certification.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    instructor: instructorIdParam,
    category: categoryIds.cloudComputing,
    tags: ['AWS', 'Cloud', 'Architecture', 'DevOps', 'Certification'],
    level: 'intermediate',
    language: 'en',
    pricing: {
      type: 'paid',
      price: 129,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('AWS Fundamentals', 'Introduction to AWS cloud platform', 1, [
          createLesson('AWS Global Infrastructure', 'video', 1, 1080, true),
          createLesson('IAM - Identity and Access Management', 'video', 2, 1500),
          createLesson('AWS CLI and SDK Setup', 'exercise', 3, 1200),
          createLesson('IAM Best Practices Quiz', 'quiz', 4, 300),
        ]),
        createModule('Compute Services', 'EC2 and compute options', 2, [
          createLesson('EC2 Instance Types and Pricing', 'video', 1, 1320),
          createLesson('EC2 Security Groups and Key Pairs', 'video', 2, 900),
          createLesson('Auto Scaling and Load Balancers', 'video', 3, 1500),
          createLesson('Hands-on: Deploy a Web Application', 'exercise', 4, 2700),
          createLesson('Compute Quiz', 'quiz', 5, 300),
        ]),
        createModule('Storage Solutions', 'S3, EBS, and storage options', 3, [
          createLesson('S3 Deep Dive', 'video', 1, 1800),
          createLesson('EBS Volume Types', 'video', 2, 1080),
          createLesson('S3 Lifecycle Policies', 'video', 3, 900),
          createLesson('Hands-on: Static Website on S3', 'exercise', 4, 1800),
        ]),
        createModule('Database Services', 'RDS, DynamoDB, and more', 4, [
          createLesson('RDS Overview and Setup', 'video', 1, 1500),
          createLesson('DynamoDB Fundamentals', 'video', 2, 1320),
          createLesson('ElastiCache for Performance', 'video', 3, 900),
          createLesson('Hands-on: Multi-AZ Database Setup', 'exercise', 4, 2400),
        ]),
        createModule('Serverless Architecture', 'Lambda and API Gateway', 5, [
          createLesson('AWS Lambda Deep Dive', 'video', 1, 1500),
          createLesson('API Gateway Setup', 'video', 2, 1200),
          createLesson('Step Functions for Workflows', 'video', 3, 1080),
          createLesson('Build a Serverless API', 'exercise', 4, 3600),
          createLesson('Final Exam', 'quiz', 5, 900),
        ]),
      ],
    },
    requirements: [
      'Basic understanding of cloud computing',
      'Familiarity with Linux commands',
      'AWS Free Tier account',
    ],
    outcomes: [
      'Design highly available AWS architectures',
      'Implement security best practices',
      'Optimize costs on AWS',
      'Prepare for SA Associate exam',
    ],
    targetAudience: [
      'Developers moving to cloud',
      'System administrators',
      'Solutions architects',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },

  // ==================== WEB DEVELOPMENT COURSES ====================
  {
    _id: courseIds.react18Complete,
    title: 'React 18 - The Complete Guide',
    slug: 'react-18-complete-guide',
    description: `Master React 18 from the ground up. This comprehensive course covers everything from basic concepts to advanced patterns used in production applications.

You'll learn:
- React fundamentals and JSX
- Hooks (useState, useEffect, useContext, useReducer, and more)
- Component patterns and best practices
- State management with Context and Redux Toolkit
- React Router for navigation
- Testing with React Testing Library
- Performance optimization techniques
- Building and deploying React applications`,
    shortDescription: 'The ultimate React course covering fundamentals to advanced patterns with hands-on projects.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    instructor: instructorIdParam,
    category: categoryIds.frontend,
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development', 'Hooks'],
    level: 'beginner',
    language: 'en',
    pricing: {
      type: 'paid',
      price: 49,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('React Fundamentals', 'Getting started with React', 1, [
          createLesson('Introduction to React', 'video', 1, 720, true),
          createLesson('Setting Up Your Development Environment', 'video', 2, 900),
          createLesson('JSX Deep Dive', 'video', 3, 1080),
          createLesson('Components and Props', 'video', 4, 1200),
          createLesson('Your First React App', 'exercise', 5, 1800),
        ]),
        createModule('React Hooks', 'Mastering React Hooks', 2, [
          createLesson('useState Hook', 'video', 1, 1080),
          createLesson('useEffect Hook', 'video', 2, 1320),
          createLesson('useContext Hook', 'video', 3, 900),
          createLesson('useReducer Hook', 'video', 4, 1200),
          createLesson('Custom Hooks', 'video', 5, 1500),
          createLesson('Hooks Practice Project', 'exercise', 6, 2700),
        ]),
        createModule('State Management', 'Managing application state', 3, [
          createLesson('Prop Drilling Problems', 'video', 1, 720),
          createLesson('Context API Deep Dive', 'video', 2, 1200),
          createLesson('Redux Toolkit Setup', 'video', 3, 1500),
          createLesson('Redux Slices and Actions', 'video', 4, 1320),
          createLesson('Async Thunks', 'video', 5, 1080),
          createLesson('State Management Project', 'exercise', 6, 3600),
        ]),
        createModule('React Router', 'Navigation in React apps', 4, [
          createLesson('React Router Setup', 'video', 1, 900),
          createLesson('Route Parameters', 'video', 2, 720),
          createLesson('Nested Routes', 'video', 3, 840),
          createLesson('Protected Routes', 'video', 4, 1080),
          createLesson('Router Practice', 'exercise', 5, 1800),
        ]),
        createModule('Building Production Apps', 'Real-world React development', 5, [
          createLesson('Performance Optimization', 'video', 1, 1500),
          createLesson('Testing React Components', 'video', 2, 1800),
          createLesson('Error Boundaries', 'video', 3, 720),
          createLesson('Building and Deployment', 'video', 4, 1080),
          createLesson('Final Project: Task Management App', 'exercise', 5, 7200),
        ]),
      ],
    },
    requirements: [
      'HTML, CSS, and JavaScript basics',
      'Understanding of ES6+ features',
      'Code editor (VS Code recommended)',
    ],
    outcomes: [
      'Build modern React applications',
      'Master React Hooks',
      'Implement complex state management',
      'Test and deploy React apps',
    ],
    targetAudience: [
      'Frontend developers',
      'JavaScript developers',
      'Web development beginners',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },
  {
    _id: courseIds.nextjs14,
    title: 'Next.js 14 - Full-Stack Development',
    slug: 'nextjs-14-full-stack-development',
    description: `Build production-ready full-stack applications with Next.js 14. Learn the App Router, Server Components, Server Actions, and modern full-stack patterns.

This course covers:
- Next.js 14 App Router architecture
- Server and Client Components
- Server Actions for data mutations
- Data fetching and caching strategies
- Authentication with NextAuth.js
- Database integration with Prisma
- Deployment to Vercel`,
    shortDescription: 'Build full-stack applications with Next.js 14 using the latest App Router features.',
    thumbnail: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800',
    instructor: instructorIdParam,
    category: categoryIds.fullStack,
    tags: ['Next.js', 'React', 'Full-Stack', 'TypeScript', 'Vercel'],
    level: 'intermediate',
    language: 'en',
    pricing: {
      type: 'paid',
      price: 89,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('Next.js Fundamentals', 'Getting started with Next.js 14', 1, [
          createLesson('Introduction to Next.js 14', 'video', 1, 900, true),
          createLesson('Project Structure and Setup', 'video', 2, 1080),
          createLesson('App Router Basics', 'video', 3, 1200),
          createLesson('File-based Routing', 'video', 4, 1080),
          createLesson('First Next.js App', 'exercise', 5, 1800),
        ]),
        createModule('Server Components', 'Understanding Server Components', 2, [
          createLesson('Server vs Client Components', 'video', 1, 1320),
          createLesson('Data Fetching in Server Components', 'video', 2, 1500),
          createLesson('Streaming and Suspense', 'video', 3, 1200),
          createLesson('Loading and Error States', 'video', 4, 900),
          createLesson('Server Components Project', 'exercise', 5, 2700),
        ]),
        createModule('Server Actions', 'Form handling with Server Actions', 3, [
          createLesson('Introduction to Server Actions', 'video', 1, 1080),
          createLesson('Form Submissions', 'video', 2, 1200),
          createLesson('Validation with Zod', 'video', 3, 1080),
          createLesson('Optimistic Updates', 'video', 4, 900),
          createLesson('CRUD Application', 'exercise', 5, 3600),
        ]),
        createModule('Authentication', 'Implementing auth with NextAuth', 4, [
          createLesson('NextAuth.js Setup', 'video', 1, 1500),
          createLesson('OAuth Providers', 'video', 2, 1200),
          createLesson('Session Management', 'video', 3, 900),
          createLesson('Protected Routes', 'video', 4, 1080),
          createLesson('Auth Implementation', 'exercise', 5, 2700),
        ]),
        createModule('Database Integration', 'Working with databases', 5, [
          createLesson('Prisma Setup', 'video', 1, 1200),
          createLesson('Database Schemas', 'video', 2, 1080),
          createLesson('CRUD Operations', 'video', 3, 1320),
          createLesson('Final Project: Full-Stack App', 'exercise', 4, 7200),
        ]),
      ],
    },
    requirements: [
      'React fundamentals',
      'TypeScript basics',
      'Understanding of APIs',
    ],
    outcomes: [
      'Build full-stack Next.js apps',
      'Master the App Router',
      'Implement authentication',
      'Deploy to production',
    ],
    targetAudience: [
      'React developers',
      'Full-stack developers',
      'Frontend developers wanting full-stack',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },
  {
    _id: courseIds.nodeExpress,
    title: 'Node.js & Express Bootcamp',
    slug: 'nodejs-express-bootcamp',
    description: `Master backend development with Node.js and Express. Learn to build RESTful APIs, handle authentication, work with databases, and deploy to production.

Comprehensive coverage of:
- Node.js fundamentals and event loop
- Express.js framework
- RESTful API design
- MongoDB with Mongoose
- JWT authentication
- File uploads and processing
- Error handling and security
- Testing and deployment`,
    shortDescription: 'Build robust backend applications with Node.js, Express, and MongoDB.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    instructor: instructorIdParam,
    category: categoryIds.backend,
    tags: ['Node.js', 'Express', 'Backend', 'MongoDB', 'REST API'],
    level: 'intermediate',
    language: 'en',
    pricing: {
      type: 'paid',
      price: 69,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('Node.js Fundamentals', 'Core Node.js concepts', 1, [
          createLesson('Introduction to Node.js', 'video', 1, 900, true),
          createLesson('Node.js Event Loop', 'video', 2, 1200),
          createLesson('Modules and NPM', 'video', 3, 1080),
          createLesson('File System Operations', 'video', 4, 900),
          createLesson('Node.js Practice', 'exercise', 5, 1800),
        ]),
        createModule('Express.js Framework', 'Building with Express', 2, [
          createLesson('Express Setup and Basics', 'video', 1, 1080),
          createLesson('Routing in Express', 'video', 2, 1200),
          createLesson('Middleware Deep Dive', 'video', 3, 1500),
          createLesson('Request and Response', 'video', 4, 900),
          createLesson('Express API Project', 'exercise', 5, 2400),
        ]),
        createModule('MongoDB & Mongoose', 'Database integration', 3, [
          createLesson('MongoDB Fundamentals', 'video', 1, 1320),
          createLesson('Mongoose Models', 'video', 2, 1200),
          createLesson('CRUD Operations', 'video', 3, 1500),
          createLesson('Data Validation', 'video', 4, 900),
          createLesson('Database Project', 'exercise', 5, 2700),
        ]),
        createModule('Authentication & Security', 'Securing your API', 4, [
          createLesson('JWT Authentication', 'video', 1, 1500),
          createLesson('Password Hashing', 'video', 2, 900),
          createLesson('Authorization Middleware', 'video', 3, 1200),
          createLesson('Security Best Practices', 'video', 4, 1080),
          createLesson('Auth Implementation', 'exercise', 5, 3600),
        ]),
        createModule('Production Ready', 'Preparing for production', 5, [
          createLesson('Error Handling', 'video', 1, 1200),
          createLesson('API Testing', 'video', 2, 1500),
          createLesson('Deployment to Railway', 'video', 3, 1080),
          createLesson('Final Project: Complete API', 'exercise', 4, 5400),
        ]),
      ],
    },
    requirements: [
      'JavaScript proficiency',
      'Basic understanding of HTTP',
      'Command line basics',
    ],
    outcomes: [
      'Build RESTful APIs',
      'Implement authentication',
      'Work with MongoDB',
      'Deploy Node.js applications',
    ],
    targetAudience: [
      'Frontend developers going full-stack',
      'Beginners in backend development',
      'JavaScript developers',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },
  {
    _id: courseIds.typescriptDeep,
    title: 'TypeScript Deep Dive',
    slug: 'typescript-deep-dive',
    description: `Master TypeScript from basics to advanced type system features. Learn to write type-safe code and leverage TypeScript's powerful features for better developer experience.

Topics covered:
- Type annotations and inference
- Interfaces and type aliases
- Generics and utility types
- Decorators and metadata
- Advanced patterns
- TypeScript with React and Node.js`,
    shortDescription: 'Master TypeScript and write type-safe, maintainable code.',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    instructor: instructorIdParam,
    category: categoryIds.frontend,
    tags: ['TypeScript', 'JavaScript', 'Frontend', 'Backend', 'Type Safety'],
    level: 'intermediate',
    language: 'en',
    pricing: {
      type: 'paid',
      price: 59,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('TypeScript Basics', 'Getting started with TypeScript', 1, [
          createLesson('Why TypeScript?', 'video', 1, 720, true),
          createLesson('Setup and Configuration', 'video', 2, 900),
          createLesson('Basic Types', 'video', 3, 1200),
          createLesson('Type Annotations vs Inference', 'video', 4, 900),
          createLesson('Basics Practice', 'exercise', 5, 1500),
        ]),
        createModule('Interfaces and Types', 'Defining shapes and contracts', 2, [
          createLesson('Interfaces Deep Dive', 'video', 1, 1320),
          createLesson('Type Aliases', 'video', 2, 1080),
          createLesson('Union and Intersection Types', 'video', 3, 1200),
          createLesson('Type Guards', 'video', 4, 1080),
          createLesson('Types Practice', 'exercise', 5, 2100),
        ]),
        createModule('Generics', 'Writing reusable code', 3, [
          createLesson('Generic Functions', 'video', 1, 1200),
          createLesson('Generic Interfaces', 'video', 2, 900),
          createLesson('Generic Constraints', 'video', 3, 1080),
          createLesson('Utility Types', 'video', 4, 1500),
          createLesson('Generics Project', 'exercise', 5, 2400),
        ]),
        createModule('Advanced TypeScript', 'Advanced patterns and techniques', 4, [
          createLesson('Conditional Types', 'video', 1, 1200),
          createLesson('Mapped Types', 'video', 2, 1080),
          createLesson('Template Literal Types', 'video', 3, 900),
          createLesson('Decorators', 'video', 4, 1320),
          createLesson('Final Project', 'exercise', 5, 3600),
        ]),
      ],
    },
    requirements: [
      'JavaScript proficiency',
      'ES6+ features knowledge',
      'Basic programming concepts',
    ],
    outcomes: [
      'Write type-safe TypeScript code',
      'Use advanced type features',
      'Configure TypeScript projects',
      'Integrate with React/Node',
    ],
    targetAudience: [
      'JavaScript developers',
      'Frontend developers',
      'Full-stack developers',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },

  // ==================== DEVOPS COURSES ====================
  {
    _id: courseIds.dockerKubernetes,
    title: 'Docker & Kubernetes Essentials',
    slug: 'docker-kubernetes-essentials',
    description: `Learn containerization with Docker and orchestration with Kubernetes. This hands-on course takes you from basics to deploying production workloads.

You'll master:
- Docker fundamentals and Dockerfile
- Docker Compose for multi-container apps
- Kubernetes architecture
- Deployments, Services, and Ingress
- Helm charts
- CI/CD with containers`,
    shortDescription: 'Master containerization with Docker and orchestration with Kubernetes.',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
    instructor: instructorIdParam,
    category: categoryIds.ciCd,
    tags: ['Docker', 'Kubernetes', 'DevOps', 'Containers', 'Cloud Native'],
    level: 'intermediate',
    language: 'en',
    pricing: {
      type: 'paid',
      price: 99,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('Docker Fundamentals', 'Getting started with Docker', 1, [
          createLesson('What is Docker?', 'video', 1, 720, true),
          createLesson('Docker Installation', 'video', 2, 900),
          createLesson('Docker Images and Containers', 'video', 3, 1200),
          createLesson('Dockerfile Deep Dive', 'video', 4, 1500),
          createLesson('Build Your First Container', 'exercise', 5, 1800),
        ]),
        createModule('Docker Advanced', 'Advanced Docker concepts', 2, [
          createLesson('Docker Networking', 'video', 1, 1200),
          createLesson('Docker Volumes', 'video', 2, 1080),
          createLesson('Docker Compose', 'video', 3, 1500),
          createLesson('Multi-stage Builds', 'video', 4, 900),
          createLesson('Docker Compose Project', 'exercise', 5, 2700),
        ]),
        createModule('Kubernetes Basics', 'Introduction to Kubernetes', 3, [
          createLesson('Kubernetes Architecture', 'video', 1, 1320),
          createLesson('Pods and Deployments', 'video', 2, 1500),
          createLesson('Services and Networking', 'video', 3, 1200),
          createLesson('ConfigMaps and Secrets', 'video', 4, 1080),
          createLesson('K8s Deployment Practice', 'exercise', 5, 2400),
        ]),
        createModule('Kubernetes Production', 'Production Kubernetes', 4, [
          createLesson('Ingress Controllers', 'video', 1, 1200),
          createLesson('Helm Charts', 'video', 2, 1500),
          createLesson('Monitoring with Prometheus', 'video', 3, 1080),
          createLesson('Production Best Practices', 'video', 4, 1200),
          createLesson('Final Project: Deploy Microservices', 'exercise', 5, 5400),
        ]),
      ],
    },
    requirements: [
      'Linux command line basics',
      'Basic networking knowledge',
      'Understanding of web applications',
    ],
    outcomes: [
      'Build and manage Docker containers',
      'Deploy applications on Kubernetes',
      'Use Helm for package management',
      'Implement container best practices',
    ],
    targetAudience: [
      'Developers',
      'System administrators',
      'DevOps engineers',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },
  {
    _id: courseIds.cicdPipelines,
    title: 'CI/CD Pipeline Mastery',
    slug: 'ci-cd-pipeline-mastery',
    description: `Build automated CI/CD pipelines that ship code with confidence. Learn GitHub Actions, GitLab CI, Jenkins, and modern DevOps practices.

Master:
- CI/CD concepts and best practices
- GitHub Actions workflows
- GitLab CI/CD
- Jenkins pipelines
- Testing automation
- Deployment strategies`,
    shortDescription: 'Build automated CI/CD pipelines with GitHub Actions, GitLab CI, and Jenkins.',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800',
    instructor: instructorIdParam,
    category: categoryIds.ciCd,
    tags: ['CI/CD', 'DevOps', 'GitHub Actions', 'Jenkins', 'Automation'],
    level: 'intermediate',
    language: 'en',
    pricing: {
      type: 'paid',
      price: 79,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('CI/CD Fundamentals', 'Understanding CI/CD', 1, [
          createLesson('What is CI/CD?', 'video', 1, 900, true),
          createLesson('CI/CD Benefits and Best Practices', 'video', 2, 1080),
          createLesson('Version Control Strategies', 'video', 3, 1200),
          createLesson('Branching Workflows', 'video', 4, 1080),
        ]),
        createModule('GitHub Actions', 'Automate with GitHub', 2, [
          createLesson('GitHub Actions Introduction', 'video', 1, 1080),
          createLesson('Workflow Syntax', 'video', 2, 1500),
          createLesson('Actions and Runners', 'video', 3, 1200),
          createLesson('Secrets and Environments', 'video', 4, 900),
          createLesson('Build a CI Pipeline', 'exercise', 5, 2400),
        ]),
        createModule('Testing in CI', 'Automated testing', 3, [
          createLesson('Test Automation Strategies', 'video', 1, 1080),
          createLesson('Unit Testing in CI', 'video', 2, 1200),
          createLesson('Integration Testing', 'video', 3, 1320),
          createLesson('E2E Testing with Cypress', 'video', 4, 1500),
          createLesson('Add Testing to Pipeline', 'exercise', 5, 2700),
        ]),
        createModule('Deployment Strategies', 'Ship with confidence', 4, [
          createLesson('Blue-Green Deployments', 'video', 1, 1080),
          createLesson('Canary Releases', 'video', 2, 1200),
          createLesson('Rolling Updates', 'video', 3, 900),
          createLesson('Rollback Strategies', 'video', 4, 1080),
          createLesson('Complete CI/CD Pipeline', 'exercise', 5, 3600),
        ]),
      ],
    },
    requirements: [
      'Git basics',
      'Command line proficiency',
      'Basic YAML knowledge',
    ],
    outcomes: [
      'Build CI/CD pipelines from scratch',
      'Automate testing and deployment',
      'Implement deployment strategies',
      'Use GitHub Actions effectively',
    ],
    targetAudience: [
      'Developers',
      'DevOps engineers',
      'Team leads',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },

  // ==================== BUSINESS & TECH COURSES ====================
  {
    _id: courseIds.agileScrum,
    title: 'Agile Project Management with Scrum',
    slug: 'agile-project-management-scrum',
    description: `Master Agile methodologies and Scrum framework for effective project management. Learn to lead sprints, manage backlogs, and deliver value continuously.

Course covers:
- Agile principles and manifesto
- Scrum framework deep dive
- Sprint planning and execution
- Backlog management
- Retrospectives and improvement
- Scaling Agile`,
    shortDescription: 'Learn Agile methodologies and Scrum framework for modern project management.',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    instructor: instructorIdParam,
    category: categoryIds.projectManagement,
    tags: ['Agile', 'Scrum', 'Project Management', 'Leadership', 'Team'],
    level: 'beginner',
    language: 'en',
    pricing: {
      type: 'free',
      price: 0,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('Agile Fundamentals', 'Understanding Agile', 1, [
          createLesson('The Agile Manifesto', 'video', 1, 900, true),
          createLesson('Agile vs Waterfall', 'video', 2, 1080),
          createLesson('Agile Principles', 'article', 3, 600),
          createLesson('Agile Mindset', 'video', 4, 720),
          createLesson('Agile Quiz', 'quiz', 5, 300),
        ]),
        createModule('Scrum Framework', 'Mastering Scrum', 2, [
          createLesson('Scrum Overview', 'video', 1, 1200),
          createLesson('Scrum Roles', 'video', 2, 1080),
          createLesson('Scrum Events', 'video', 3, 1500),
          createLesson('Scrum Artifacts', 'video', 4, 1200),
          createLesson('Scrum Simulation', 'exercise', 5, 2400),
        ]),
        createModule('Sprint Execution', 'Running effective sprints', 3, [
          createLesson('Sprint Planning', 'video', 1, 1320),
          createLesson('Daily Standups', 'video', 2, 720),
          createLesson('Sprint Review', 'video', 3, 900),
          createLesson('Sprint Retrospective', 'video', 4, 1080),
          createLesson('Sprint Practice', 'exercise', 5, 1800),
        ]),
        createModule('Advanced Scrum', 'Taking Scrum further', 4, [
          createLesson('Backlog Refinement', 'video', 1, 1200),
          createLesson('User Stories', 'video', 2, 1080),
          createLesson('Estimation Techniques', 'video', 3, 1320),
          createLesson('Scaling Scrum', 'video', 4, 1500),
          createLesson('Final Assessment', 'quiz', 5, 600),
        ]),
      ],
    },
    requirements: [
      'No prior experience required',
      'Interest in project management',
      'Team collaboration experience helpful',
    ],
    outcomes: [
      'Understand Agile principles',
      'Implement Scrum framework',
      'Lead sprint ceremonies',
      'Manage product backlogs',
    ],
    targetAudience: [
      'Project managers',
      'Team leads',
      'Developers in Agile teams',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },
  {
    _id: courseIds.techLeadership,
    title: 'Tech Leadership Essentials',
    slug: 'tech-leadership-essentials',
    description: `Develop the skills to lead technology teams effectively. Learn people management, technical decision-making, and how to build high-performing engineering teams.

Topics include:
- Transitioning to leadership
- 1:1s and feedback
- Team building
- Technical decision-making
- Managing up and stakeholders
- Career development`,
    shortDescription: 'Develop essential leadership skills for managing technology teams.',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    instructor: instructorIdParam,
    category: categoryIds.leadership,
    tags: ['Leadership', 'Management', 'Team Building', 'Career', 'Soft Skills'],
    level: 'intermediate',
    language: 'en',
    pricing: {
      type: 'paid',
      price: 69,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('Leadership Foundations', 'Starting your leadership journey', 1, [
          createLesson('From IC to Leader', 'video', 1, 1080, true),
          createLesson('Leadership Styles', 'video', 2, 1200),
          createLesson('Building Trust', 'video', 3, 900),
          createLesson('Common Pitfalls', 'article', 4, 600),
        ]),
        createModule('People Management', 'Managing individuals', 2, [
          createLesson('Effective 1:1s', 'video', 1, 1320),
          createLesson('Giving Feedback', 'video', 2, 1200),
          createLesson('Career Development', 'video', 3, 1080),
          createLesson('Performance Management', 'video', 4, 1500),
          createLesson('1:1 Practice', 'exercise', 5, 1800),
        ]),
        createModule('Team Building', 'Creating high-performing teams', 3, [
          createLesson('Team Dynamics', 'video', 1, 1200),
          createLesson('Hiring and Onboarding', 'video', 2, 1500),
          createLesson('Building Culture', 'video', 3, 1080),
          createLesson('Remote Team Management', 'video', 4, 1200),
        ]),
        createModule('Technical Leadership', 'Leading technical decisions', 4, [
          createLesson('Technical Decision-Making', 'video', 1, 1320),
          createLesson('Architecture Reviews', 'video', 2, 1080),
          createLesson('Managing Technical Debt', 'video', 3, 1200),
          createLesson('Stakeholder Communication', 'video', 4, 1080),
          createLesson('Leadership Scenarios', 'exercise', 5, 2400),
        ]),
      ],
    },
    requirements: [
      '2+ years development experience',
      'Interest in leadership',
      'Some team collaboration experience',
    ],
    outcomes: [
      'Lead 1:1s effectively',
      'Give constructive feedback',
      'Build high-performing teams',
      'Make technical decisions',
    ],
    targetAudience: [
      'Senior developers',
      'Tech leads',
      'Engineering managers',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },

  // ==================== DATA ANALYTICS COURSES ====================
  {
    _id: courseIds.dataAnalytics,
    title: 'Data Analytics Masterclass',
    slug: 'data-analytics-masterclass',
    description: `Become a data analytics expert. Learn to collect, process, analyze, and visualize data to drive business decisions.

Course covers:
- Data analytics fundamentals
- SQL for data analysis
- Python for data analysis
- Data visualization
- Statistical analysis
- Business intelligence`,
    shortDescription: 'Master data analytics with SQL, Python, and visualization tools.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    instructor: instructorIdParam,
    category: categoryIds.dataAnalytics,
    tags: ['Data Analytics', 'SQL', 'Python', 'Visualization', 'BI'],
    level: 'beginner',
    language: 'en',
    pricing: {
      type: 'paid',
      price: 89,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('Analytics Foundations', 'Getting started with analytics', 1, [
          createLesson('What is Data Analytics?', 'video', 1, 900, true),
          createLesson('Types of Analytics', 'video', 2, 1080),
          createLesson('Analytics Process', 'video', 3, 1200),
          createLesson('Tools Overview', 'video', 4, 900),
        ]),
        createModule('SQL for Analytics', 'Data analysis with SQL', 2, [
          createLesson('SQL Fundamentals', 'video', 1, 1320),
          createLesson('Aggregations and Grouping', 'video', 2, 1200),
          createLesson('Joins and Subqueries', 'video', 3, 1500),
          createLesson('Window Functions', 'video', 4, 1200),
          createLesson('SQL Practice', 'exercise', 5, 2700),
        ]),
        createModule('Python for Analytics', 'Data analysis with Python', 3, [
          createLesson('Pandas Introduction', 'video', 1, 1200),
          createLesson('Data Cleaning', 'video', 2, 1500),
          createLesson('Data Transformation', 'video', 3, 1320),
          createLesson('Exploratory Analysis', 'video', 4, 1500),
          createLesson('Python Analysis Project', 'exercise', 5, 3600),
        ]),
        createModule('Data Visualization', 'Telling stories with data', 4, [
          createLesson('Visualization Principles', 'video', 1, 1080),
          createLesson('Matplotlib and Seaborn', 'video', 2, 1500),
          createLesson('Interactive Dashboards', 'video', 3, 1200),
          createLesson('Final Project: Analytics Dashboard', 'exercise', 4, 5400),
        ]),
      ],
    },
    requirements: [
      'Basic computer skills',
      'Basic math/statistics',
      'Curiosity about data',
    ],
    outcomes: [
      'Analyze data with SQL and Python',
      'Create compelling visualizations',
      'Make data-driven decisions',
      'Build analytics dashboards',
    ],
    targetAudience: [
      'Aspiring data analysts',
      'Business professionals',
      'Anyone working with data',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },

  // ==================== SECURITY COURSES ====================
  {
    _id: courseIds.cloudSecurity,
    title: 'Cloud Security Fundamentals',
    slug: 'cloud-security-fundamentals',
    description: `Learn to secure cloud infrastructure and applications. Covers AWS, Azure, and GCP security services, compliance, and best practices.

Topics include:
- Cloud security principles
- Identity and access management
- Network security
- Data protection
- Compliance frameworks
- Security automation`,
    shortDescription: 'Master cloud security best practices for AWS, Azure, and GCP.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
    instructor: instructorIdParam,
    category: categoryIds.security,
    tags: ['Security', 'Cloud', 'AWS', 'Azure', 'Compliance'],
    level: 'intermediate',
    language: 'en',
    pricing: {
      type: 'paid',
      price: 109,
      currency: 'USD',
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      modules: [
        createModule('Cloud Security Basics', 'Security foundations', 1, [
          createLesson('Cloud Security Overview', 'video', 1, 1080, true),
          createLesson('Shared Responsibility Model', 'video', 2, 1200),
          createLesson('Security Frameworks', 'video', 3, 1320),
          createLesson('Threat Landscape', 'video', 4, 1080),
        ]),
        createModule('Identity & Access', 'IAM security', 2, [
          createLesson('IAM Fundamentals', 'video', 1, 1500),
          createLesson('Least Privilege Principle', 'video', 2, 1200),
          createLesson('MFA and SSO', 'video', 3, 1080),
          createLesson('IAM Best Practices', 'video', 4, 1320),
          createLesson('IAM Security Lab', 'exercise', 5, 2700),
        ]),
        createModule('Network Security', 'Securing cloud networks', 3, [
          createLesson('VPC Security', 'video', 1, 1500),
          createLesson('Security Groups and NACLs', 'video', 2, 1200),
          createLesson('WAF and DDoS Protection', 'video', 3, 1320),
          createLesson('Network Monitoring', 'video', 4, 1080),
          createLesson('Network Security Lab', 'exercise', 5, 2400),
        ]),
        createModule('Data Protection', 'Protecting data in cloud', 4, [
          createLesson('Encryption at Rest', 'video', 1, 1200),
          createLesson('Encryption in Transit', 'video', 2, 1080),
          createLesson('Key Management', 'video', 3, 1320),
          createLesson('Data Classification', 'video', 4, 900),
          createLesson('Security Assessment', 'exercise', 5, 3600),
        ]),
      ],
    },
    requirements: [
      'Basic cloud knowledge',
      'Understanding of networking',
      'AWS/Azure/GCP account',
    ],
    outcomes: [
      'Implement cloud security best practices',
      'Configure IAM securely',
      'Secure cloud networks',
      'Protect data in the cloud',
    ],
    targetAudience: [
      'Cloud engineers',
      'Security professionals',
      'DevOps engineers',
    ],
    stats: { enrollments: 0, completions: 0, averageRating: 0, totalReviews: 0 },
    status: 'published',
    publishedAt: new Date(),
  },
];
