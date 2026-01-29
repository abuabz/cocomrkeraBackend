const express = require('express');
const router = express.Router();
const OrderController = require('./order.controller');

router.post('/', OrderController.create);
router.get('/', OrderController.getAll);
router.get('/:id', OrderController.getOne);
router.put('/:id', OrderController.update);
router.delete('/:id', OrderController.delete);

module.exports = router;
