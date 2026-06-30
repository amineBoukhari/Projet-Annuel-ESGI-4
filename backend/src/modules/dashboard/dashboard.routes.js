const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');

router.get('/stats', dashboardController.getStats);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/revenue', dashboardController.getRevenue);

module.exports = router;
