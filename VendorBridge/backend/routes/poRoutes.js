const express = require("express");

const {
  generatePO,
  getPOs,
  updatePOStatus,
  deletePO,
} = require("../controllers/poController");

const router = express.Router();

router.post("/", generatePO);

router.get("/", getPOs);

router.put("/:id", updatePOStatus);

router.delete("/:id", deletePO);

module.exports = router;