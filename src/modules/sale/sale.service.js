const Sale = require('./sale.model');

class SaleService {
    static async createSale(data) {
        const sale = new Sale(data);
        return await sale.save();
    }

    static async getAllSales() {
        return await Sale.find().populate('customerId').populate('employees').sort({ saleDate: -1 });
    }

    static async getSaleById(id) {
        return await Sale.findById(id).populate('customerId').populate('employees');
    }

    static async getSalesByCustomerId(customerId) {
        return await Sale.find({ customerId }).populate('employees').sort({ saleDate: -1 });
    }

    static async updateSale(id, data) {
        return await Sale.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    static async deleteSale(id) {
        return await Sale.findByIdAndDelete(id);
    }
}

module.exports = SaleService;
