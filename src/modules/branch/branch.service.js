const Branch = require('./branch.model');

const createBranch = async (branchData) => {
    return await Branch.create(branchData);
};

const getBranches = async (query = {}) => {
    return await Branch.find(query).sort({ createdAt: -1 });
};

const getBranchById = async (id) => {
    return await Branch.findById(id);
};

const updateBranch = async (id, updateData) => {
    return await Branch.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteBranch = async (id) => {
    return await Branch.findByIdAndDelete(id);
};

module.exports = {
    createBranch,
    getBranches,
    getBranchById,
    updateBranch,
    deleteBranch
};
