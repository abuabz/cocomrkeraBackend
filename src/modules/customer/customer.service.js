const Customer = require('./customer.model');

class CustomerService {
    static calculateNextHarvest(lastHarvest) {
        if (!lastHarvest) return null;
        const date = new Date(lastHarvest);
        date.setDate(date.getDate() + 45); // Adjusting to 45 days if needed, or keep 60
        return date;
    }

    static async createCustomer(data) {
        // Auto-generate code if not provided
        if (!data.code) {
            const count = await Customer.countDocuments();
            data.code = `CUST-${String(count + 1).padStart(3, '0')}`;
        }
        
        const nextHarvest = this.calculateNextHarvest(data.lastHarvest);
        const customer = new Customer({ ...data, nextHarvest });
        return await customer.save();
    }

    static async getAllCustomers() {
        return await Customer.find().sort({ createdAt: -1 });
    }

    static async getCustomerById(id) {
        return await Customer.findById(id);
    }

    static async updateCustomer(id, data) {
        const nextHarvest = this.calculateNextHarvest(data.lastHarvest);
        return await Customer.findByIdAndUpdate(
            id,
            { ...data, nextHarvest },
            { new: true, runValidators: true }
        );
    }

    static async deleteCustomer(id) {
        return await Customer.findByIdAndDelete(id);
    }
}

module.exports = CustomerService;
