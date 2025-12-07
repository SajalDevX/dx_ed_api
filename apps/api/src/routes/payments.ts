import { Router } from 'express';
import express from 'express';
import {
  createCheckoutSession,
  createSubscriptionCheckout,
  handleWebhook,
  getOrders,
  getSubscriptionStatus,
  cancelSubscription,
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Webhook route (needs raw body)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

// Protected routes
router.post('/checkout', authenticate, createCheckoutSession);
router.post('/subscription', authenticate, createSubscriptionCheckout);
router.get('/orders', authenticate, getOrders);
router.get('/subscription/status', authenticate, getSubscriptionStatus);
router.delete('/subscription', authenticate, cancelSubscription);

export default router;
