import { Router } from 'express'
import { listMatches, getMatch, createMatchHandler, finishMatchHandler } from './matches.controller'
import { requireAuth } from '../../../middleware/auth'
import { requireAdmin } from '../../../middleware/admin'

const router = Router()

router.use(requireAuth)

router.get('/', listMatches)
router.get('/:id', getMatch)
router.post('/', requireAdmin, createMatchHandler)
router.patch('/:id/finish', requireAdmin, finishMatchHandler)

export default router
