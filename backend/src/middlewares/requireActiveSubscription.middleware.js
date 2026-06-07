const Restaurant = require('../modules/restaurant/restaurant.model');

async function requireActiveSubscription(req, res, next) {
  const restaurantId = req.user?.restaurantId;

  if (!restaurantId) {
    return res.status(403).json({ error: 'No restaurant is found' });
  }

  const restaurant = await Restaurant.findByPk(restaurantId, {
    attributes: ['subscriptionStatus'],
  });

  if (restaurant.subscriptionStatus !== 'active' && restaurant.subscriptionStatus !== 'trialing') {
    return res.status(402).json({ error: 'Active subscription required' });
  }

  next();
}

module.exports = requireActiveSubscription;
