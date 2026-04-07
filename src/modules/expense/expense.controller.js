const ExpenseService = require('./expense.service');
const ApiResponse = require('../../utils/apiResponse');

class ExpenseController {
    static async create(req, res, next) {
        try {
            const expense = await ExpenseService.createExpense(req.body);
            return ApiResponse.success(res, 'Expense record created', expense, 201);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const expenses = await ExpenseService.getAllExpenses(req.query);
            return ApiResponse.success(res, 'Expenses retrieved successfully', expenses);
        } catch (error) {
            next(error);
        }
    }

    static async getStats(req, res, next) {
        try {
            const stats = await ExpenseService.getExpenseStats();
            return ApiResponse.success(res, 'Expense stats retrieved successfully', stats);
        } catch (error) {
            next(error);
        }
    }

    static async getOne(req, res, next) {
        try {
            const record = await ExpenseService.getExpenseById(req.params.id);
            if (!record) {
                return ApiResponse.error(res, 'Record not found', null, 404);
            }
            return ApiResponse.success(res, 'Record retrieved', record);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const updated = await ExpenseService.updateExpense(req.params.id, req.body);
            if (!updated) {
                return ApiResponse.error(res, 'Record not found', null, 404);
            }
            return ApiResponse.success(res, 'Record updated', updated);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const deleted = await ExpenseService.deleteExpense(req.params.id);
            if (!deleted) {
                return ApiResponse.error(res, 'Record not found', null, 404);
            }
            return ApiResponse.success(res, 'Record deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ExpenseController;
