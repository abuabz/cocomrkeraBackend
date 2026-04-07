const express = require('express');
const router = express.Router();
const salaryController = require('./salary.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

router.use(protect);
router.use(restrictTo('admin')); // Salary restricted to admin

router.post('/', salaryController.createSalary);
router.get('/', salaryController.getSalaries);
router.get('/:id', salaryController.getSalary);
router.put('/:id', salaryController.updateSalary);
router.delete('/:id', salaryController.deleteSalary);

module.exports = router;
