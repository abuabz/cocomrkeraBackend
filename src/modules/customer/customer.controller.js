const CustomerService = require('./customer.service');
const ApiResponse = require('../../utils/apiResponse');
const { validationResult } = require('express-validator');

class CustomerController {
    static async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return ApiResponse.error(res, 'Validation Error', errors.array(), 400);
            }

            const customer = await CustomerService.createCustomer(req.body);
            return ApiResponse.success(res, 'Customer created successfully', customer, 201);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const customers = await CustomerService.getAllCustomers();
            return ApiResponse.success(res, 'Customers retrieved successfully', customers);
        } catch (error) {
            next(error);
        }
    }

    static async getOne(req, res, next) {
        try {
            const customer = await CustomerService.getCustomerById(req.params.id);
            if (!customer) {
                return ApiResponse.error(res, 'Customer not found', null, 404);
            }
            return ApiResponse.success(res, 'Customer retrieved successfully', customer);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return ApiResponse.error(res, 'Validation Error', errors.array(), 400);
            }

            const id = req.params.id;
            const existingCustomer = await CustomerService.getCustomerById(id);
            if (!existingCustomer) {
                return ApiResponse.error(res, 'Customer not found', null, 404);
            }

            const updatedCustomer = await CustomerService.updateCustomer(id, req.body);
            return ApiResponse.success(res, 'Customer updated successfully', updatedCustomer);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = req.params.id;
            const existingCustomer = await CustomerService.getCustomerById(id);
            if (!existingCustomer) {
                return ApiResponse.error(res, 'Customer not found', null, 404);
            }

            await CustomerService.deleteCustomer(id);
            return ApiResponse.success(res, 'Customer deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CustomerController;
