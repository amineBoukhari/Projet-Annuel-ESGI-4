const router = require('express').Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const subscriptionController = require('./subscription.controller');

router.post('/checkout', requireRole('Owner'), subscriptionController.createCheckoutSession);
router.post('/portal', requireRole('Owner'), subscriptionController.createPortalSession);
router.get('/status', subscriptionController.getSubscriptionStatus);

module.exports = router;
