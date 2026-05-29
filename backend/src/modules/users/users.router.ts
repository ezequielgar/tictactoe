import { Router } from 'express'
import { listUsers, listPendingUsers, approveUser, getUser } from './users.controller'
import { requireAuth } from '../../middleware/auth'
import { requireAdmin } from '../../middleware/admin'

const router = Router()

router.use(requireAuth)

router.get('/', requireAdmin, listUsers)
router.get('/pending', requireAdmin, listPendingUsers)
router.get('/:id', getUser)
router.patch('/:id/role', requireAdmin, approveUser)

export default router
