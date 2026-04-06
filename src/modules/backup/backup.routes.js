const express = require('express');
const backupController = require('./backup.controller');
const router = express.Router();

router.get('/export', backupController.exportData);
router.post('/import', backupController.importData);

module.exports = router;
