const User = require('./user.model');
const Branch = require('../branch/branch.model');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        
        // Map users to include branch name
        const usersWithBranchNames = await Promise.all(users.map(async (user) => {
            const userData = user.toObject();
            let branchName = userData.branchId;
            if (userData.branchId === 'all') {
                branchName = 'All Branches';
            } else {
                const branch = await Branch.findOne({ branchId: userData.branchId });
                if (branch) branchName = branch.name;
            }
            return { ...userData, branchName };
        }));

        res.status(200).json({ status: 'success', data: usersWithBranchNames });
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        // Explicitly check for password length manually to provide cleaner msg if needed
        // but let's rely on Mongoose first and catch it below
        const user = await User.create(req.body);
        res.status(201).json({ status: 'success', data: user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username already exists. Please choose another.' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Apply updates
        Object.keys(req.body).forEach(key => {
            user[key] = req.body[key];
        });

        await user.save(); // Use save to trigger password hashing if modified
        
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ status: 'success', message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};
