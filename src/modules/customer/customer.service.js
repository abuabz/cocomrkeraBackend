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
            const lastCustomer = await Customer.findOne().sort({ code: -1 });
            let nextNumber = 1;
            if (lastCustomer && lastCustomer.code) {
                const match = lastCustomer.code.match(/\d+/);
                if (match) {
                    nextNumber = parseInt(match[0]) + 1;
                }
            }
            data.code = `CUST-${String(nextNumber).padStart(3, '0')}`;
        }
        
        const nextHarvest = data.lastHarvest ? this.calculateNextHarvest(data.lastHarvest) : null;
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
        const updateData = { ...data };
        
        // Only recalculate nextHarvest if lastHarvest is provided in the update
        if (data.lastHarvest) {
            updateData.nextHarvest = this.calculateNextHarvest(data.lastHarvest);
        }

        return await Customer.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
    }

    static async deleteCustomer(id) {
        return await Customer.findByIdAndDelete(id);
    }
}

module.exports = CustomerService;
