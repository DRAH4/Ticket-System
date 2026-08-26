import { Router } from "express";
import pool from "../db/db.js";

const router = Router();

// GET /api/kanban — all boards with their items nested
router.get("/", async (req, res) => {
  try {
    const [boards] = await pool.query(
      "SELECT id, title FROM kanban_boards ORDER BY position ASC"
    );
    const [items] = await pool.query(
      "SELECT id, board_id, title FROM kanban_items ORDER BY position ASC, created_at ASC"
    );
    res.json(
      boards.map(board => ({
        id: board.id,
        title: board.title,
        item: items
          .filter(i => i.board_id === board.id)
          .map(i => ({ id: i.id, title: i.title }))
      }))
    );
  } catch (err) {
    console.error("Error fetching kanban:", err);
    res.status(500).json({ error: "Failed to fetch kanban data" });
  }
});

// POST /api/kanban/boards
router.post("/boards", async (req, res) => {
  try {
    const { id, title } = req.body;
    if (!id || !title) return res.status(400).json({ error: "id and title required" });
    const [[{ maxPos }]] = await pool.query(
      "SELECT COALESCE(MAX(position), -1) AS maxPos FROM kanban_boards"
    );
    await pool.query(
      "INSERT INTO kanban_boards (id, title, position) VALUES (?, ?, ?)",
      [id, title, maxPos + 1]
    );
    res.status(201).json({ id, title, item: [] });
  } catch (err) {
    console.error("Error creating board:", err);
    res.status(500).json({ error: "Failed to create board" });
  }
});

// PUT /api/kanban/boards/:id
router.put("/boards/:id", async (req, res) => {
  try {
    const { title } = req.body;
    await pool.query("UPDATE kanban_boards SET title = ? WHERE id = ?", [title, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating board:", err);
    res.status(500).json({ error: "Failed to update board" });
  }
});

// DELETE /api/kanban/boards/:id
router.delete("/boards/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM kanban_boards WHERE id = ?", [req.params.id]);
    res.json({ message: "Board deleted" });
  } catch (err) {
    console.error("Error deleting board:", err);
    res.status(500).json({ error: "Failed to delete board" });
  }
});

// POST /api/kanban/boards/:boardId/items
router.post("/boards/:boardId/items", async (req, res) => {
  try {
    const { id, title } = req.body;
    if (!id || !title) return res.status(400).json({ error: "id and title required" });
    const [[{ maxPos }]] = await pool.query(
      "SELECT COALESCE(MAX(position), -1) AS maxPos FROM kanban_items WHERE board_id = ?",
      [req.params.boardId]
    );
    await pool.query(
      "INSERT INTO kanban_items (id, board_id, title, position) VALUES (?, ?, ?, ?)",
      [id, req.params.boardId, title, maxPos + 1]
    );
    res.status(201).json({ id, board_id: req.params.boardId, title });
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

// PUT /api/kanban/items/:id — update title or move to a different board
router.put("/items/:id", async (req, res) => {
  try {
    const allowed = ["title", "board_id"];
    const fields = Object.keys(req.body).filter(f => allowed.includes(f));
    if (fields.length === 0) return res.status(400).json({ error: "No valid fields" });
    const setClause = fields.map(f => `${f} = ?`).join(", ");
    const values = [...fields.map(f => req.body[f]), req.params.id];
    await pool.query(`UPDATE kanban_items SET ${setClause} WHERE id = ?`, values);
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE /api/kanban/items/:id
router.delete("/items/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM kanban_items WHERE id = ?", [req.params.id]);
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;
