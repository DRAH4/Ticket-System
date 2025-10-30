import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve everything in /Public
app.use(express.static(path.join(__dirname, "Public")));

// ✅ Serve index.html (your ticket list) as the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

// Optional routes for other pages (if needed)
app.get("/ticket-create", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "pages", "ticket-create.html"));
});

app.get("/ticket-view", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "pages", "ticket-view.html"));
});

app.get("/ticket-edit", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "pages", "ticket-edit"));
});

app.get("/calendar", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "pages", "calendar.html"));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
