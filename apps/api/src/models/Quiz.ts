import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  _id: mongoose.Types.ObjectId;
  type:
    | 'multiple-choice'
    | 'multiple-select'
    | 'true-false'
    | 'fill-blank'
    | 'matching'
    | 'ordering'
    | 'short-answer';
  question: string;
  questionMedia?: {
    type: string;
    url: string;
  };
  options?: Array<{
    _id: mongoose.Types.ObjectId;
    text: string;
    isCorrect: boolean;
    media?: { type: string; url: string };
  }>;
  correctAnswer?: unknown;
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  order: number;
}

export interface IQuiz extends Document {
  _id: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  module?: mongoose.Types.ObjectId;
  lesson?: mongoose.Types.ObjectId;
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
  questions: IQuestion[];
  stats: {
    totalAttempts: number;
    averageScore: number;
    passRate: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    type: {
      type: String,
      enum: [
        'multiple-choice',
        'multiple-select',
        'true-false',
        'fill-blank',
        'matching',
        'ordering',
        'short-answer',
      ],
      required: true,
    },
    question: { type: String, required: true },
    questionMedia: {
      type: { type: String },
      url: String,
    },
    options: [
      {
        text: String,
        isCorrect: Boolean,
        media: {
          type: { type: String },
          url: String,
        },
      },
    ],
    correctAnswer: Schema.Types.Mixed,
    explanation: String,
    points: { type: Number, default: 10 },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    tags: [String],
    order: { type: Number, required: true },
  },
  { _id: true }
);

const quizSchema = new Schema<IQuiz>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    module: Schema.Types.ObjectId,
    lesson: Schema.Types.ObjectId,
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    description: String,
    type: {
      type: String,
      enum: ['practice', 'graded', 'final'],
      default: 'practice',
    },
    settings: {
      timeLimit: Number,
      passingScore: { type: Number, default: 70 },
      maxAttempts: Number,
      shuffleQuestions: { type: Boolean, default: true },
      shuffleAnswers: { type: Boolean, default: true },
      showCorrectAnswers: { type: Boolean, default: true },
      showExplanations: { type: Boolean, default: true },
    },
    questions: [questionSchema],
    stats: {
      totalAttempts: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      passRate: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
quizSchema.index({ course: 1 });
quizSchema.index({ lesson: 1 });

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
export default Quiz;
