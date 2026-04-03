const router = require("express").Router();
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const pdf = require("pdf-poppler");

const { extractText } = require("../services/ocrService");
const { parseInvoice } = require("../services/llmService");
const { supabase } = require("../services/supabaseClient");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const fileBuffer = await fs.readFile(filePath);

    const { error: uploadError } = await supabase.storage
      .from("invoices")
      .upload(fileName, fileBuffer, {
        contentType: fileType,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("invoices")
      .getPublicUrl(fileName);

    const fileUrl = publicUrlData.publicUrl;

    let imagePath = filePath;

    if (fileType === "application/pdf") {
      const outputDir = path.join("uploads", uuidv4());
      await fs.ensureDir(outputDir);

      await pdf.convert(filePath, {
        format: "jpeg",
        out_dir: outputDir,
        out_prefix: "page",
        page: 1,
      });

      const files = await fs.readdir(outputDir);
      imagePath = path.join(outputDir, files[0]);
    }

    const rawText = await extractText(imagePath);

    const parsed = await parseInvoice(rawText);

    await supabase.from("invoices").insert([
      {
        file_url: fileUrl,
        ...parsed,
      },
    ]);

    res.json({
      success: true,
      fileUrl,
      data: parsed,
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
