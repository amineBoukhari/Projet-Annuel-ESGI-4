const { Op } = require('sequelize');
const sequelize = require('../../db/index');
const Invoice = require('../invoice/invoice.model');
const openai = require('../../config/openai');

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

async function getDailyStats(restaurantId) {
  const { start, end } = getTodayRange();

  const createdToday = {
    restaurantId,
    createdAt: { [Op.gte]: start, [Op.lt]: end },
    status: { [Op.ne]: 'cancelled' },
  };

  const paidToday = {
    restaurantId,
    paidAt: { [Op.gte]: start, [Op.lt]: end },
    status: 'paid',
  };

  const [invoiceCount, paidResult] = await Promise.all([
    Invoice.count({ where: createdToday }),
    Invoice.findAll({
      where: paidToday,
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total'],
      ],
      raw: true,
    }),
  ]);

  return {
    date: start,
    invoiceCount,
    paidCount: parseInt(paidResult[0]?.count, 10) || 0,
    revenue: parseFloat(paidResult[0]?.total) || 0,
  };
}

async function generateSummaryText(stats, restaurantName) {
  const prompt = `Restaurant : ${restaurantName}
  Date : ${stats.date.toLocaleDateString('fr-FR')}
  Factures créées aujourd'hui : ${stats.invoiceCount}
  Factures payées aujourd'hui : ${stats.paidCount}
  Chiffre d'affaires encaissé aujourd'hui : ${stats.revenue.toFixed(2)} €`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          "Tu rédiges un court message WhatsApp (2 à 4 phrases, ton professionnel) qui résume la journée d'un restaurant à son gérant, à partir des chiffres fournis.",
      },
      { role: 'user', content: prompt },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() || '';
}

module.exports = { getDailyStats, generateSummaryText };
