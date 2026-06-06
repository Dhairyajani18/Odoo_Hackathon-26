const pool = require("../config/db");

const submitQuotation = async (req, res) => {
  try {
    const {
      rfq_id,
      vendor_id,
      price,
      delivery_days,
      remarks,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO quotations
      (rfq_id, vendor_id, price, delivery_days, remarks)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        rfq_id,
        vendor_id,
        price,
        delivery_days,
        remarks,
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to submit quotation",
    });
  }
};

const getQuotations = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT *
       FROM quotations
       ORDER BY id DESC`
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch quotations",
    });
  }
};

const updateQuotation = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      price,
      delivery_days,
      remarks,
      status,
    } = req.body;

    const result = await pool.query(
      `UPDATE quotations
       SET price=$1,
           delivery_days=$2,
           remarks=$3,
           status=$4
       WHERE id=$5
       RETURNING *`,
      [
        price,
        delivery_days,
        remarks,
        status,
        id,
      ]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update quotation",
    });
  }
};

const deleteQuotation = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM quotations WHERE id=$1",
      [id]
    );

    res.status(200).json({
      message: "Quotation deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to delete quotation",
    });
  }
};

const compareQuotations = async (req, res) => {
  try {

    const { rfq_id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM quotations
       WHERE rfq_id = $1
       ORDER BY price ASC`,
      [rfq_id]
    );

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to compare quotations",
    });
  }
};

module.exports = {
  submitQuotation,
  getQuotations,
  updateQuotation,
  deleteQuotation,
  compareQuotations,
};