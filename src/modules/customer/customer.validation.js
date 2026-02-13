const { body } = require('express-validator');

const validateCustomer = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('code').optional().trim(),
    body('phone')
        .optional()
        .notEmpty().withMessage('Phone number cannot be empty')
        .isMobilePhone().withMessage('Invalid phone number'),
    body('place').optional().notEmpty().withMessage('Place cannot be empty'),
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
