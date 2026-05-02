const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all orders
router.get("/", (req, res) => {
    db.query("SELECT * FROM Orders", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error fetching orders");
        }
        res.json(result);
    });
});

// ADD order
router.post("/add", (req, res) => {
    console.log("BODY:", req.body);
    const { customer_id } = req.body;

    db.query(
        "INSERT INTO Orders (customer_id) VALUES (?)",
        [customer_id],
        (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err.sqlMessage);
            }
            res.send("Order added");
        }
    );
});

// Mark order as done
router.put("/complete/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM Order_Items WHERE order_id = ?", [id], (err) => {
        if (err) return res.status(500).send(err);

        db.query("DELETE FROM Orders WHERE order_id = ?", [id], (err) => {
            if (err) return res.status(500).send(err);
            res.send("Order requirement fulfilled");
        });
    });
});

// Delete order
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM Order_Items WHERE order_id = ?", [id], (err) => {
        if (err) return res.status(500).send(err);

        db.query("DELETE FROM Orders WHERE order_id = ?", [id], (err) => {
            if (err) return res.status(500).send(err);
            res.send("Order cancelled");
        });
    });
});

module.exports = router;