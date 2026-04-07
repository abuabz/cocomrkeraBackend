const express = require('express');
const userController = require('./user.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const router = express.Router();

router.use(protect);
router.use(restrictTo('admin')); // Only admins can manage users

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
