import { Router } from "express";
import pool from "../db/db.js";

const router = Router();

// GET /api/tickets
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, subject, description, priority, assignee, type, status, owner, createdAt
       FROM tickets
       ORDER BY createdAt DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// GET /api/tickets/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, subject, description, priority, assignee, type, status, owner, createdAt
       FROM tickets
       WHERE id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Ticket not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching ticket:", err);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

// POST /api/tickets
router.post("/", async (req, res) => {
  try {
    const { subject, description, priority, assignee, type, status, owner } = req.body;
    if (!subject || !priority || !assignee || !type || !status || !owner) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [result] = await pool.query(
      `INSERT INTO tickets (subject, description, priority, assignee, type, status, owner)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [subject, description || "", priority, assignee, type, status, owner]
    );
    const [rows] = await pool.query(
      `SELECT id, subject, description, priority, assignee, type, status, owner, createdAt
       FROM tickets WHERE id = ?`,
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

// PUT /api/tickets/:id
router.put("/:id", async (req, res) => {
  try {
    const allowed = ["subject", "description", "priority", "assignee", "type", "status", "owner"];
    const fields = Object.keys(req.body).filter((f) => allowed.includes(f));
    if (fields.length === 0) return res.status(400).json({ error: "No valid fields provided" });

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = [...fields.map((f) => req.body[f]), req.params.id];
    await pool.query(`UPDATE tickets SET ${setClause} WHERE id = ?`, values);
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating ticket:", err);
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

// DELETE /api/tickets/:id
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tickets WHERE id = ?", [req.params.id]);
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    console.error("Error deleting ticket:", err);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});

// GET /api/tickets/:id/comments
router.get("/:id/comments", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, ticket_id, author, text, date
       FROM comments
       WHERE ticket_id = ?
       ORDER BY date ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// POST /api/tickets/:id/comments
router.post("/:id/comments", async (req, res) => {
  try {
    const { author, text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text is required" });
    await pool.query(
      `INSERT INTO comments (ticket_id, author, text) VALUES (?, ?, ?)`,
      [req.params.id, author || "Anonymous", text]
    );
    res.status(201).json({ message: "Comment added" });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

export default router;
