import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt.js';
import { User, IUser } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      userId?: string;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header or cookie
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw ApiError.unauthorized('Access token required');
    }

    // Verify token
    let decoded: JwtPayload;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      throw ApiError.unauthorized('Invalid or expired token');
    }

    // Get user from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication - doesn't throw if no token
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.userId);
        if (user && user.isActive) {
          req.user = user;
          req.userId = user._id.toString();
        }
      } catch {
        // Token invalid, continue without user
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden('You do not have permission to perform this action')
      );
    }

    next();
  };
};

// Check if user owns the resource or is admin
export const authorizeOwnerOrAdmin = (
  getOwnerId: (req: Request) => string | undefined
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const ownerId = getOwnerId(req);
    const isOwner = ownerId === req.userId;
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return next(ApiError.forbidden('Access denied'));
    }

    next();
  };
};

// Premium subscription plans that have access to AI features
const PREMIUM_PLANS = ['basic', 'premium', 'enterprise'];

// Check if user has an active premium subscription
export const requirePremium = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  const { subscription } = req.user;

  // Check if user has a premium plan
  if (!PREMIUM_PLANS.includes(subscription.plan)) {
    return next(
      ApiError.forbidden(
        'This feature requires a premium subscription. Please upgrade your plan to access AI-powered content generation.'
      )
    );
  }

  // Check if subscription is active
  if (subscription.status !== 'active' && subscription.status !== 'trialing') {
    return next(
      ApiError.forbidden(
        'Your subscription is not active. Please renew your subscription to access premium features.'
      )
    );
  }

  // Check if subscription period is valid
  if (subscription.currentPeriodEnd && new Date(subscription.currentPeriodEnd) < new Date()) {
    return next(
      ApiError.forbidden(
        'Your subscription has expired. Please renew to continue using premium features.'
      )
    );
  }

  next();
};

// Check if user is instructor or admin (for content creation)
export const requireInstructor = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  const allowedRoles = ['instructor', 'admin', 'superadmin'];

  if (!allowedRoles.includes(req.user.role)) {
    return next(
      ApiError.forbidden('Only instructors can create and manage course content.')
    );
  }

  next();
};
