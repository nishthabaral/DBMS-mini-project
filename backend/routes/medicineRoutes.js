const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all medicines
router.get("/", (req, res) => {
    db.query("SELECT * FROM Medicine", (err, result) => {
        if (err) res.status(500).send(err);
        else res.json(result);
    });
});

// SEARCH medicine
router.get("/search", (req, res) => {
    const name = req.query.name;

    db.query(
        "SELECT * FROM Medicine WHERE name LIKE ?",
        [`%${name}%`],
        (err, result) => {
            if (err) res.status(500).send(err);
            else res.json(result);
        }
    );
});

// ADD medicine
router.post("/add", (req, res) => {
    const { medicine_id, name, price, stock_quantity, expiry_date, batch_number } = req.body;

    db.query(
        `INSERT INTO Medicine 
        (medicine_id, name, price, stock_quantity, expiry_date, batch_number)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [medicine_id, name, price, stock_quantity, expiry_date, batch_number],
        (err) => {
            if (err) {
                console.log(err);        // 🔥 check terminal
                return res.status(500).send(err.sqlMessage);
            }
            res.send("Medicine added");
        }
    );
});

// DELETE medicine
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    // delete from child table first
    db.query("DELETE FROM Order_Items WHERE medicine_id = ?", [id], (err) => {
        if (err) return res.status(500).send(err);

        // then delete from parent
        db.query("DELETE FROM Medicine WHERE medicine_id = ?", [id], (err) => {
            if (err) return res.status(500).send(err);
            res.send("Medicine deleted successfully");
        });
    });
});

module.exports = router;