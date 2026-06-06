const express = require("express");

const {
  generateInvoice,
  getInvoices,
  sendInvoiceEmail,
  downloadInvoicePdf,
} = require("../controllers/invoiceController");

const router = express.Router();

router.post("/", generateInvoice);

router.get("/", getInvoices);

router.get("/pdf/:id", downloadInvoicePdf);

router.post("/email/:id", sendInvoiceEmail);

module.exports = router;