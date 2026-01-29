const SaleModel = require('./sale.model');

class SaleService {
    static async createSale(data) {
        return await SaleModel.create(data);
    }

    static async getAllSales() {
        return await SaleModel.findAll();
    }

    static async getSaleById(id) {
        return await SaleModel.findById(id);
    }

    static async getSalesByCustomerId(customerId) {
        return await SaleModel.findByCustomerId(customerId);
    }

    static async updateSale(id, data) {
        return await SaleModel.update(id, data);
    }

    static async deleteSale(id) {
        return await SaleModel.delete(id);
    }
}

module.exports = SaleService;
