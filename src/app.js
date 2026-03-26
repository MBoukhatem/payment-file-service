const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const fs = require('fs')
const fileRoutes = require('./routes/file.routes')

const app = express()
const PORT = process.env.PORT || 3004
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads'

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// Routes
app.use('/files', fileRoutes)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'file', timestamp: new Date().toISOString() })
})

// Multer error handling
app.use((err, _req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' })
  }
  if (err.message && err.message.includes('File type')) {
    return res.status(400).json({ error: err.message })
  }
  next(err)
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('File service error:', err)
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`File service running on http://localhost:${PORT}`)
})

module.exports = app
