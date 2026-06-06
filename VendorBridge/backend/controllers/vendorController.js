// vendorController.js
const pool = require("../config/db");

const addVendor = async (req, res) => {
  try {
    const {
      company_name,
      contact_person,
      email,
      phone,
      gst_number,
      address,
      category,
      status,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO vendors
      (company_name, contact_person, email, phone, gst_number, address, category, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        company_name,
        contact_person,
        email,
        phone,
        gst_number,
        address,
        category,
        status || "active",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add vendor",
    });
  }
};

const getVendors = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM vendors ORDER BY id DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch vendors",
    });
  }
};

const getVendorById = async (req, res) => {
  try {
    // Fixed SQL Syntax: WHERE must come before ORDER BY
    const result = await pool.query(
      "SELECT * FROM vendors WHERE id = $1 ORDER BY id DESC", 
      [req.params.id]
    );

    // It's good practice to return just the single object, not an array, for a "by ID" query
    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(result.rows[0]); 
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch vendor",
    });
  }
};

const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company_name,
      contact_person,
      email,
      phone,
      gst_number,
      address,
      category,
      status,
    } = req.body;

    const result = await pool.query(
      `UPDATE vendors
       SET company_name=$1,
           contact_person=$2,
           email=$3,
           phone=$4,
           gst_number=$5,
           address=$6,
           category=$7,
           status=$8
       WHERE id=$9
       RETURNING *`,
      [
        company_name,
        contact_person,
        email,
        phone,
        gst_number,
        address,
        category,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update vendor",
    });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM vendors WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete vendor",
    });
  }
};




module.exports = {
  addVendor,
  getVendors,
  getVendorById, // Added missing export!
  updateVendor,
  deleteVendor,
};