const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const wasteController = require('./waste.controller');

router.post(
  '/add',
  requireRole('Admin', 'Owner', 'Manager'),
  wasteController.addWaste,
);

module.exports = router;
