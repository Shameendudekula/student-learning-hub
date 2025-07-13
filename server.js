const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend and uploads
app.use(express.static("public"));
app.use("/pdfs", express.static(path.join(__dirname, "public/pdfs")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ correct


// Upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Utility functions
const loadJSON = (file) => {
  const path = `data/${file}`;
  return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : [];
};
const saveJSON = (file, data) => {
  fs.writeFileSync(`data/${file}`, JSON.stringify(data, null, 2));
};

// Get all resources
app.get("/api/resources", (req, res) => {
  const resources = loadJSON("resources.json");
  res.json(resources);
});

// Upload resource
app.post("/api/upload", upload.fields([{ name: "file" }, { name: "thumb" }]), (req, res) => {
  const { title, description, class: classNum, subject, addedBy, thumbnailUrl } = req.body;

  const file = req.files?.file?.[0];
  const thumb = req.files?.thumb?.[0]; // Optional

  if (!file) {
    return res.status(400).json({ success: false, message: "File is required." });
  }

  const newResource = {
    id: Date.now(),
    title,
    description,
    class: parseInt(classNum),
    subject,
    link: "/uploads/" + file.filename,
    thumbnail: thumbnailUrl || (thumb ? "/uploads/" + thumb.filename : ""),
    addedBy,
    type: file.mimetype.includes("video") ? "video" : "pdf",
    pages: 0,
    questions: 0
  };

  const resources = loadJSON("resources.json");
  resources.push(newResource);
  saveJSON("resources.json", resources);
  res.json({ success: true, resource: newResource });
});

// Chat APIs
app.get("/api/chat", (req, res) => {
  res.json(loadJSON("chat.json"));
});
app.post("/api/chat", (req, res) => {
  const chats = loadJSON("chat.json");
  chats.push(req.body);
  saveJSON("chat.json", chats);
  res.json({ success: true });
});

// Progress APIs
app.post("/api/progress", (req, res) => {
  const progress = loadJSON("progress.json");
  const idx = progress.findIndex(p => p.email === req.body.email && p.id === req.body.id);
  if (idx !== -1) progress[idx] = req.body;
  else progress.push(req.body);
  saveJSON("progress.json", progress);
  res.json({ success: true });
});
app.get("/api/progress", (req, res) => {
  res.json(loadJSON("progress.json"));
});

// Routes for HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ind.html"));
});
app.get("/ind", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "welcome.html"));
});
app.get("/teacher", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "teacher.html"));
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
