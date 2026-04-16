const User = require('../user/user.model');
const Branch = require('../branch/branch.model');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        const user = await User.findOne({ username }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        const token = signToken(user._id);

        let branchName = user.branchId;
        if (user.branchId === 'all') {
            branchName = 'All Branches';
        } else {
            const branch = await Branch.findOne({ branchId: user.branchId });
            if (branch) branchName = branch.name;
        }

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                branch: branchName,
                permissions: user.permissions
            }
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        let branchName = user.branchId;
        if (user.branchId === 'all') {
            branchName = 'All Branches';
        } else {
            const branch = await Branch.findOne({ branchId: user.branchId });
            if (branch) branchName = branch.name;
        }

        res.status(200).json({
            status: 'success',
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                branch: branchName,
                permissions: user.permissions
            }
        });
    } catch (error) {
        next(error);
    }
};

// Simple register for initial admin creation
const register = async (req, res, next) => {
    try {
        const { username, password, role, branchId, permissions } = req.body;
        
        // This should probably be admin-only, but we need logic to create the very first admin
        // To be safe, we'll check if any user exists or restrict it later
        const existingUsers = await User.countDocuments();
        if (existingUsers > 0 && (!req.user || req.user.role !== 'admin')) {
             return res.status(403).json({ message: 'Only admins can register new users' });
        }

        const user = await User.create({
            username,
            password,
            role: role || 'basic',
            branchId: branchId || 'all',
            permissions: permissions || []
        });

        const token = signToken(user._id);

        let branchName = user.branchId;
        if (user.branchId === 'all') {
            branchName = 'All Branches';
        } else {
            const branch = await Branch.findOne({ branchId: user.branchId });
            if (branch) branchName = branch.name;
        }

        res.status(201).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                branch: branchName,
                permissions: user.permissions
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    getMe,
    register
};
