import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Allow JSON bodies (for POST / PUT requests)
app.use(express.json());

// Serve everything in /Public
app.use(express.static(path.join(__dirname, "Public")));

// MySQL POOL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "ServerPass#4",
  database: process.env.DB_NAME || "ticket_system",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Simple test route to verify DB connection
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");
    res.json({ ok: true, dbResult: rows[0].result });
  } catch (err) {
    console.error("DB test error:", err);
    res.status(500).json({ ok: false, error: "Database test failed" });
  }
});

// TICKETS API

// Get all tickets
app.get("/api/tickets", async (req, res) => {
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

// Get a single ticket by id
app.get("/api/tickets/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, subject, description, priority, assignee, type, status, owner, createdAt
       FROM tickets
       WHERE id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching ticket:", err);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

// Create a new ticket
app.post("/api/tickets", async (req, res) => {
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
       FROM tickets
       WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

// Update a ticket
app.put("/api/tickets/:id", async (req, res) => {
  try {
    const { subject, description, priority, assignee, type, status, owner } = req.body;

    if (!subject || !priority || !assignee || !type || !status || !owner) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await pool.query(
      `UPDATE tickets
       SET subject = ?, description = ?, priority = ?, assignee = ?, type = ?, status = ?, owner = ?
       WHERE id = ?`,
      [subject, description || "", priority, assignee, type, status, owner, req.params.id]
    );

    res.json({ message: "Ticket updated" });
  } catch (err) {
    console.error("Error updating ticket:", err);
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

// Delete a ticket
app.delete("/api/tickets/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tickets WHERE id = ?", [req.params.id]);
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    console.error("Error deleting ticket:", err);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});

// COMMENTS API

// Get comments for a ticket
app.get("/api/tickets/:id/comments", async (req, res) => {
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

// Add a comment to a ticket
app.post("/api/tickets/:id/comments", async (req, res) => {
  try {
    const { author, text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const name = author || "Anonymous";

    await pool.query(
      `INSERT INTO comments (ticket_id, author, text)
       VALUES (?, ?, ?)`,
      [req.params.id, name, text]
    );

    res.status(201).json({ message: "Comment added" });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Static page routes

// Serve index.html as the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

// Optional routes for other pages
app.get("/ticket-create", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "pages", "ticket-create.html"));
});

app.get("/ticket-view", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "pages", "ticket-view.html"));
});

app.get("/ticket-edit", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "pages", "ticket-edit.html"));
});

app.get("/calendar", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "pages", "calendar.html"));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));