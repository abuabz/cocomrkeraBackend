const SaleService = require('./sale.service');
const ApiResponse = require('../../utils/apiResponse');

class SaleController {
    static async create(req, res, next) {
        try {
            const sale = await SaleService.createSale(req.body);
            return ApiResponse.success(res, 'Sale created successfully', sale, 201);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const sales = await SaleService.getAllSales();
            return ApiResponse.success(res, 'Sales retrieved successfully', sales);
        } catch (error) {
            next(error);
        }
    }

    static async getOne(req, res, next) {
        try {
            const sale = await SaleService.getSaleById(req.params.id);
            if (!sale) {
                return ApiResponse.error(res, 'Sale not found', null, 404);
            }
            return ApiResponse.success(res, 'Sale retrieved successfully', sale);
        } catch (error) {
            next(error);
        }
    }

    static async getByCustomer(req, res, next) {
        try {
            const sales = await SaleService.getSalesByCustomerId(req.params.customerId);
            return ApiResponse.success(res, 'Customer sales retrieved successfully', sales);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const id = req.params.id;
            const existingSale = await SaleService.getSaleById(id);
            if (!existingSale) {
                return ApiResponse.error(res, 'Sale not found', null, 404);
            }

            const updatedSale = await SaleService.updateSale(id, req.body);
            return ApiResponse.success(res, 'Sale updated successfully', updatedSale);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = req.params.id;
            const existingSale = await SaleService.getSaleById(id);
            if (!existingSale) {
                return ApiResponse.error(res, 'Sale not found', null, 404);
            }

            await SaleService.deleteSale(id);
            return ApiResponse.success(res, 'Sale deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SaleController;
