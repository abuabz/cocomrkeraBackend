const express = require('express');
const StatsController = require('./stats.controller');
const router = express.Router();
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

router.get('/dashboard', StatsController.getDashboardStats);
router.get('/counts', StatsController.getDashboardCounts);
router.get('/reports', StatsController.getReports);
router.get('/employee-reports', StatsController.getEmployeeReports);

module.exports = router;
