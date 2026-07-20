const stripe = require('../../config/stripe');
const Restaurant = require('../restaurant/restaurant.model');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const createCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;
    const restaurantId = req.user?.restaurantId;

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    let stripeCustomerId = restaurant.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: restaurant.name,
        metadata: { restaurantId },
      });
      stripeCustomerId = customer.id;
      await restaurant.update({ stripeCustomerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: planId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/subscription`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('createCheckoutSession error:', error);
    return res.status(500).json({ error: error.message });
  }
};

const createPortalSession = async (req, res) => {
  try {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ error: 'No restaurant associated with this account' });
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    if (!restaurant.stripeCustomerId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: restaurant.stripeCustomerId,
      return_url: `${FRONTEND_URL}/subscription`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('createPortalSession error:', error);
    return res.status(500).json({ error: error.message });
  }
};

const getSubscriptionStatus = async (req, res) => {
  try {
    const restaurantId = req.user?.restaurantId;

    const restaurant = await Restaurant.findByPk(restaurantId, {
      attributes: ['subscriptionStatus', 'subscriptionPlan', 'trialEndsAt', 'currentPeriodEnd'],
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    return res.json(restaurant);
  } catch (error) {
    console.error('getSubscriptionStatus error:', error);
    return res.status(500).json({ error: error.message });
  }
};

async function syncSubscriptionFields(restaurant, subscription) {
  const price = subscription.items.data[0]?.price;
  await restaurant.update({
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionPlan: price?.nickname || price?.id || null,
    // Convertir les timestamps Stripe en objets Date ( stripe utilise des timestamps en secondes)
    trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
  });
}

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).json({ error: `Webhook error: ${error.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const restaurant = await Restaurant.findOne({ where: { stripeCustomerId: session.customer } });
        if (restaurant) {
          await syncSubscriptionFields(restaurant, subscription);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const restaurant = await Restaurant.findOne({ where: { stripeCustomerId: invoice.customer } });
        if (restaurant && invoice.lines?.data[0]?.period?.end) {
          await restaurant.update({
            currentPeriodEnd: new Date(invoice.lines.data[0].period.end * 1000),
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const restaurant = await Restaurant.findOne({ where: { stripeCustomerId: invoice.customer } });
        if (restaurant) {
          await restaurant.update({ subscriptionStatus: 'past_due' });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const restaurant = await Restaurant.findOne({ where: { stripeCustomerId: subscription.customer } });
        if (restaurant) {
          await restaurant.update({ subscriptionStatus: 'canceled' });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const restaurant = await Restaurant.findOne({ where: { stripeCustomerId: subscription.customer } });
        if (restaurant) {
          await syncSubscriptionFields(restaurant, subscription);
        }
        break;
      }

      default:
        break;
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createCheckoutSession, createPortalSession, getSubscriptionStatus, handleWebhook };
