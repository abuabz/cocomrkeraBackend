const express = require('express');
const router = express.Router();
const SavingsController = require('./savings.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

router.post('/', SavingsController.create);
router.get('/', SavingsController.getAll);
router.get('/stats', SavingsController.getStats);
router.get('/:id', SavingsController.getOne);
router.patch('/:id', SavingsController.update);
router.delete('/:id', SavingsController.delete);

module.exports = router;
