const express = require("express");
const router = express.Router();
const pool = require("../db");

// WebSocket reference (this will be set in server.js)
let io;

const setSocketIo = (socketIoInstance) => {
    io = socketIoInstance;
};

// 📌 Fetch all contacts
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM contacts");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching contacts:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Update contact & notify via WebSocket
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { phone, department, company } = req.body;

    try {
        await pool.query(
            "UPDATE contacts SET phone_number = $1, department = $2, company_name = $3 WHERE id = $4",
            [phone, department, company, id]
        );

        // Emit update event to all connected clients
        if (io) {
            io.emit("contactUpdated", { id, phone, department, company });
        }

        res.json({ message: "Contact updated successfully" });
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({ error: "Failed to update contact" });
    }
});

module.exports = { router, setSocketIo };
