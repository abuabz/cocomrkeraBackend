const OrderModel = require('./order.model');

class OrderService {
    static async createOrder(data) {
        return await OrderModel.create(data);
    }

    static async getAllOrders() {
        return await OrderModel.findAll();
    }

    static async getOrderById(id) {
        return await OrderModel.findById(id);
    }

    static async updateOrder(id, data) {
        return await OrderModel.update(id, data);
    }

    static async deleteOrder(id) {
        return await OrderModel.delete(id);
    }
}

module.exports = OrderService;
