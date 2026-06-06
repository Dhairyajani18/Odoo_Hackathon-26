const pool = require("../config/db");

const RFQ = {
    create: async (rfq) => {

        const {
            title,
            description,
            quantity,
            deadline,
            created_by
        } = rfq;

        const result = await pool.query(
            `INSERT INTO rfqs
            (title,description,quantity,deadline,created_by)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                title,
                description,
                quantity,
                deadline,
                created_by
            ]
        );

        return result.rows[0];
    },

    getAll: async () => {
        const result = await pool.query(
            `SELECT * FROM rfqs ORDER BY id DESC`
        );

        return result.rows;
    }
};

module.exports = RFQ;