import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import { getMyProfile, updateMyProfile, uploadAvatarHandler } from './profile.controller'
import { uploadAvatar } from './upload.middleware'

const router = Router()

router.use(requireAuth)

router.get('/', getMyProfile)
router.patch('/', updateMyProfile)
router.post('/avatar', (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) {
      res.status(400).json({ message: err.message })
      return
    }
    next()
  })
}, uploadAvatarHandler)

export default router
