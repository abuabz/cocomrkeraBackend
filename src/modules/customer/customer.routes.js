const express = require('express');
const router = express.Router();
const CustomerController = require('./customer.controller');
const { validateCustomer } = require('./customer.validation');
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

router.post('/', validateCustomer, CustomerController.create);
router.get('/', CustomerController.getAll);
router.get('/:id', CustomerController.getOne);
router.put('/:id', validateCustomer, CustomerController.update);
router.delete('/:id', CustomerController.delete);

module.exports = router;
