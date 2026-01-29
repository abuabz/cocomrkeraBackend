const db = require('../../config/db');

class OrderModel {
    static async create(order) {
        const { name, phoneNumber, place, treeCount, date } = order;
        const query = `
      INSERT INTO orders (name, phone_number, place, tree_count, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [name, phoneNumber, place, treeCount, date];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findAll() {
        const query = 'SELECT * FROM orders ORDER BY date DESC;';
        const { rows } = await db.query(query);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM orders WHERE id = $1;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async update(id, order) {
        const { name, phoneNumber, place, treeCount, date } = order;
        const query = `
      UPDATE orders
      SET name = $1, phone_number = $2, place = $3, tree_count = $4, date = $5
      WHERE id = $6
      RETURNING *;
    `;
        const values = [name, phoneNumber, place, treeCount, date, id];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM orders WHERE id = $1 RETURNING *;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = OrderModel;
