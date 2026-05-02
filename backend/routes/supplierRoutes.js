const express = require("express");
const router = express.Router();
const db = require("../db");

// GET suppliers
router.get("/", (req, res) => {
    db.query("SELECT * FROM Supplier", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// ADD supplier
router.post("/add", (req, res) => {
    const { name, contact_number } = req.body;

    db.query(
        "INSERT INTO Supplier (name, contact_number) VALUES (?, ?)",
        [name, contact_number],
        (err) => {
            if (err) res.status(500).send(err);
            else res.send("Supplier added");
        }
    );
});

// DELETE supplier (with constraint check)
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    // Step 1: remove dependency from Medicine
    db.query(
        "UPDATE Medicine SET supplier_id = NULL WHERE supplier_id = ?",
        [id],
        (err) => {
            if (err) return res.status(500).send(err);

            // Step 2: delete supplier
            db.query(
                "DELETE FROM Supplier WHERE supplier_id = ?",
                [id],
                (err) => {
                    if (err) return res.status(500).send(err);
                    res.send("Supplier removed (contract ended)");
                }
            );
        }
    );
});

module.exports = router;