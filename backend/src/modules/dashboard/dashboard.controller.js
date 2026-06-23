const { Op } = require('sequelize');
const sequelize = require('../../db/index');
const Invoice = require('../invoice/invoice.model');
const User = require('../user/user.model');
const Expense = require('../expense/expense.model');

function getRestaurantFilter(req) {
  if (req.user.role?.name !== 'Admin') {
    return { restaurantId: req.user.restaurantId || null };
  }
  return {};
}

function getDateRange(monthsOffset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + monthsOffset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1 + monthsOffset, 1);
  return { start, end };
}

async function getStats(req, res) {
  try {
    const restaurantFilter = getRestaurantFilter(req);
    const thisMonth = getDateRange(0);
    const lastMonth = getDateRange(-1);

    const thisMonthWhere = {
      createdAt: { [Op.gte]: thisMonth.start, [Op.lt]: thisMonth.end },
      status: { [Op.ne]: 'cancelled' },
      ...restaurantFilter,
    };
    const lastMonthWhere = {
      createdAt: { [Op.gte]: lastMonth.start, [Op.lt]: lastMonth.end },
      status: { [Op.ne]: 'cancelled' },
      ...restaurantFilter,
    };

    const paidThisMonthWhere = {
      paidAt: { [Op.gte]: thisMonth.start, [Op.lt]: thisMonth.end },
      status: 'paid',
      ...restaurantFilter,
    };
    const paidLastMonthWhere = {
      paidAt: { [Op.gte]: lastMonth.start, [Op.lt]: lastMonth.end },
      status: 'paid',
      ...restaurantFilter,
    };

    const [
      thisMonthInvoiceCount,
      lastMonthInvoiceCount,
      thisMonthRevenue,
      lastMonthRevenue,
      userCount,
      thisMonthExpenseCount,
      lastMonthExpenseCount,
    ] = await Promise.all([
      Invoice.count({ where: thisMonthWhere }),
      Invoice.count({ where: lastMonthWhere }),
      Invoice.findAll({ where: paidThisMonthWhere, attributes: [[sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']], raw: true }),
      Invoice.findAll({ where: paidLastMonthWhere, attributes: [[sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']], raw: true }),
      User.count({ where: restaurantFilter }),
      Expense.count({ where: { createdAt: { [Op.gte]: thisMonth.start, [Op.lt]: thisMonth.end }, ...restaurantFilter } }),
      Expense.count({ where: { createdAt: { [Op.gte]: lastMonth.start, [Op.lt]: lastMonth.end }, ...restaurantFilter } }),
    ]);

    const revenueThisMonth = parseFloat(thisMonthRevenue[0]?.total) || 0;
    const revenueLastMonth = parseFloat(lastMonthRevenue[0]?.total) || 0;

    function trend(current, previous) {
      if (previous === 0) return { value: current > 0 ? 'Nouveau' : null, positive: true };
      const pct = ((current - previous) / previous) * 100;
      return {
        value: `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`,
        positive: pct >= 0,
      };
    }

    return res.status(200).json({
      invoiceCount: thisMonthInvoiceCount,
      invoiceTrend: trend(thisMonthInvoiceCount, lastMonthInvoiceCount),
      revenue: revenueThisMonth,
      revenueTrend: trend(revenueThisMonth, revenueLastMonth),
      userCount,
      expenseCount: thisMonthExpenseCount,
      expenseTrend: trend(thisMonthExpenseCount, lastMonthExpenseCount),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}

async function getRecentActivity(req, res) {
  try {
    const restaurantFilter = getRestaurantFilter(req);

    const invoices = await Invoice.findAll({
      where: { ...restaurantFilter },
      order: [['createdAt', 'DESC']],
      limit: 5,
      raw: true,
    });

    const expenses = await Expense.findAll({
      where: { ...restaurantFilter },
      order: [['createdAt', 'DESC']],
      limit: 5,
      raw: true,
    });

    const activity = [
      ...invoices.map((inv) => ({
        id: inv.id,
        type: 'invoice',
        title: `Facture ${inv.invoiceNumber}`,
        description: `${inv.customerName} — ${parseFloat(inv.totalAmount).toFixed(2)} €`,
        status: inv.status,
        createdAt: inv.createdAt,
      })),
      ...expenses.map((exp) => ({
        id: exp.id,
        type: 'expense',
        title: `Dépense ${exp.category}`,
        description: exp.description,
        status: null,
        createdAt: exp.createdAt,
      })),
    ];

    activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    activity.splice(10);

    return res.status(200).json(activity);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
}

async function getRevenue(req, res) {
  try {
    const validPeriods = ['day', 'week', 'month', 'year'];
    const period = validPeriods.includes(req.query.period) ? req.query.period : 'month';
    const restaurantFilter = getRestaurantFilter(req);

    const whereClause = { status: 'paid' };
    if (restaurantFilter.restaurantId) {
      whereClause.restaurantId = restaurantFilter.restaurantId;
    }

    const dateCol = sequelize.literal(`DATE_TRUNC('${period}', "paidAt")`);

    const results = await Invoice.findAll({
      attributes: [
        [dateCol, 'date'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: whereClause,
      group: [dateCol],
      order: [[dateCol, 'ASC']],
      raw: true,
    });

    const formatted = results.map((r) => ({
      date: r.date,
      revenue: parseFloat(r.revenue) || 0,
      count: parseInt(r.count, 10) || 0,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
}

module.exports = {
  getStats,
  getRecentActivity,
  getRevenue,
};
