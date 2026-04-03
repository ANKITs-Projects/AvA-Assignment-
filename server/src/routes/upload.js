const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const pdf = require("pdf-poppler");

const { extractText } = require("../services/ocrService");
const { parseInvoice } = require("../services/llmService");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    let imagePath = filePath;

    // 🟡 HANDLE PDF → CONVERT TO IMAGE
    if (fileType === "application/pdf") {
      const outputDir = path.join("uploads", uuidv4());
      await fs.ensureDir(outputDir);

      const options = {
        format: "jpeg",
        out_dir: outputDir,
        out_prefix: "page",
        page: 1, // first page (can extend later)
      };

      await pdf.convert(filePath, options);

      const files = await fs.readdir(outputDir);
      imagePath = path.join(outputDir, files[0]);
    }

    // 🟢 HANDLE IMAGE (JPG / PNG)
    // no change needed

    // 🔍 OCR (works for both cases now)
    const rawText = await extractText(imagePath);

    // 🤖 LLM
    const parsed = await parseInvoice(rawText);

    res.json({
      success: true,
      data: parsed,
    });

  } catch (err) {
    console.error("❌ ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;