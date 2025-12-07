import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { Enrollment } from '../models/Enrollment.js';
import { ApiError } from '../utils/ApiError.js';

// Get user profile
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          role: user.role,
          subscription: user.subscription,
          gamification: user.gamification,
          preferences: user.preferences,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'bio', 'avatar', 'timezone', 'language'];
    const updates: Record<string, unknown> = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[`profile.${key}`] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update preferences
export const updatePreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allowedUpdates = ['emailNotifications', 'pushNotifications', 'darkMode'];
    const updates: Record<string, unknown> = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[`preferences.${key}`] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    );

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.json({
      success: true,
      data: { preferences: user.preferences },
    });
  } catch (error) {
    next(error);
  }
};

// Get user enrollments
export const getEnrollments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.query;

    const filter: Record<string, unknown> = { user: req.userId };
    if (status) {
      filter.status = status;
    }

    const enrollments = await Enrollment.find(filter)
      .populate({
        path: 'course',
        select: 'title slug thumbnail shortDescription content.totalLessons content.totalDuration instructor',
        populate: {
          path: 'instructor',
          select: 'profile.firstName profile.lastName profile.avatar',
        },
      })
      .sort({ enrolledAt: -1 });

    res.json({
      success: true,
      data: { enrollments },
    });
  } catch (error) {
    next(error);
  }
};

// Get user progress overview
export const getProgressOverview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const enrollments = await Enrollment.find({ user: req.userId });

    const stats = {
      totalCourses: enrollments.length,
      completedCourses: enrollments.filter((e) => e.status === 'completed').length,
      inProgressCourses: enrollments.filter((e) => e.status === 'active').length,
      totalLearningTime: enrollments.reduce((acc, e) => acc + e.progress.timeSpent, 0),
      averageProgress: enrollments.length
        ? Math.round(
            enrollments.reduce((acc, e) => acc + e.progress.percentage, 0) /
              enrollments.length
          )
        : 0,
      totalQuizzesPassed: enrollments.reduce(
        (acc, e) =>
          acc +
          e.quizAttempts.filter((a) => a.score / a.maxScore >= 0.7).length,
        0
      ),
      certificatesEarned: enrollments.filter((e) => e.certificate.issued).length,
    };

    res.json({
      success: true,
      data: {
        gamification: user.gamification,
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user certificates
export const getCertificates = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const enrollments = await Enrollment.find({
      user: req.userId,
      'certificate.issued': true,
    }).populate('course', 'title slug thumbnail instructor');

    const certificates = enrollments.map((e) => ({
      ...e.certificate,
      course: e.course,
      completedAt: e.completedAt,
    }));

    res.json({
      success: true,
      data: { certificates },
    });
  } catch (error) {
    next(error);
  }
};

// Get user badges
export const getBadges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).populate(
      'gamification.badges.badgeId'
    );

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.json({
      success: true,
      data: { badges: user.gamification.badges },
    });
  } catch (error) {
    next(error);
  }
};

// Delete account
export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.userId).select('+password');

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Verify password
    if (user.password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw ApiError.badRequest('Incorrect password');
      }
    }

    // Soft delete
    user.isActive = false;
    user.email = `deleted_${user._id}@deleted.com`;
    await user.save();

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
