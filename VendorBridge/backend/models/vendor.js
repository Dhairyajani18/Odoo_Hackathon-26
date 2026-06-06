const pool = require("../config/db");

const Vendor = {
    create: async (vendor) => {
        const {
            company_name,
            contact_person,
            email,
            phone,
            gst_number,
            address,
            category
        } = vendor;

        const result = await pool.query(
            `INSERT INTO vendors
            (company_name,contact_person,email,phone,gst_number,address,category)
            VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,
            [
                company_name,
                contact_person,
                email,
                phone,
                gst_number,
                address,
                category
            ]
        );

        return result.rows[0];
    },

    getAll: async () => {
        const result = await pool.query(
            `SELECT * FROM vendors ORDER BY id DESC`
        );

        return result.rows;
    },

    getById: async (id) => {
        const result = await pool.query(
            `SELECT * FROM vendors WHERE id = $1`,
            [id]
        );

        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query(
            `DELETE FROM vendors WHERE id = $1`,
            [id]
        );
    }
};

module.exports = Vendor;