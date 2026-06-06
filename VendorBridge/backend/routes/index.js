const express = require('express');
const router = express.Router();

// Import all controllers
const userController = require('../controllers/userController');
const vendorController = require('../controllers/vendorController');
const rfqController = require('../controllers/rfqController');
const quotationController = require('../controllers/quotationController');
const poController = require('../controllers/poController');
const invoiceController = require('../controllers/invoiceController');

// User Routes
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);

// Vendor Routes
// router.js (or index.js)
router.post('/vendors', vendorController.addVendor);
router.get('/vendors', vendorController.getVendors);
router.get('/vendors/:id', vendorController.getVendorById); // Fixed name
router.put('/vendors/:id', vendorController.updateVendor);  // Added update route
router.delete('/vendors/:id', vendorController.deleteVendor);

// RFQ Routes
router.post('/rfqs', rfqController.createRFQ);
router.get('/rfqs', rfqController.getAllRfqs);
// Quotation Routes
router.post('/quotations', quotationController.createQuotation);
router.get('/quotations/rfq/:rfqId', quotationController.getQuotationsByRFQ);

// Purchase Order Routes
router.post('/purchase-orders', poController.createPO);

// Invoice Routes
router.post('/invoices', invoiceController.createInvoice);

module.exports = router;