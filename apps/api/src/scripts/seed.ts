import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// Import models
import { Category } from '../models/Category.js';
import { Badge } from '../models/Badge.js';
import { Course } from '../models/Course.js';
import { Quiz } from '../models/Quiz.js';
import { User } from '../models/User.js';

// Import seed data
import {
  categoriesData,
  categoryIds,
  badgesData,
  getCoursesData,
  courseIds,
  getQuizzesData,
} from './seedData/index.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dx_education';

// System instructor data
const systemInstructorData = {
  email: 'instructor@dxeducation.com',
  password: 'DxEdu2024!',
  profile: {
    firstName: 'DX',
    lastName: 'Education',
    bio: 'Official DX Education instructor account. We create high-quality courses to help you master digital transformation skills.',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DX',
  },
  role: 'instructor' as const,
  isVerified: true,
  isActive: true,
  gamification: {
    points: 10000,
    level: 10,
    badges: [],
    streak: { current: 0, longest: 0 },
  },
};

async function clearCollections() {
  console.log('📦 Clearing content collections...');

  await Category.deleteMany({});
  console.log('   ✓ Categories cleared');

  await Badge.deleteMany({});
  console.log('   ✓ Badges cleared');

  await Course.deleteMany({});
  console.log('   ✓ Courses cleared');

  await Quiz.deleteMany({});
  console.log('   ✓ Quizzes cleared');

  // Delete only the system instructor
  await User.deleteOne({ email: 'instructor@dxeducation.com' });
  console.log('   ✓ System instructor cleared');
}

async function seedCategories() {
  console.log('\n📁 Seeding categories...');

  const categories = await Category.insertMany(categoriesData);
  console.log(`   ✅ Categories seeded: ${categories.length}`);

  return categories;
}

async function seedBadges() {
  console.log('\n🏆 Seeding badges...');

  const badges = await Badge.insertMany(badgesData);
  console.log(`   ✅ Badges seeded: ${badges.length}`);

  return badges;
}

async function seedSystemInstructor() {
  console.log('\n👤 Creating system instructor...');

  const instructor = await User.create(systemInstructorData);
  console.log(`   ✅ System instructor created: ${instructor.email}`);

  return instructor;
}

async function seedCourses(instructorId: mongoose.Types.ObjectId) {
  console.log('\n📚 Seeding courses...');

  const coursesData = getCoursesData(instructorId);

  // Calculate content stats for each course
  const coursesWithStats = coursesData.map(course => {
    let totalLessons = 0;
    let totalDuration = 0;
    let totalQuizzes = 0;

    course.content.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++;
        totalDuration += lesson.duration;
        if (lesson.type === 'quiz') {
          totalQuizzes++;
        }
      });
    });

    return {
      ...course,
      content: {
        ...course.content,
        totalLessons,
        totalDuration,
        totalQuizzes,
      },
    };
  });

  const courses = await Course.insertMany(coursesWithStats);
  console.log(`   ✅ Courses seeded: ${courses.length}`);

  // Update category course counts
  const categoryCounts = new Map<string, number>();
  coursesWithStats.forEach(course => {
    const catId = course.category.toString();
    categoryCounts.set(catId, (categoryCounts.get(catId) || 0) + 1);
  });

  for (const [categoryId, count] of categoryCounts) {
    await Category.findByIdAndUpdate(categoryId, { courseCount: count });
  }
  console.log('   ✅ Category course counts updated');

  return courses;
}

async function seedQuizzes() {
  console.log('\n❓ Seeding quizzes...');

  const courseMap = new Map<string, mongoose.Types.ObjectId>();
  const quizzesData = getQuizzesData(courseMap);

  const quizzes = await Quiz.insertMany(quizzesData);
  console.log(`   ✅ Quizzes seeded: ${quizzes.length}`);

  return quizzes;
}

async function main() {
  try {
    console.log('🌱 Starting database seed...\n');
    console.log(`📡 Connecting to MongoDB...`);

    await mongoose.connect(MONGODB_URI);
    console.log('   ✓ Connected to MongoDB\n');

    // Clear existing content
    await clearCollections();

    // Seed in order
    await seedCategories();
    await seedBadges();
    const instructor = await seedSystemInstructor();
    await seedCourses(instructor._id as mongoose.Types.ObjectId);
    await seedQuizzes();

    console.log('\n🎉 Content seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • Categories: ${(await Category.countDocuments())}`);
    console.log(`   • Badges: ${(await Badge.countDocuments())}`);
    console.log(`   • Courses: ${(await Course.countDocuments())}`);
    console.log(`   • Quizzes: ${(await Quiz.countDocuments())}`);
    console.log(`   • System Instructor: instructor@dxeducation.com (password: DxEdu2024!)`);

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

main();
