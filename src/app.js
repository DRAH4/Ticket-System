import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ticketRoutes from "./routes/tickets.js";
import eventRoutes from "./routes/events.js";
import kanbanRoutes from "./routes/kanban.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../Public")));

// Mount the tickets router — all routes inside it are prefixed with /api/tickets
app.use("/api/tickets", ticketRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/kanban", kanbanRoutes);

// DB health check
app.get("/api/db-test", async (req, res) => {
  const { default: pool } = await import("./db/db.js");
  try {
    const [rows] = await pool.query("SELECT 1 AS result");
    res.json({ ok: true, dbResult: rows[0].result });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Database test failed" });
  }
});

// Static page routes
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "../Public/index.html")));
app.get("/ticket-create", (_req, res) => res.sendFile(path.join(__dirname, "../Public/pages/ticket-create.html")));
app.get("/ticket-view", (_req, res) => res.sendFile(path.join(__dirname, "../Public/pages/ticket-view.html")));
app.get("/ticket-edit", (_req, res) => res.sendFile(path.join(__dirname, "../Public/pages/ticket-edit.html")));
app.get("/calendar", (_req, res) => res.sendFile(path.join(__dirname, "../Public/pages/calendar.html")));
app.get("/kanban", (_req, res) => res.sendFile(path.join(__dirname, "../Public/pages/kanban.html")));

export default app;
