import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import pdf from "pdf-poppler";

import { extractText } from "../services/ocrService.js";
import { parseInvoice } from "../services/llmService.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    let imagePath = filePath;

    // 🟡 STEP 1: Convert PDF → Image
    if (fileType === "application/pdf") {
      const outputDir = path.join("uploads", uuidv4());
      fs.mkdirSync(outputDir, { recursive: true });

      const options = {
        format: "jpeg",
        out_dir: outputDir,
        out_prefix: "page",
        page: 1, // only first page (you can extend later)
      };

      await pdf.convert(filePath, options);

      // pick first generated image
      const files = fs.readdirSync(outputDir);
      imagePath = path.join(outputDir, files[0]);
    }

    // 🟢 STEP 2: OCR
    const rawText = await extractText(imagePath);

    // 🔵 STEP 3: LLM
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

export default router;