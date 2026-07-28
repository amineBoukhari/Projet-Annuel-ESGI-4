const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get this month's key stats vs last month (invoices, revenue, users, expenses)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Current-month stats with trend vs previous month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invoiceCount: { type: integer }
 *                 invoiceTrend:
 *                   type: object
 *                   properties:
 *                     value: { type: string, nullable: true, example: "+12%" }
 *                     positive: { type: boolean }
 *                 revenue: { type: number }
 *                 revenueTrend:
 *                   type: object
 *                   properties:
 *                     value: { type: string, nullable: true }
 *                     positive: { type: boolean }
 *                 userCount: { type: integer }
 *                 expenseCount: { type: integer }
 *                 expenseTrend:
 *                   type: object
 *                   properties:
 *                     value: { type: string, nullable: true }
 *                     positive: { type: boolean }
 *       500:
 *         description: Failed to fetch dashboard stats
 */
router.get('/stats', dashboardController.getStats);

/**
 * @swagger
 * /dashboard/recent-activity:
 *   get:
 *     summary: Get the 10 most recent invoices and expenses combined, newest first
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Merged, sorted list of recent invoice/expense activity
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer }
 *                   type: { type: string, enum: [invoice, expense] }
 *                   title: { type: string }
 *                   description: { type: string }
 *                   status: { type: string, nullable: true }
 *                   createdAt: { type: string, format: date-time }
 *       500:
 *         description: Failed to fetch recent activity
 */
router.get('/recent-activity', dashboardController.getRecentActivity);

/**
 * @swagger
 * /dashboard/revenue:
 *   get:
 *     summary: Get paid-invoice revenue grouped by time period
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *         description: Falls back to "month" if omitted or invalid
 *     responses:
 *       200:
 *         description: Revenue and invoice count per period bucket
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date: { type: string, format: date-time }
 *                   revenue: { type: number }
 *                   count: { type: integer }
 *       500:
 *         description: Failed to fetch revenue data
 */
router.get('/revenue', dashboardController.getRevenue);

module.exports = router;
