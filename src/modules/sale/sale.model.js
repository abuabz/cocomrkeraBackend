const db = require('../../config/db');

class SaleModel {
    static async create(sale) {
        const { customerId, saleDate, totalTrees, perTreeAmount, totalAmount, paymentMode, employees, treesHarvested } = sale;
        const query = `
      INSERT INTO sales (customer_id, sale_date, total_trees, per_tree_amount, total_amount, payment_mode, employees, trees_harvested)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
        const values = [customerId, saleDate, totalTrees, perTreeAmount, totalAmount, paymentMode, employees, treesHarvested];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findAll() {
        const query = 'SELECT * FROM sales ORDER BY sale_date DESC;';
        const { rows } = await db.query(query);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM sales WHERE id = $1;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async findByCustomerId(customerId) {
        const query = 'SELECT * FROM sales WHERE customer_id = $1 ORDER BY sale_date DESC;';
        const { rows } = await db.query(query, [customerId]);
        return rows;
    }

    static async update(id, sale) {
        const { customerId, saleDate, totalTrees, perTreeAmount, totalAmount, paymentMode, employees, treesHarvested } = sale;
        const query = `
      UPDATE sales
      SET customer_id = $1, sale_date = $2, total_trees = $3, per_tree_amount = $4, total_amount = $5, payment_mode = $6, employees = $7, trees_harvested = $8
      WHERE id = $9
      RETURNING *;
    `;
        const values = [customerId, saleDate, totalTrees, perTreeAmount, totalAmount, paymentMode, employees, treesHarvested, id];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM sales WHERE id = $1 RETURNING *;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = SaleModel;
