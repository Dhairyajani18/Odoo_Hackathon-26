const pool = require("../config/db");

const createRFQ = async (req, res) => {
  try {
    const {
      title,
      description,
      quantity,
      deadline,
      created_by,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO rfqs
      (title, description, quantity, deadline, created_by)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        title,
        description,
        quantity,
        deadline,
        created_by,
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create RFQ",
    });
  }
};

const getRFQs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM rfqs ORDER BY id DESC"
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch RFQs",
    });
  }
};

const updateRFQ = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      quantity,
      deadline,
      status,
    } = req.body;

    const result = await pool.query(
      `UPDATE rfqs
       SET title=$1,
           description=$2,
           quantity=$3,
           deadline=$4,
           status=$5
       WHERE id=$6
       RETURNING *`,
      [
        title,
        description,
        quantity,
        deadline,
        status,
        id,
      ]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update RFQ",
    });
  }
};

const deleteRFQ = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM rfqs WHERE id = $1",
      [id]
    );

    res.status(200).json({
      message: "RFQ deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete RFQ",
    });
  }
};

module.exports = {
  createRFQ,
  getRFQs,
  updateRFQ,
  deleteRFQ,
};