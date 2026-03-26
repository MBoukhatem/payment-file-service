const path = require('path')
const fs = require('fs/promises')
const prisma = require('../prisma')

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads'

const saveFile = async (userId, file) => {
  const record = await prisma.file.create({
    data: {
      userId,
      filename: file.filename,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
    },
  })

  return record
}

const getFile = async (userId, filename) => {
  const record = await prisma.file.findFirst({
    where: { userId, filename },
  })

  if (!record) {
    const error = new Error('File not found')
    error.status = 404
    throw error
  }

  const absolutePath = path.resolve(record.path)

  try {
    await fs.access(absolutePath)
  } catch (_err) {
    const error = new Error('File not found on disk')
    error.status = 404
    throw error
  }

  return { record, absolutePath }
}

const deleteFile = async (userId, filename) => {
  const record = await prisma.file.findFirst({
    where: { userId, filename },
  })

  if (!record) {
    const error = new Error('File not found')
    error.status = 404
    throw error
  }

  // Delete from disk
  const absolutePath = path.resolve(record.path)
  try {
    await fs.unlink(absolutePath)
  } catch (_err) {
    console.warn(`File not found on disk: ${absolutePath}`)
  }

  // Delete from database
  await prisma.file.delete({ where: { id: record.id } })

  return { message: 'File deleted successfully' }
}

const listFiles = async (userId) => {
  return prisma.file.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

module.exports = {
  saveFile,
  getFile,
  deleteFile,
  listFiles,
}
