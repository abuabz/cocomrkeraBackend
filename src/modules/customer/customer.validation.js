const { body } = require('express-validator');

const validateCustomer = [
    body('name').notEmpty().withMessage('Name is required'),
    body('code').notEmpty().withMessage('Code is required'),
    body('phone')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone().withMessage('Invalid phone number'),
    body('place').notEmpty().withMessage('Place is required'),
    body('treeCount')
        .notEmpty().withMessage('Tree count is required')
        .isInt({ min: 1 }).withMessage('Tree count must be a positive integer'),
    body('lastHarvest')
        .notEmpty().withMessage('Last harvest date is required')
        .isISO8601().toDate().withMessage('Invalid date format (ISO8601)'),
    body('nextHarvest')
        .notEmpty().withMessage('Next harvest date is required')
        .isISO8601().toDate().withMessage('Invalid date format (ISO8601)'),
    body('mapUrl')
        .notEmpty().withMessage('Map URL is required'),
];

module.exports = {
    validateCustomer,
};
