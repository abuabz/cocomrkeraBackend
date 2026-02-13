const Order = require('./order.model');

class OrderService {
    static async createOrder(data) {
        const order = new Order(data);
        return await order.save();
    }

    static async getAllOrders() {
        return await Order.find().sort({ date: -1 });
    }

    static async getOrderById(id) {
        return await Order.findById(id);
    }

    static async updateOrder(id, data) {
        return await Order.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    static async deleteOrder(id) {
        return await Order.findByIdAndDelete(id);
    }
}

module.exports = OrderService;
