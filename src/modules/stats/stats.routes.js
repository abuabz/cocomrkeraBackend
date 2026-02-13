const express = require('express');
const StatsController = require('./stats.controller');
const router = express.Router();

router.get('/dashboard', StatsController.getDashboardStats);
router.get('/reports', StatsController.getReports);

module.exports = router;
