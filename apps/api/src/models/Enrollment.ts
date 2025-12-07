import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizAttempt {
  quizId: mongoose.Types.ObjectId;
  attemptNumber: number;
  score: number;
  maxScore: number;
  answers: Array<{
    questionId: mongoose.Types.ObjectId;
    answer: unknown;
    isCorrect: boolean;
  }>;
  completedAt: Date;
  timeSpent: number;
}

export interface IEnrollment extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrolledAt: Date;
  completedAt?: Date;
  progress: {
    percentage: number;
    completedLessons: mongoose.Types.ObjectId[];
    currentLesson?: mongoose.Types.ObjectId;
    lastAccessedAt?: Date;
    timeSpent: number;
  };
  quizAttempts: IQuizAttempt[];
  certificate: {
    issued: boolean;
    issuedAt?: Date;
    certificateId?: string;
    certificateUrl?: string;
  };
  payment: {
    orderId?: mongoose.Types.ObjectId;
    amount: number;
    method?: string;
  };
  status: 'active' | 'completed' | 'expired' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quizId: { type: Schema.Types.ObjectId, required: true },
    attemptNumber: { type: Number, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    answers: [
      {
        questionId: Schema.Types.ObjectId,
        answer: Schema.Types.Mixed,
        isCorrect: Boolean,
      },
    ],
    completedAt: { type: Date, default: Date.now },
    timeSpent: { type: Number, default: 0 },
  },
  { _id: true }
);

const enrollmentSchema = new Schema<IEnrollment>(
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
    enrolledAt: { type: Date, default: Date.now },
    completedAt: Date,
    progress: {
      percentage: { type: Number, default: 0 },
      completedLessons: [{ type: Schema.Types.ObjectId }],
      currentLesson: Schema.Types.ObjectId,
      lastAccessedAt: Date,
      timeSpent: { type: Number, default: 0 },
    },
    quizAttempts: [quizAttemptSchema],
    certificate: {
      issued: { type: Boolean, default: false },
      issuedAt: Date,
      certificateId: String,
      certificateUrl: String,
    },
    payment: {
      orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
      amount: { type: Number, default: 0 },
      method: String,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'expired', 'refunded'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ user: 1, status: 1 });
enrollmentSchema.index({ course: 1 });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
export default Enrollment;
