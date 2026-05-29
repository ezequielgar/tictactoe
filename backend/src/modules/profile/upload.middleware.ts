import multer from 'multer'
import path from 'path'
import fs from 'fs'

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? '/app/uploads/avatars'

// Crear directorio si no existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `avatar-${unique}${ext}`)
  },
})

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo upload
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Solo se aceptan imágenes JPEG, PNG o WebP'))
    }
  },
}).single('avatar')
