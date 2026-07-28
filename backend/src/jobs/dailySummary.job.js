const cron = require('node-cron');
const { Op } = require('sequelize');
const Restaurant = require('../modules/restaurant/restaurant.model');
const { getDailyStats, generateSummaryText } = require('../modules/dailySummary/dailySummary.service');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

async function runDailySummary() {
  const restaurants = await Restaurant.findAll({
    where: {
      whatsappNumber: { [Op.ne]: null },
      subscriptionStatus: ['active', 'trialing'],
    },
  });

  for (const restaurant of restaurants) {
    try {
      const stats = await getDailyStats(restaurant.id);
      const text = await generateSummaryText(stats, restaurant.name);
      await sendWhatsAppMessage(restaurant.whatsappNumber, text);
    } catch (error) {
      console.error(`Daily summary failed for restaurant ${restaurant.id}:`, error.message);
    }
  }
}

function scheduleDailySummaryJob() {
  cron.schedule(process.env.DAILY_SUMMARY_CRON || '0 21 * * *', runDailySummary);
}

module.exports = { scheduleDailySummaryJob, runDailySummary };
