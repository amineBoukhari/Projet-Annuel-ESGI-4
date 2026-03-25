const router = require('express').Router();
const reportsController = require('./reports.controller');
router.get('/revenue', reportsController.getRevenue);
router.get('/taxes', reportsController.getTaxes);
router.get('/late-payments', reportsController.getLatePayments);

module.exports = router;
