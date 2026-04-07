const SavingsService = require('./savings.service');
const ApiResponse = require('../../utils/apiResponse');

class SavingsController {
    static async create(req, res, next) {
        try {
            const savings = await SavingsService.createSavings(req.body);
            return ApiResponse.success(res, 'Savings record created successfully', savings, 201);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const savings = await SavingsService.getAllSavings(req.query);
            return ApiResponse.success(res, 'Savings retrieved successfully', savings);
        } catch (error) {
            next(error);
        }
    }

    static async getStats(req, res, next) {
        try {
            const stats = await SavingsService.getSavingsStats();
            return ApiResponse.success(res, 'Savings stats retrieved successfully', stats);
        } catch (error) {
            next(error);
        }
    }

    static async getOne(req, res, next) {
        try {
            const savings = await SavingsService.getSavingsById(req.params.id);
            if (!savings) {
                return ApiResponse.error(res, 'Record not found', null, 404);
            }
            return ApiResponse.success(res, 'Record retrieved successfully', savings);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const updated = await SavingsService.updateSavings(req.params.id, req.body);
            if (!updated) {
                return ApiResponse.error(res, 'Record not found', null, 404);
            }
            return ApiResponse.success(res, 'Record updated successfully', updated);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const deleted = await SavingsService.deleteSavings(req.params.id);
            if (!deleted) {
                return ApiResponse.error(res, 'Record not found', null, 404);
            }
            return ApiResponse.success(res, 'Record deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SavingsController;
