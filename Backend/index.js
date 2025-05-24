const express = require('express')
const multer = require('multer')
const docxTopdf = require('docx-pdf');
const path = require('path');
const cors = require('cors');


const app = express()
const port = 3000
app.use(cors());

// seting up file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage })

app.post('/convertFile', upload.single('file'), function (req, res, next) {
    try {
        if(!req.file){
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Replace extension with .pdf
        const outputFileName = path.basename(req.file.originalname, path.extname(req.file.originalname)) + '.pdf';
        const outputPath = path.join(__dirname, 'files', outputFileName);

        docxTopdf(req.file.path, outputPath, (err, result)=> {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Error converting file' });
            }
            // Wait for file to be written, then send
            res.download(outputPath, (err) => {
                if (err) {
                    console.log('Download error:', err);
                } else {
                    console.log('File downloaded successfully');
                }
            });
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' });
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
