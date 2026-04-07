const express = require('express');
const router = express.Router();
const FollowupController = require('./followup.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

router.post('/', FollowupController.create);
router.get('/', FollowupController.getAll);
router.get('/:id', FollowupController.getOne);
router.put('/:id', FollowupController.update);
router.delete('/:id', FollowupController.delete);

module.exports = router;
