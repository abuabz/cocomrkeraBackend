const OrderService = require('./order.service');
const ApiResponse = require('../../utils/apiResponse');

class OrderController {
    static async create(req, res, next) {
        try {
            const order = await OrderService.createOrder(req.body);
            return ApiResponse.success(res, 'Order created successfully', order, 201);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const orders = await OrderService.getAllOrders();
            return ApiResponse.success(res, 'Orders retrieved successfully', orders);
        } catch (error) {
            next(error);
        }
    }

    static async getOne(req, res, next) {
        try {
            const order = await OrderService.getOrderById(req.params.id);
            if (!order) {
                return ApiResponse.error(res, 'Order not found', null, 404);
            }
            return ApiResponse.success(res, 'Order retrieved successfully', order);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const id = req.params.id;
            const existingOrder = await OrderService.getOrderById(id);
            if (!existingOrder) {
                return ApiResponse.error(res, 'Order not found', null, 404);
            }

            const updatedOrder = await OrderService.updateOrder(id, req.body);
            return ApiResponse.success(res, 'Order updated successfully', updatedOrder);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = req.params.id;
            const existingOrder = await OrderService.getOrderById(id);
            if (!existingOrder) {
                return ApiResponse.error(res, 'Order not found', null, 404);
            }

            await OrderService.deleteOrder(id);
            return ApiResponse.success(res, 'Order deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = OrderController;
