const express = require('express');
const router = express.Router();
const EmployeeController = require('./employee.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

router.post('/', EmployeeController.create);
router.get('/', EmployeeController.getAll);
router.get('/:id', EmployeeController.getOne);
router.put('/:id', EmployeeController.update);
router.delete('/:id', EmployeeController.delete);

module.exports = router;
