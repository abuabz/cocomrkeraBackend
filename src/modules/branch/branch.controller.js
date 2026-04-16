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

const deleteBranch = async (req, res, next) => {
    try {
        const branch = await branchService.deleteBranch(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
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
