import { Router } from "express";
import pool from "../db/db.js";

const router = Router();

const formatEvent = (row) => ({
  id: row.id,
  title: row.title,
  start: row.start,
  end: row.end || null,
  allDay: !!row.allDay,
  url: row.url || '',
  extendedProps: {
    calendar: row.calendar_type,
    location: row.location || '',
    description: row.description || ''
  }
});

// GET /api/events
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, start, end, allDay, url, calendar_type, location, description
       FROM calendar_events ORDER BY start ASC`
    );
    res.json(rows.map(formatEvent));
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// POST /api/events
router.post("/", async (req, res) => {
  try {
    const { title, start, end, allDay, url, extendedProps } = req.body;
    if (!title || !start) return res.status(400).json({ error: "Title and start are required" });

    const [result] = await pool.query(
      `INSERT INTO calendar_events (title, start, end, allDay, url, calendar_type, location, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, start, end || null, allDay ? 1 : 0, url || '',
        extendedProps?.calendar || 'Business',
        extendedProps?.location || '',
        extendedProps?.description || ''
      ]
    );
    const [[row]] = await pool.query("SELECT * FROM calendar_events WHERE id = ?", [result.insertId]);
    res.status(201).json(formatEvent(row));
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// PUT /api/events/:id
router.put("/:id", async (req, res) => {
  try {
    const { title, start, end, allDay, url, extendedProps } = req.body;
    await pool.query(
      `UPDATE calendar_events
       SET title=?, start=?, end=?, allDay=?, url=?, calendar_type=?, location=?, description=?
       WHERE id=?`,
      [
        title, start, end || null, allDay ? 1 : 0, url || '',
        extendedProps?.calendar || 'Business',
        extendedProps?.location || '',
        extendedProps?.description || '',
        req.params.id
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE /api/events/:id
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM calendar_events WHERE id = ?", [req.params.id]);
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
