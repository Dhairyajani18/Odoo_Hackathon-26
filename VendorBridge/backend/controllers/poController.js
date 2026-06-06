const pool = require("../config/db");

const generatePO = async (req, res) => {
  try {

    const { quotation_id } = req.body;

    const poNumber = `PO-${Date.now()}`;

    const result = await pool.query(
      `INSERT INTO purchase_orders
       (quotation_id, po_number)
       VALUES ($1,$2)
       RETURNING *`,
      [quotation_id, poNumber]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to generate purchase order",
    });
  }
};

const getPOs = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM purchase_orders ORDER BY id DESC"
    );

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch purchase orders",
    });
  }
};

const updatePOStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE purchase_orders
       SET status=$1
       WHERE id=$2
       RETURNING *`,
      [status, id]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update PO status",
    });
  }
};

const deletePO = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM purchase_orders WHERE id=$1",
      [id]
    );

    res.status(200).json({
      message: "PO deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to delete PO",
    });
  }
};

module.exports = {
  generatePO,
  getPOs,
  updatePOStatus,
  deletePO,
};