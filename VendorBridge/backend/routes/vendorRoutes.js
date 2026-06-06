const express = require("express");

const {
  addVendor,
  getVendors,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendorController");

const router = express.Router();

router.post("/", addVendor);

router.get("/", getVendors);

router.put("/:id", updateVendor);

router.delete("/:id", deleteVendor);

module.exports = router;