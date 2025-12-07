import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  content: string;
  helpful: {
    count: number;
    users: mongoose.Types.ObjectId[];
  };
  instructorResponse?: {
    content: string;
    respondedAt: Date;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Review content is required'],
      maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },
    helpful: {
      count: { type: Number, default: 0 },
      users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    instructorResponse: {
      content: String,
      respondedAt: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ course: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ user: 1, course: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
