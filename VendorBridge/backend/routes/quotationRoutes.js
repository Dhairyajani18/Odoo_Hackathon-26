const express = require("express");

const {
  submitQuotation,
  getQuotations,
  updateQuotation,
  deleteQuotation,
  compareQuotations,
} = require("../controllers/quotationController");

const router = express.Router();

router.post("/", submitQuotation);

router.get("/", getQuotations);

router.get("/compare/:rfq_id", compareQuotations);

router.put("/:id", updateQuotation);

router.delete("/:id", deleteQuotation);

module.exports = router;    