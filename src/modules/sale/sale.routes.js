const express = require('express');
const router = express.Router();
const SaleController = require('./sale.controller');

router.post('/', SaleController.create);
router.get('/', SaleController.getAll);
router.get('/:id', SaleController.getOne);
router.get('/customer/:customerId', SaleController.getByCustomer);
router.put('/:id', SaleController.update);
router.delete('/:id', SaleController.delete);

module.exports = router;
