const express = require('express');
const multer = require('multer');
// const docxTopdf = require('docx-pdf');
import { PDFDocument, rgb } from "pdf-lib";
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

// ✅ Use environment variable for port (important for Render)
const port = 3000

app.use(cors());

// ✅ Optional root route so Render doesn’t show "Cannot GET /"
app.get('/', (req, res) => {
    res.send('🎉 PDF Convert Backend is Live!');
});

// ✅ Make sure "uploads" and "files" folders exist (prevent crash)
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};
ensureDir('uploads');
ensureDir('files');

// ✅ Setup file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// ✅ Main route for file conversion
app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = req.file.originalname;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText(`Uploaded File: ${fileName}`, {
      x: 50,
      y: 350,
      size: 24,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName.split('.')[0]}.pdf"`,
    });

    res.send(pdfBytes);
    fs.unlinkSync(filePath); // cleanup
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Failed to generate PDF." });
  }
});// ✅ Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
