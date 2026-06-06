const pool = require("../config/db");

const PurchaseOrder = {
    create: async (quotation_id, po_number) => {

        const result = await pool.query(
            `INSERT INTO purchase_orders
            (quotation_id,po_number)
            VALUES($1,$2)
            RETURNING *`,
            [quotation_id, po_number]
        );

        return result.rows[0];
    }
};

module.exports = PurchaseOrder;