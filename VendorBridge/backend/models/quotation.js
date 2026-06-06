const pool = require("../config/db");

const Quotation = {
    create: async (quotation) => {

        const {
            rfq_id,
            vendor_id,
            price,
            delivery_days,
            remarks
        } = quotation;

        const result = await pool.query(
            `INSERT INTO quotations
            (rfq_id,vendor_id,price,delivery_days,remarks)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                rfq_id,
                vendor_id,
                price,
                delivery_days,
                remarks
            ]
        );

        return result.rows[0];
    },

    getByRFQ: async (rfq_id) => {

        const result = await pool.query(
            `SELECT * FROM quotations
             WHERE rfq_id = $1`,
            [rfq_id]
        );

        return result.rows;
    }
};

module.exports = Quotation;