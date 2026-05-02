const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// IMPORT ROUTES
const medicineRoutes = require("./routes/medicineRoutes");
app.use("/medicines", medicineRoutes);

const supplierRoutes = require("./routes/supplierRoutes");
app.use("/suppliers", supplierRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/orders", orderRoutes);

// USE ROUTES
app.use("/medicines", medicineRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/orders", orderRoutes);

// ROOT
app.get("/", (req, res) => {
    res.send("Pharmacy Backend Running");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});