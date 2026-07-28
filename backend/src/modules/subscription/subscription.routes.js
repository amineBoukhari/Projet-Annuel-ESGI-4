const router = require('express').Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const subscriptionController = require('./subscription.controller');

/**
 * @swagger
 * /subscription/checkout:
 *   post:
 *     summary: Create a Stripe Checkout session for a subscription plan (Owner role only)
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [planId]
 *             properties:
 *               planId:
 *                 type: string
 *                 description: Stripe Price ID
 *     responses:
 *       200:
 *         description: Checkout session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url: { type: string, description: Stripe-hosted checkout URL to redirect to }
 *       403:
 *         description: Restaurant not found, or caller isn't Owner
 *       500:
 *         description: Stripe error
 */
router.post('/checkout', requireRole('Owner'), subscriptionController.createCheckoutSession);

/**
 * @swagger
 * /subscription/portal:
 *   post:
 *     summary: Create a Stripe billing portal session for the current restaurant (Owner role only)
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: Billing portal session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url: { type: string, description: Stripe-hosted billing portal URL to redirect to }
 *       400:
 *         description: No restaurant associated with this account, or no active subscription
 *       403:
 *         description: Caller isn't Owner
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Stripe error
 */
router.post('/portal', requireRole('Owner'), subscriptionController.createPortalSession);

/**
 * @swagger
 * /subscription/status:
 *   get:
 *     summary: Get the current restaurant's subscription status
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: Subscription status fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscriptionStatus: { type: string, nullable: true }
 *                 subscriptionPlan: { type: string, nullable: true }
 *                 trialEndsAt: { type: string, format: date-time, nullable: true }
 *                 currentPeriodEnd: { type: string, format: date-time, nullable: true }
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Server error
 */
router.get('/status', subscriptionController.getSubscriptionStatus);

module.exports = router;
