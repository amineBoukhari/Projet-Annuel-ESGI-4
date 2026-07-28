const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const expenseController = require('./expense.controller');

/**
 * @swagger
 * /expenses/create:
 *   post:
 *     summary: Record an expense (Admin, Owner, or Manager)
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description, amount]
 *             properties:
 *               category: { type: string, default: other }
 *               description: { type: string }
 *               amount: { type: number }
 *               expenseDate: { type: string, format: date, description: Defaults to now }
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Description and amount are required
 *       500:
 *         description: Failed to create expense
 */
router.post(
  '/create',
  requireRole('Admin', 'Owner', 'Manager'),
  expenseController.createExpense,
);

/**
 * @swagger
 * /expenses/getAll:
 *   get:
 *     summary: List expenses (Admin, Owner, or Manager). Admins see all, others see only their restaurant.
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: Array of expenses, newest first
 *       500:
 *         description: Failed to fetch expenses
 */
router.get(
  '/getAll',
  requireRole('Admin', 'Owner', 'Manager'),
  expenseController.getAllExpenses,
);

/**
 * @swagger
 * /expenses/delete/{id}:
 *   delete:
 *     summary: Delete an expense (Admin, Owner, or Manager)
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Failed to delete expense
 */
router.delete(
  '/delete/:id',
  requireRole('Admin', 'Owner', 'Manager'),
  expenseController.deleteExpense,
);

module.exports = router;
