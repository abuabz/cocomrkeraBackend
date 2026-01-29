const db = require('../../config/db');

class EmployeeModel {
    static async create(employee) {
        const { name, code, contact, altContact, address, photo } = employee;
        const query = `
      INSERT INTO employees (name, code, contact, alt_contact, address, photo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
        const values = [name, code, contact, altContact, address, photo];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findAll() {
        const query = 'SELECT * FROM employees ORDER BY id DESC;';
        const { rows } = await db.query(query);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM employees WHERE id = $1;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async update(id, employee) {
        const { name, code, contact, altContact, address, photo } = employee;
        const query = `
      UPDATE employees
      SET name = $1, code = $2, contact = $3, alt_contact = $4, address = $5, photo = $6
      WHERE id = $7
      RETURNING *;
    `;
        const values = [name, code, contact, altContact, address, photo, id];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM employees WHERE id = $1 RETURNING *;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = EmployeeModel;
