const Restaurant = require('../modules/restaurant/restaurant.model');

async function requireActiveSubscription(req, res, next) {
  const restaurantId = req.user?.restaurantId;

  if (!restaurantId) {
    return res.status(403).json({ error: 'No restaurant is found' });
  }

  try {
    const restaurant = await Restaurant.findByPk(restaurantId, {
      attributes: ['subscriptionStatus'],
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (restaurant.subscriptionStatus !== 'active' && restaurant.subscriptionStatus !== 'trialing') {
      return res.status(402).json({ error: 'Active subscription required' });
    }

    next();
  } catch (error) {
    console.error('requireActiveSubscription error:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = requireActiveSubscription;
