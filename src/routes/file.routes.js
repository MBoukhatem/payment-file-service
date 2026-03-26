const express = require('express')
const fileController = require('../controllers/file.controller')
const { uploadMiddleware } = require('../middlewares/upload.middleware')

const router = express.Router()

router.post('/upload', uploadMiddleware.single('file'), fileController.upload)
router.get('/:filename', fileController.getFile)
router.delete('/:filename', fileController.deleteFile)

module.exports = router
