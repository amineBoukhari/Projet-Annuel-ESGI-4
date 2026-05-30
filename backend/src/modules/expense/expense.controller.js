const Expense = require('./expense.model');

async function createExpense(req, res) {
  try {
    const { category, description, amount, expenseDate } = req.body;
    const userId = req.user.id;
    const restaurantId = req.user.restaurantId;

    if (!description || !amount) {
      return res.status(400).json({ error: 'Description and amount are required' });
    }

    const expense = await Expense.create({
      restaurantId,
      category: category || 'other',
      description,
      amount: parseFloat(amount).toFixed(2),
      expenseDate: expenseDate || new Date(),
      createdBy: userId,
    });

    return res.status(201).json({
      message: 'Expense created successfully',
      expense,
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    return res.status(500).json({ error: 'Failed to create expense' });
  }
}

async function getAllExpenses(req, res) {
  try {
    const where = {};

    if (req.user.role?.name !== 'Admin') {
      where.restaurantId = req.user.restaurantId || null;
    }

    const expenses = await Expense.findAll({
      where,
      order: [['expenseDate', 'DESC']],
    });

    return res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return res.status(500).json({ error: 'Failed to fetch expenses' });
  }
}

async function deleteExpense(req, res) {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await expense.destroy();
    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return res.status(500).json({ error: 'Failed to delete expense' });
  }
}

module.exports = {
  createExpense,
  getAllExpenses,
  deleteExpense,
};
