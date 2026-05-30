const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const expenseController = require('./expense.controller');

router.post(
  '/create',
  requireRole('Admin', 'Owner', 'Manager'),
  expenseController.createExpense,
);

router.get(
  '/getAll',
  requireRole('Admin', 'Owner', 'Manager'),
  expenseController.getAllExpenses,
);

router.delete(
  '/delete/:id',
  requireRole('Admin', 'Owner', 'Manager'),
  expenseController.deleteExpense,
);

module.exports = router;
