import { Router } from 'express';
import {
  getQuiz,
  getQuizByLesson,
  startQuiz,
  submitQuiz,
  getQuizResults,
  createQuiz,
  updateQuiz,
} from '../controllers/quizController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Student routes
router.get('/lesson/:lessonId', authenticate, getQuizByLesson);
router.get('/:quizId', authenticate, getQuiz);
router.post('/:quizId/start', authenticate, startQuiz);
router.post('/:quizId/submit', authenticate, submitQuiz);
router.get('/:quizId/results', authenticate, getQuizResults);

// Instructor routes
router.post('/', authenticate, authorize('instructor', 'admin', 'superadmin'), createQuiz);
router.patch('/:quizId', authenticate, authorize('instructor', 'admin', 'superadmin'), updateQuiz);

export default router;
