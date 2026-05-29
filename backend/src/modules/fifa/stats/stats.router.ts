import { Router } from 'express'
import { playerStats, headToHead, tournamentRanking } from './stats.controller'
import { requireAuth } from '../../../middleware/auth'

const router = Router()

router.use(requireAuth)

router.get('/player/:userId', playerStats)
router.get('/head-to-head', headToHead)
router.get('/tournament/:tournamentId/ranking', tournamentRanking)

export default router
