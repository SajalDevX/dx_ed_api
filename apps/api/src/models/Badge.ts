import mongoose, { Document, Schema } from 'mongoose';

export interface IBadge extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  icon: string;
  type: 'achievement' | 'milestone' | 'skill' | 'special';
  criteria: {
    type:
      | 'courses_completed'
      | 'quizzes_passed'
      | 'streak_days'
      | 'points_earned'
      | 'reviews_written'
      | 'custom';
    threshold: number;
    courseIds?: mongoose.Types.ObjectId[];
    customLogic?: string;
  };
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const badgeSchema = new Schema<IBadge>(
  {
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Badge description is required'],
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    icon: {
      type: String,
      required: [true, 'Badge icon is required'],
    },
    type: {
      type: String,
      enum: ['achievement', 'milestone', 'skill', 'special'],
      required: true,
    },
    criteria: {
      type: {
        type: String,
        enum: [
          'courses_completed',
          'quizzes_passed',
          'streak_days',
          'points_earned',
          'reviews_written',
          'custom',
        ],
        required: true,
      },
      threshold: { type: Number, required: true },
      courseIds: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
      customLogic: String,
    },
    points: { type: Number, default: 0 },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
badgeSchema.index({ type: 1, isActive: 1 });
badgeSchema.index({ 'criteria.type': 1 });

export const Badge = mongoose.model<IBadge>('Badge', badgeSchema);
export default Badge;
