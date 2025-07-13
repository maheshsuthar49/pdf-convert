const express = require('express');
const multer = require('multer');
const docxTopdf = require('docx-pdf');
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
app.post('/convertFile', upload.single('file'), function (req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const outputFileName =
            path.basename(req.file.originalname, path.extname(req.file.originalname)) + '.pdf';
        const outputPath = path.join(__dirname, 'files', outputFileName);

        docxTopdf(req.file.path, outputPath, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Error converting file' });
            }

            res.download(outputPath, (err) => {
                if (err) {
                    console.log('Download error:', err);
                } else {
                    console.log('File downloaded successfully');
                }
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ✅ Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
