import mongoose, { Types } from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Course } from '../models/Course.js';
import { Quiz } from '../models/Quiz.js';

// Helper to convert string ID to ObjectId
const toObjectId = (id: string | null | undefined): Types.ObjectId | null => {
  if (!id || id === '') return null;
  try {
    return new Types.ObjectId(id);
  } catch {
    console.warn(`Invalid ObjectId: ${id}`);
    return null;
  }
};

// Helper to convert date string to Date object
const toDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr);
  } catch {
    return null;
  }
};

// Process user data
const processUser = (user: Record<string, unknown>) => {
  return {
    ...user,
    _id: toObjectId(user._id as string),
    gamification: {
      ...(user.gamification as Record<string, unknown>),
      badges: ((user.gamification as Record<string, unknown>)?.badges as Array<Record<string, unknown>> || []).map((badge) => ({
        ...badge,
        badgeId: toObjectId(badge.badgeId as string),
        earnedAt: toDate(badge.earnedAt as string),
      })),
      streak: {
        ...((user.gamification as Record<string, unknown>)?.streak as Record<string, unknown>),
        lastActivityDate: toDate(((user.gamification as Record<string, unknown>)?.streak as Record<string, unknown>)?.lastActivityDate as string),
      },
    },
    subscription: {
      ...(user.subscription as Record<string, unknown>),
      currentPeriodStart: toDate((user.subscription as Record<string, unknown>)?.currentPeriodStart as string),
      currentPeriodEnd: toDate((user.subscription as Record<string, unknown>)?.currentPeriodEnd as string),
    },
    resetPasswordExpires: toDate(user.resetPasswordExpires as string),
    lastLoginAt: toDate(user.lastLoginAt as string),
    createdAt: toDate(user.createdAt as string) || new Date(),
    updatedAt: toDate(user.updatedAt as string) || new Date(),
  };
};

// Process category data
const processCategory = (category: Record<string, unknown>) => {
  return {
    ...category,
    _id: toObjectId(category._id as string),
    parent: toObjectId(category.parent as string),
    createdAt: toDate(category.createdAt as string) || new Date(),
    updatedAt: toDate(category.updatedAt as string) || new Date(),
  };
};

// Process course data
const processCourse = (course: Record<string, unknown>) => {
  const content = course.content as Record<string, unknown>;
  const modules = (content?.modules as Array<Record<string, unknown>>) || [];

  return {
    ...course,
    _id: toObjectId(course._id as string),
    instructor: toObjectId(course.instructor as string),
    category: toObjectId(course.category as string),
    subcategory: toObjectId(course.subcategory as string),
    content: {
      ...content,
      modules: modules.map((module) => ({
        ...module,
        _id: toObjectId(module._id as string),
        lessons: ((module.lessons as Array<Record<string, unknown>>) || []).map((lesson) => ({
          ...lesson,
          _id: toObjectId(lesson._id as string),
        })),
      })),
    },
    publishedAt: toDate(course.publishedAt as string),
    createdAt: toDate(course.createdAt as string) || new Date(),
    updatedAt: toDate(course.updatedAt as string) || new Date(),
  };
};

// Process quiz data
const processQuiz = (quiz: Record<string, unknown>) => {
  return {
    ...quiz,
    _id: toObjectId(quiz._id as string),
    course: toObjectId(quiz.course as string),
    module: toObjectId(quiz.module as string),
    lesson: toObjectId(quiz.lesson as string),
    questions: ((quiz.questions as Array<Record<string, unknown>>) || []).map((question) => ({
      ...question,
      _id: toObjectId(question._id as string),
      options: ((question.options as Array<Record<string, unknown>>) || []).map((option) => ({
        ...option,
        _id: new Types.ObjectId(), // Generate new ObjectId for each option
      })),
    })),
    createdAt: toDate(quiz.createdAt as string) || new Date(),
    updatedAt: toDate(quiz.updatedAt as string) || new Date(),
  };
};

async function importJsonData() {
  console.log('📥 Starting JSON data import (upsert mode)...');

  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Read JSON file
    const jsonPath = join(process.cwd(), '..', '..', 'seed_data.json');
    console.log(`📄 Reading seed_data.json from: ${jsonPath}`);

    const jsonContent = readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(jsonContent);

    // Import Users
    console.log('\n👤 Importing users...');
    const users = (data.users || []).map(processUser);
    let usersUpserted = 0;
    for (const user of users) {
      await User.findByIdAndUpdate(
        user._id,
        { $set: user },
        { upsert: true, new: true }
      );
      usersUpserted++;
    }
    console.log(`✅ Users upserted: ${usersUpserted}`);

    // Import Categories
    console.log('\n📁 Importing categories...');
    const categories = (data.categories || []).map(processCategory);
    let categoriesUpserted = 0;
    for (const category of categories) {
      // First, delete any existing category with the same slug but different _id
      await Category.deleteOne({
        slug: category.slug,
        _id: { $ne: category._id }
      });
      await Category.findByIdAndUpdate(
        category._id,
        { $set: category },
        { upsert: true, new: true }
      );
      categoriesUpserted++;
    }
    console.log(`✅ Categories upserted: ${categoriesUpserted}`);

    // Import Courses
    console.log('\n📚 Importing courses...');
    const courses = (data.courses || []).map(processCourse);
    let coursesUpserted = 0;
    for (const course of courses) {
      // First, delete any existing course with the same slug but different _id
      await Course.deleteOne({
        slug: course.slug,
        _id: { $ne: course._id }
      });
      await Course.findByIdAndUpdate(
        course._id,
        { $set: course },
        { upsert: true, new: true }
      );
      coursesUpserted++;
    }
    console.log(`✅ Courses upserted: ${coursesUpserted}`);

    // Import Quizzes
    console.log('\n❓ Importing quizzes...');
    const quizzes = (data.quizzes || []).map(processQuiz);
    let quizzesUpserted = 0;
    for (const quiz of quizzes) {
      await Quiz.findByIdAndUpdate(
        quiz._id,
        { $set: quiz },
        { upsert: true, new: true }
      );
      quizzesUpserted++;
    }
    console.log(`✅ Quizzes upserted: ${quizzesUpserted}`);

    console.log('\n🎉 JSON import completed successfully!');
    console.log(`
Summary:
- Users: ${usersUpserted}
- Categories: ${categoriesUpserted}
- Courses: ${coursesUpserted}
- Quizzes: ${quizzesUpserted}
    `);

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the import
importJsonData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
