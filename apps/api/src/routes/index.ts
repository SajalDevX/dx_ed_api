import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import courseRoutes from './courses.js';
import categoryRoutes from './categories.js';
import quizRoutes from './quizzes.js';
import paymentRoutes from './payments.js';
import aiRoutes from './ai.js';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/categories', categoryRoutes);
router.use('/quizzes', quizRoutes);
router.use('/payments', paymentRoutes);
router.use('/ai', aiRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
