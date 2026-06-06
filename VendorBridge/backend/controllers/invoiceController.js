const pool = require("../config/db");

const generateInvoice = async (req, res) => {
  try {

    const {
      po_id,
      subtotal,
      tax,
      total
    } = req.body;

    const invoiceNumber = `INV-${Date.now()}`;

    const result = await pool.query(
      `INSERT INTO invoices
      (po_id, invoice_number, subtotal, tax, total)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        po_id,
        invoiceNumber,
        subtotal,
        tax,
        total
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to generate invoice"
    });
  }
};

const getInvoices = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM invoices ORDER BY id DESC"
    );

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch invoices"
    });
  }
};

const sendInvoiceEmail = async (req, res) => {

  try {

    res.status(200).json({
      message: "Email functionality coming soon"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to send email"
    });
  }
};

const downloadInvoicePdf = async (req, res) => {

  try {

    res.status(200).json({
      message: "PDF functionality coming soon"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to generate PDF"
    });
  }
};

module.exports = {
  generateInvoice,
  getInvoices,
  sendInvoiceEmail,
  downloadInvoicePdf
};