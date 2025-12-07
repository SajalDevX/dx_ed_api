import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.post('/', authenticate, authorize('admin', 'superadmin'), createCategory);
router.patch('/:id', authenticate, authorize('admin', 'superadmin'), updateCategory);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), deleteCategory);

export default router;
