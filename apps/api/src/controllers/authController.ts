import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import {
  generateTokenPair,
  verifyRefreshToken,
  generateVerificationToken,
  generateResetToken,
} from '../utils/jwt.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../validators/auth.js';
import { config } from '../config/index.js';
import crypto from 'crypto';

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Register new user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    // Create verification token
    const verificationToken = generateVerificationToken();

    // Create user
    const user = await User.create({
      email: data.email,
      password: data.password,
      profile: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
      verificationToken,
    });

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Set refresh token cookie
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    // TODO: Send verification email

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          role: user.role,
          isVerified: user.isVerified,
        },
        accessToken: tokens.accessToken,
      },
      message: 'Registration successful. Please verify your email.',
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user with password
    const user = await User.findOne({ email: data.email }).select('+password');

    if (!user || !user.password) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Check password
    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Set refresh token cookie
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          role: user.role,
          isVerified: user.isVerified,
          subscription: user.subscription,
          gamification: user.gamification,
        },
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (
  _req: Request,
  res: Response
): Promise<void> => {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

// Refresh token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;

    if (!token) {
      throw ApiError.unauthorized('Refresh token required');
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('User not found');
    }

    // Generate new tokens
    const tokens = generateTokenPair(user);

    // Set new refresh token cookie
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      throw ApiError.unauthorized('Not authenticated');
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          role: user.role,
          isVerified: user.isVerified,
          subscription: user.subscription,
          gamification: user.gamification,
          preferences: user.preferences,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = forgotPasswordSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });

    // Always return success to prevent email enumeration
    if (!user) {
      res.json({
        success: true,
        message: 'If an account exists, a password reset email has been sent.',
      });
      return;
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // TODO: Send reset email with resetToken

    res.json({
      success: true,
      message: 'If an account exists, a password reset email has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = resetPasswordSchema.parse(req.body);

    const hashedToken = crypto
      .createHash('sha256')
      .update(data.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired reset token');
    }

    // Update password
    user.password = data.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate new tokens
    const tokens = generateTokenPair(user);
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

// Change password (authenticated)
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = changePasswordSchema.parse(req.body);

    const user = await User.findById(req.userId).select('+password');

    if (!user || !user.password) {
      throw ApiError.notFound('User not found');
    }

    // Verify current password
    const isMatch = await user.comparePassword(data.currentPassword);
    if (!isMatch) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    // Update password
    user.password = data.newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Verify email
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      throw ApiError.badRequest('Invalid verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};
