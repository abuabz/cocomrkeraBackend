const express = require('express');
const router = express.Router();
const branchController = require('./branch.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

// Protect and restrict to admin all branch routes
router.use(protect);
router.use(admin);

router.route('/')
    .get(branchController.getBranches)
    .post(branchController.createBranch);

router.route('/:id')
    .get(branchController.getBranchById)
    .patch(branchController.updateBranch)
    .delete(branchController.deleteBranch);

module.exports = router;
