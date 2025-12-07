import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { IUser } from '../models/User.js';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateAccessToken = (user: IUser): string => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwtSecret as jwt.Secret, {
    expiresIn: config.jwtExpiry as string,
  });
};

export const generateRefreshToken = (user: IUser): string => {
  const payload = {
    userId: user._id.toString(),
    type: 'refresh',
  };

  return jwt.sign(payload, config.jwtRefreshSecret as jwt.Secret, {
    expiresIn: config.jwtRefreshExpiry as string,
  });
};

export const generateTokenPair = (user: IUser): TokenPair => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): { userId: string; type: string } => {
  return jwt.verify(token, config.jwtRefreshSecret) as { userId: string; type: string };
};

export const generateVerificationToken = (): string => {
  return jwt.sign({ type: 'verification' }, config.jwtSecret, {
    expiresIn: '24h',
  });
};

export const generateResetToken = (): string => {
  return jwt.sign({ type: 'reset' }, config.jwtSecret, {
    expiresIn: '1h',
  });
};
