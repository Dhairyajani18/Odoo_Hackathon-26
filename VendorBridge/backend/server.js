const express = require("express");
const cors = require("cors");
require("dotenv").config();

const vendorRoutes = require("./routes/vendorRoutes");
const rfqRoutes = require("./routes/rfqRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const poRoutes = require("./routes/poRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("VendorBridge Backend Running");
});

app.use("/api/vendors", vendorRoutes);
app.use("/api/rfqs", rfqRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/pos", poRoutes);
app.use("/api/invoices", invoiceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});