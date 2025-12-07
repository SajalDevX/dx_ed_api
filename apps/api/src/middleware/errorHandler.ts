import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    stack?: string;
  };
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err;

  // Log error
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    error = ApiError.validationError('Validation failed', details);
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.validationError('Validation failed', details);
  }

  // Handle Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue || {})[0];
    error = ApiError.conflict(`${field} already exists`);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  }

  // Build response
  const response: ErrorResponse = {
    success: false,
    error: {
      code: (error as ApiError).code || 'INTERNAL_ERROR',
      message: error.message || 'Internal server error',
    },
  };

  // Add details if present
  if ((error as ApiError).details) {
    response.error.details = (error as ApiError).details;
  }

  // Add stack trace in development
  if (config.nodeEnv === 'development') {
    response.error.stack = err.stack;
  }

  const statusCode = (error as ApiError).statusCode || 500;
  res.status(statusCode).json(response);
};

// 404 handler
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};
