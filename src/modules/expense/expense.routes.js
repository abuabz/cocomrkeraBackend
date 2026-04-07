const express = require('express');
const router = express.Router();
const ExpenseController = require('./expense.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

router.post('/', ExpenseController.create);
router.get('/', ExpenseController.getAll);
router.get('/stats', ExpenseController.getStats);
router.get('/:id', ExpenseController.getOne);
router.patch('/:id', ExpenseController.update);
router.delete('/:id', ExpenseController.delete);

module.exports = router;
