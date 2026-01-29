const db = require('../../config/db');

class FollowupModel {
    static async create(followup) {
        const { name, phoneNumber, place, treeCount, date } = followup;
        const query = `
      INSERT INTO followups (name, phone_number, place, tree_count, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [name, phoneNumber, place, treeCount, date];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findAll() {
        const query = 'SELECT * FROM followups ORDER BY date DESC;';
        const { rows } = await db.query(query);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM followups WHERE id = $1;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async update(id, followup) {
        const { name, phoneNumber, place, treeCount, date } = followup;
        const query = `
      UPDATE followups
      SET name = $1, phone_number = $2, place = $3, tree_count = $4, date = $5
      WHERE id = $6
      RETURNING *;
    `;
        const values = [name, phoneNumber, place, treeCount, date, id];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM followups WHERE id = $1 RETURNING *;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = FollowupModel;
