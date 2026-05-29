import type { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import type { AuthRequest } from '../../middleware/auth'
import { getProfile, updateProfile, updateAvatar, UpdateProfileSchema } from './profile.service'

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? '/app/uploads/avatars'
const PUBLIC_URL = process.env.BACKEND_URL ?? 'http://localhost:4000'

export async function getMyProfile(req: AuthRequest, res: Response): Promise<void> {
  const profile = await getProfile(req.user!.id)
  if (!profile) {
    res.status(404).json({ message: 'Profile not found' })
    return
  }
  res.json(profile)
}

export async function updateMyProfile(req: AuthRequest, res: Response): Promise<void> {
  const parsed = UpdateProfileSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten().fieldErrors })
    return
  }
  const user = await updateProfile(req.user!.id, parsed.data)
  res.json(user)
}

export async function uploadAvatarHandler(req: AuthRequest, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ message: 'No se recibió ningún archivo' })
    return
  }

  try {
    // Redimensionar y comprimir con sharp: 200x200 max, webp, calidad 80
    const inputPath = req.file.path
    const outputFilename = `avatar-${req.user!.id}.webp`
    const outputPath = path.join(UPLOADS_DIR, outputFilename)

    await sharp(inputPath)
      .resize(200, 200, { fit: 'cover', position: 'center' })
      .webp({ quality: 80 })
      .toFile(outputPath)

    // Borrar el archivo original subido
    fs.unlinkSync(inputPath)

    const avatarUrl = `${PUBLIC_URL}/uploads/avatars/${outputFilename}`
    const user = await updateAvatar(req.user!.id, avatarUrl)

    res.json(user)
  } catch (error) {
    // Limpiar archivo en caso de error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    throw error
  }
}
