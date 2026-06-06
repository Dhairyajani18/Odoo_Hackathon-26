const express = require("express");

const {
  createRFQ,
  getRFQs,
  updateRFQ,
  deleteRFQ,
} = require("../controllers/rfqController");

const router = express.Router();

router.post("/", createRFQ);

router.get("/", getRFQs);

router.put("/:id", updateRFQ);

router.delete("/:id", deleteRFQ);

module.exports = router;