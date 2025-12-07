import { Types } from 'mongoose';

export const badgeIds = {
  // Achievement badges
  firstCourse: new Types.ObjectId(),
  courseMaster: new Types.ObjectId(),
  quizWhiz: new Types.ObjectId(),
  perfectScore: new Types.ObjectId(),
  // Milestone badges
  tenCourses: new Types.ObjectId(),
  streakStarter: new Types.ObjectId(),
  weekWarrior: new Types.ObjectId(),
  monthlyMaster: new Types.ObjectId(),
  // Skill badges
  aiExplorer: new Types.ObjectId(),
  webWizard: new Types.ObjectId(),
  cloudChampion: new Types.ObjectId(),
  devOpsNinja: new Types.ObjectId(),
  // Special badges
  earlyAdopter: new Types.ObjectId(),
  communityHelper: new Types.ObjectId(),
  lifetimeLearner: new Types.ObjectId(),
};

export const badgesData = [
  // Achievement Badges
  {
    _id: badgeIds.firstCourse,
    name: 'First Steps',
    description: 'Completed your first course. The journey of a thousand miles begins with a single step!',
    icon: 'https://api.iconify.design/mdi:trophy-outline.svg',
    type: 'achievement',
    criteria: {
      type: 'courses_completed',
      threshold: 1,
    },
    points: 50,
    rarity: 'common',
    isActive: true,
  },
  {
    _id: badgeIds.courseMaster,
    name: 'Course Master',
    description: 'Completed 5 courses. You are on your way to mastery!',
    icon: 'https://api.iconify.design/mdi:school-outline.svg',
    type: 'achievement',
    criteria: {
      type: 'courses_completed',
      threshold: 5,
    },
    points: 200,
    rarity: 'uncommon',
    isActive: true,
  },
  {
    _id: badgeIds.quizWhiz,
    name: 'Quiz Whiz',
    description: 'Passed 10 quizzes with flying colors. Knowledge is power!',
    icon: 'https://api.iconify.design/mdi:head-question-outline.svg',
    type: 'achievement',
    criteria: {
      type: 'quizzes_passed',
      threshold: 10,
    },
    points: 150,
    rarity: 'uncommon',
    isActive: true,
  },
  {
    _id: badgeIds.perfectScore,
    name: 'Perfect Score',
    description: 'Achieved 100% on a quiz. Flawless victory!',
    icon: 'https://api.iconify.design/mdi:star-circle-outline.svg',
    type: 'achievement',
    criteria: {
      type: 'custom',
      threshold: 1,
      customLogic: 'quiz_score_100',
    },
    points: 100,
    rarity: 'rare',
    isActive: true,
  },

  // Milestone Badges
  {
    _id: badgeIds.tenCourses,
    name: 'Dedicated Learner',
    description: 'Completed 10 courses. Your dedication is inspiring!',
    icon: 'https://api.iconify.design/mdi:medal-outline.svg',
    type: 'milestone',
    criteria: {
      type: 'courses_completed',
      threshold: 10,
    },
    points: 500,
    rarity: 'rare',
    isActive: true,
  },
  {
    _id: badgeIds.streakStarter,
    name: 'Streak Starter',
    description: 'Maintained a 3-day learning streak. Consistency is key!',
    icon: 'https://api.iconify.design/mdi:fire.svg',
    type: 'milestone',
    criteria: {
      type: 'streak_days',
      threshold: 3,
    },
    points: 30,
    rarity: 'common',
    isActive: true,
  },
  {
    _id: badgeIds.weekWarrior,
    name: 'Week Warrior',
    description: 'Maintained a 7-day learning streak. A full week of learning!',
    icon: 'https://api.iconify.design/mdi:calendar-check.svg',
    type: 'milestone',
    criteria: {
      type: 'streak_days',
      threshold: 7,
    },
    points: 100,
    rarity: 'uncommon',
    isActive: true,
  },
  {
    _id: badgeIds.monthlyMaster,
    name: 'Monthly Master',
    description: 'Maintained a 30-day learning streak. Unstoppable!',
    icon: 'https://api.iconify.design/mdi:calendar-star.svg',
    type: 'milestone',
    criteria: {
      type: 'streak_days',
      threshold: 30,
    },
    points: 500,
    rarity: 'epic',
    isActive: true,
  },

  // Skill Badges
  {
    _id: badgeIds.aiExplorer,
    name: 'AI Explorer',
    description: 'Completed 3 AI & Machine Learning courses. Welcome to the future!',
    icon: 'https://api.iconify.design/mdi:robot-outline.svg',
    type: 'skill',
    criteria: {
      type: 'courses_completed',
      threshold: 3,
      courseIds: [], // Will be populated with AI category courses
    },
    points: 300,
    rarity: 'rare',
    isActive: true,
  },
  {
    _id: badgeIds.webWizard,
    name: 'Web Wizard',
    description: 'Completed 3 Web Development courses. You can build anything!',
    icon: 'https://api.iconify.design/mdi:web.svg',
    type: 'skill',
    criteria: {
      type: 'courses_completed',
      threshold: 3,
      courseIds: [], // Will be populated with Web Dev category courses
    },
    points: 300,
    rarity: 'rare',
    isActive: true,
  },
  {
    _id: badgeIds.cloudChampion,
    name: 'Cloud Champion',
    description: 'Completed 3 Cloud Computing courses. Head in the clouds, feet on the ground!',
    icon: 'https://api.iconify.design/mdi:cloud-check-outline.svg',
    type: 'skill',
    criteria: {
      type: 'courses_completed',
      threshold: 3,
      courseIds: [], // Will be populated with Cloud category courses
    },
    points: 300,
    rarity: 'rare',
    isActive: true,
  },
  {
    _id: badgeIds.devOpsNinja,
    name: 'DevOps Ninja',
    description: 'Completed 3 DevOps courses. Deploy with confidence!',
    icon: 'https://api.iconify.design/mdi:ninja.svg',
    type: 'skill',
    criteria: {
      type: 'courses_completed',
      threshold: 3,
      courseIds: [], // Will be populated with DevOps category courses
    },
    points: 300,
    rarity: 'rare',
    isActive: true,
  },

  // Special Badges
  {
    _id: badgeIds.earlyAdopter,
    name: 'Early Adopter',
    description: 'Joined DX Education in its early days. Thank you for believing in us!',
    icon: 'https://api.iconify.design/mdi:rocket-launch-outline.svg',
    type: 'special',
    criteria: {
      type: 'custom',
      threshold: 1,
      customLogic: 'early_adopter',
    },
    points: 200,
    rarity: 'legendary',
    isActive: true,
  },
  {
    _id: badgeIds.communityHelper,
    name: 'Community Helper',
    description: 'Helped 10 fellow learners with your reviews and feedback.',
    icon: 'https://api.iconify.design/mdi:hand-heart-outline.svg',
    type: 'special',
    criteria: {
      type: 'reviews_written',
      threshold: 10,
    },
    points: 250,
    rarity: 'epic',
    isActive: true,
  },
  {
    _id: badgeIds.lifetimeLearner,
    name: 'Lifetime Learner',
    description: 'Earned 5000 points. Learning is a lifelong journey!',
    icon: 'https://api.iconify.design/mdi:infinity.svg',
    type: 'special',
    criteria: {
      type: 'points_earned',
      threshold: 5000,
    },
    points: 1000,
    rarity: 'legendary',
    isActive: true,
  },
];
