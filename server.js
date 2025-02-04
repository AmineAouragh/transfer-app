const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')

const app = express()

app.use(express.json())
app.use(cors())

const PORT = 8080

// configure multer (store files in memory)
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Store images in memory 
const sessions = {}

// upload endpoint (PC uploads images)
app.post('/upload', upload.array('files'), (req, res) => {

    const sessionId = Date.now().toString() 

    const uploadedFiles = req.files.map(file => ({
        filename: file.originalname,
        data: file.buffer 
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

    const image = sessions[sessionId][0]

    res.setHeader('Content-Disposition', `attachment; filename="${image.filename}"`)
    res.setHeader('Content-Type', 'image/png'); // Change based on file type
    
    res.send(image.data)
    
})

app.listen(PORT, () => {
    console.log('Server listening at port: ', PORT)
})