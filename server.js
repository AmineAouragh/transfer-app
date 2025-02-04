const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(express.json())
app.use(cors())

const PORT = 8080

const upload = multer({ 
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = path.join(__dirname, 'uploads')
            if (!fs.existsSync(uploadDir)){
                fs.mkdirSync(uploadDir)
            }
            cb(null, uploadDir)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname))
        }
    })
}) // Store files in memory

// Store images in memory 
const sessions = {}

// upload endpoint (PC uploads images)
app.post('/upload', upload.array('files'), (req, res) => {
    const sessionId = Date.now().toString() 
    const uploadedFiles = req.files.map(file => ({
        originalname: file.originalname,
        path: file.path 
    })) 

    sessions[sessionId] = uploadedFiles

    // Log the sessionId and the files to check if they are being processed correctly
    console.log('Session ID:', sessionId);
    console.log('Files:', req.files);

    res.json({ sessionId })
})

// Download endpoint (Phone fetches images)
app.get('/transfer/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId
    if (!sessions[sessionId]){
        return res.status(404).json({ error: 'Session not found' })
    }

    const images = sessions[sessionId]

    const imagePath = images[0].path 
    
    res.sendFile(imagePath, (err) => {
        if (err){
            console.error('File not found: ', err)
            res.status(500).json({ error: 'Internal server error.' })
        }
    })
    
})

app.listen(PORT, () => {
    console.log('Server listening at port: ', PORT)
})