const jwt = require('jsonwebtoken');
const User = require('../modules/user/user.model');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized - No token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key-that-no-one-can-guess');
        
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        if (!currentUser.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        req.user = {
            id: currentUser._id,
            username: currentUser.username,
            role: currentUser.role,
            branchId: currentUser.branchId,
            permissions: currentUser.permissions
        };
        
        const { tenantMiddleware } = require('./tenant.middleware');
        tenantMiddleware(req, res, next);
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized - Token failed', error: error.message });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        next();
    };
};

const admin = restrictTo('admin');

module.exports = {
    protect,
    restrictTo,
    admin
};
