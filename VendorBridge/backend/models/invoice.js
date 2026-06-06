const pool = require("../config/db");

const Invoice = {
    create: async (
        po_id,
        invoice_number,
        subtotal,
        tax,
        total
    ) => {

        const result = await pool.query(
            `INSERT INTO invoices
            (po_id,invoice_number,subtotal,tax,total)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                po_id,
                invoice_number,
                subtotal,
                tax,
                total
            ]
        );

        return result.rows[0];
    }
};

module.exports = Invoice;