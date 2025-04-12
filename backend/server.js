const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const apiTestRoutes = require("./routes/apiTest");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api', apiTestRoutes);

const upload = multer({ dest: "uploads/" });
const reportPath = path.join(__dirname, "report.json");
const analyzeScript = path.join(__dirname, "analyzer", "analyze.py");

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join(__dirname, req.file.path);
  console.log("🔍 Analyzing:", filePath);

  exec(`python "${analyzeScript}" "${filePath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Python script error:", err);
      console.error("❌ STDERR:", stderr);
      return res.status(500).json({ error: "Python analysis failed" });
    }

    try {
      const result = JSON.parse(stdout);
      fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
      console.log("✅ Analysis complete. Report saved.");
      res.json({ message: "Upload & analysis done", result });
    } catch (parseErr) {
      console.error("❌ Could not parse analyzer output:", stdout);
      return res.status(500).json({ error: "Invalid analyzer output" });
    }
  });
});

// Report route
app.get('/report', (req, res) => {
    const reportPath = path.join(__dirname, 'report.json');
  
    if (fs.existsSync(reportPath)) {
      try {
        const data = fs.readFileSync(reportPath, 'utf-8');
        res.json(JSON.parse(data));
      } catch (err) {
        console.error('❌ Failed to parse report.json:', err.message);
        res.status(500).json({ error: 'Failed to read report' });
      }
    } else {
      console.warn('⚠️ report.json not found, returning empty array');
      res.json([]); // <- Return empty array if file doesn't exist
    }
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
