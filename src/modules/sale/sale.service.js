const Sale = require('./sale.model');
const CustomerService = require('../customer/customer.service');
const Customer = require('../customer/customer.model');

class SaleService {
    static async createSale(data) {
        const sale = new Sale(data);
        const savedSale = await sale.save();

        // Update customer's harvest dates
        if (data.customerId && data.saleDate) {
            await CustomerService.updateCustomer(data.customerId, {
                lastHarvest: data.saleDate
            });
        }

        return savedSale;
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
        const updatedSale = await Sale.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        
        // If saleDate or customerId updated, refresh the customer's harvest date
        if (updatedSale && (data.saleDate || data.customerId)) {
            await CustomerService.updateCustomer(updatedSale.customerId, {
                lastHarvest: updatedSale.saleDate
            });
        }
        
        return updatedSale;
    }

    static async deleteSale(id) {
        return await Sale.findByIdAndDelete(id);
    }
}

module.exports = SaleService;
