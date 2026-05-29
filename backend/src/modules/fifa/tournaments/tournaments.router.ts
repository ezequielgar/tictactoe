import { Router } from 'express'
import {
  listTournaments,
  getTournament,
  createTournamentHandler,
  updateTournamentHandler,
  registerHandler,
  approveRegistrationHandler,
  rejectRegistrationHandler,
} from './tournaments.controller'
import { requireAuth } from '../../../middleware/auth'
import { requireAdmin } from '../../../middleware/admin'

const router = Router()

router.use(requireAuth)

router.get('/', listTournaments)
router.get('/:id', getTournament)
router.post('/', requireAdmin, createTournamentHandler)
router.patch('/:id', requireAdmin, updateTournamentHandler)
router.post('/:id/register', registerHandler)
router.patch('/:id/registrations/:registrationId/approve', requireAdmin, approveRegistrationHandler)
router.patch('/:id/registrations/:registrationId/reject', requireAdmin, rejectRegistrationHandler)

export default router
