const storageService = require('../services/storage.service')

const upload = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id']

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const record = await storageService.saveFile(userId, req.file)
    res.status(201).json({
      id: record.id,
      filename: record.filename,
      mimeType: record.mimeType,
      size: record.size,
      createdAt: record.createdAt,
    })
  } catch (err) {
    next(err)
  }
}

const getFile = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id']
    const { filename } = req.params
    const { record, absolutePath } = await storageService.getFile(userId, filename)

    res.set('Content-Type', record.mimeType)
    res.set('Content-Disposition', `inline; filename="${record.filename}"`)
    res.sendFile(absolutePath)
  } catch (err) {
    next(err)
  }
}

const deleteFile = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id']
    const { filename } = req.params
    const result = await storageService.deleteFile(userId, filename)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  upload,
  getFile,
  deleteFile,
}
