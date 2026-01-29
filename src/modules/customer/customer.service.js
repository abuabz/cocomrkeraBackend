const CustomerModel = require('./customer.model');

class CustomerService {
    static calculateNextHarvest(lastHarvest) {
        if (!lastHarvest) return null;
        const date = new Date(lastHarvest);
        date.setDate(date.getDate() + 60);
        return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    }

    static async createCustomer(data) {
        const nextHarvest = this.calculateNextHarvest(data.lastHarvest);
        return await CustomerModel.create({ ...data, nextHarvest });
    }

    static async getAllCustomers() {
        return await CustomerModel.findAll();
    }

    static async getCustomerById(id) {
        return await CustomerModel.findById(id);
    }

    static async updateCustomer(id, data) {
        const nextHarvest = this.calculateNextHarvest(data.lastHarvest);
        return await CustomerModel.update(id, { ...data, nextHarvest });
    }

    static async deleteCustomer(id) {
        return await CustomerModel.delete(id);
    }
}

module.exports = CustomerService;
