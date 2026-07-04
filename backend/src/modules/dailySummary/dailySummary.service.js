const { Op } = require('sequelize');
const sequelize = require('../../db/index');
const Invoice = require('../invoice/invoice.model');

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

module.exports = { getDailyStats };
