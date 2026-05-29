import { Router } from 'express'
import { googleLogin, googleCallback, refresh, logout, me } from './auth.controller'
import { requireAuth } from '../../middleware/auth'

const router = Router()

router.get('/google', googleLogin)
router.get('/google/callback', googleCallback)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', requireAuth, me)

export default router
