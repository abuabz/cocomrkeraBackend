const branchService = require('./branch.service');

const createBranch = async (req, res, next) => {
    try {
        const branch = await branchService.createBranch(req.body);
        res.status(201).json(branch);
    } catch (error) {
        next(error);
    }
};

const getBranches = async (req, res, next) => {
    try {
        const branches = await branchService.getBranches(req.query);
        res.json(branches);
    } catch (error) {
        next(error);
    }
};

const getBranchById = async (req, res, next) => {
    try {
        const branch = await branchService.getBranchById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.json(branch);
    } catch (error) {
        next(error);
    }
};

const updateBranch = async (req, res, next) => {
    try {
        const branch = await branchService.updateBranch(req.params.id, req.body);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.json(branch);
    } catch (error) {
        next(error);
    }
};

const User = require('../user/user.model');
const Sale = require('../sale/sale.model');

const deleteBranch = async (req, res, next) => {
    try {
        const branch = await branchService.getBranchById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        // Check if any users are linked to this branch
        const userCount = await User.countDocuments({ branchId: branch.branchId });
        if (userCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete branch: ${userCount} user(s) are assigned to it. Please reassign or delete the users first.` 
            });
        }

        // Check if any sales are linked to this branch
        const saleCount = await Sale.countDocuments({ branchId: branch.branchId });
        if (saleCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete branch: ${saleCount} sale record(s) are associated with it. Deletion is restricted to maintain data integrity.` 
            });
        }

        await branchService.deleteBranch(req.params.id);
        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBranch,
    getBranches,
    getBranchById,
    updateBranch,
    deleteBranch
};
