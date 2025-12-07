import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  type: 'article' | 'quiz';
  duration: number;
  content: {
    articleContent?: string;
    resources?: Array<{
      title: string;
      url: string;
      type: string;
    }>;
  };
  isPreview: boolean;
  order: number;
}

export interface IModule {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail?: string;
  instructor: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  pricing: {
    type: 'free' | 'paid' | 'subscription';
    price: number;
    currency: string;
    discount?: {
      percentage: number;
      validUntil?: Date;
    };
    stripePriceId?: string;
  };
  content: {
    totalDuration: number;
    totalLessons: number;
    totalQuizzes: number;
    modules: IModule[];
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
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  status: 'draft' | 'review' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    type: {
      type: String,
      enum: ['article', 'quiz'],
      required: true,
    },
    duration: { type: Number, default: 0 },
    content: {
      articleContent: String,
      resources: [
        {
          title: String,
          url: String,
          type: String,
        },
      ],
    },
    isPreview: { type: Boolean, default: false },
    order: { type: Number, required: true },
  },
  { _id: true }
);

const moduleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    order: { type: Number, required: true },
    lessons: [lessonSchema],
  },
  { _id: true }
);

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    thumbnail: String,
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    tags: [{ type: String, trim: true }],
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    language: { type: String, default: 'en' },
    pricing: {
      type: {
        type: String,
        enum: ['free', 'paid', 'subscription'],
        default: 'free',
      },
      price: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      discount: {
        percentage: Number,
        validUntil: Date,
      },
      stripePriceId: String,
    },
    content: {
      totalDuration: { type: Number, default: 0 },
      totalLessons: { type: Number, default: 0 },
      totalQuizzes: { type: Number, default: 0 },
      modules: [moduleSchema],
    },
    requirements: [String],
    outcomes: [String],
    targetAudience: [String],
    stats: {
      enrollments: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes (slug index created by unique: true in schema)
courseSchema.index({ status: 1, publishedAt: -1 });
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ 'pricing.type': 1 });
courseSchema.index({ tags: 1 });
courseSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, description: 1 } }
);

// Generate slug from title
courseSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Update stats
courseSchema.methods.updateContentStats = function () {
  let totalLessons = 0;
  let totalDuration = 0;
  let totalQuizzes = 0;

  this.content.modules.forEach((module: IModule) => {
    module.lessons.forEach((lesson: ILesson) => {
      totalLessons++;
      totalDuration += lesson.duration || 0;
      if (lesson.type === 'quiz') totalQuizzes++;
    });
  });

  this.content.totalLessons = totalLessons;
  this.content.totalDuration = totalDuration;
  this.content.totalQuizzes = totalQuizzes;
};

export const Course = mongoose.model<ICourse>('Course', courseSchema);
export default Course;
