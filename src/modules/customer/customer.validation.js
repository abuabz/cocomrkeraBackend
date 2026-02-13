const { body } = require('express-validator');

const validateCustomer = [
    body('name').notEmpty().withMessage('Name is required'),
    body('code').optional().trim(),
    body('phone')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone().withMessage('Invalid phone number'),
    body('place').notEmpty().withMessage('Place is required'),
    body('treeCount')
        .optional()
        .isInt({ min: 0 }).withMessage('Tree count must be a non-negative integer'),
    body('lastHarvest')
        .optional()
        .isISO8601().toDate().withMessage('Invalid date format (ISO8601)'),
    body('nextHarvest')
        .optional()
        .isISO8601().toDate().withMessage('Invalid date format (ISO8601)'),
    body('mapUrl')
        .optional(),
];

module.exports = {
    validateCustomer,
};
