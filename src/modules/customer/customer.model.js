const db = require('../../config/db');

class CustomerModel {
    static async create(customer) {
        const { name, code, phone, altPhone, place, treeCount, lastHarvest, nextHarvest, mapUrl } = customer;
        const query = `
      INSERT INTO customers (name, code, phone, alt_phone, place, tree_count, last_harvest, next_harvest, map_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
        const values = [name, code, phone, altPhone, place, treeCount, lastHarvest, nextHarvest, mapUrl];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findAll() {
        const query = 'SELECT * FROM customers ORDER BY id DESC;';
        const { rows } = await db.query(query);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM customers WHERE id = $1;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async update(id, customer) {
        const { name, code, phone, altPhone, place, treeCount, lastHarvest, nextHarvest, mapUrl } = customer;
        const query = `
      UPDATE customers
      SET name = $1, code = $2, phone = $3, alt_phone = $4, place = $5, tree_count = $6, last_harvest = $7, next_harvest = $8, map_url = $9
      WHERE id = $10
      RETURNING *;
    `;
        const values = [name, code, phone, altPhone, place, treeCount, lastHarvest, nextHarvest, mapUrl, id];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM customers WHERE id = $1 RETURNING *;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = CustomerModel;
