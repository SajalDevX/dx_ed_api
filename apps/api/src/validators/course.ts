import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Description cannot exceed 5000 characters'),
  shortDescription: z
    .string()
    .min(1, 'Short description is required')
    .max(300, 'Short description cannot exceed 300 characters'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  language: z.string().default('en'),
  tags: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([]),
  targetAudience: z.array(z.string()).default([]),
  pricing: z.object({
    type: z.enum(['free', 'paid', 'subscription']).default('free'),
    price: z.number().min(0).default(0),
    currency: z.string().default('USD'),
  }).optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createModuleSchema = z.object({
  title: z.string().min(1, 'Module title is required'),
  description: z.string().optional(),
});

export const createLessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required'),
  type: z.enum(['article', 'quiz']),
  duration: z.number().min(0).default(0),
  content: z.object({
    articleContent: z.string().optional(),
    resources: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.string(),
    })).optional(),
  }).optional(),
  isPreview: z.boolean().default(false),
});

// Helper to convert empty strings to undefined
const emptyToUndefined = z.literal('').transform(() => undefined);

export const courseQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  category: z.string().optional(),
  level: z.union([z.enum(['beginner', 'intermediate', 'advanced']), emptyToUndefined]).optional(),
  pricing: z.union([z.enum(['free', 'paid']), emptyToUndefined]).optional(),
  search: z.string().optional(),
  sort: z.union([z.enum(['newest', 'popular', 'rating', 'price-low', 'price-high']), emptyToUndefined]).default('newest'),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type CourseQueryInput = z.infer<typeof courseQuerySchema>;
