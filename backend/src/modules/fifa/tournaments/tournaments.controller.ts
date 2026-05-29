import type { Request, Response } from 'express'
import type { AuthRequest } from '../../../middleware/auth'
import {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  registerToTournament,
  approveRegistration,
  rejectRegistration,
  CreateTournamentSchema,
  UpdateTournamentSchema,
} from './tournaments.service'

export async function listTournaments(_req: Request, res: Response): Promise<void> {
  const tournaments = await getTournaments()
  res.json(tournaments)
}

export async function getTournament(req: Request, res: Response): Promise<void> {
  const tournament = await getTournamentById(req.params.id)
  if (!tournament) {
    res.status(404).json({ message: 'Tournament not found' })
    return
  }
  res.json(tournament)
}

export async function createTournamentHandler(req: AuthRequest, res: Response): Promise<void> {
  const parsed = CreateTournamentSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten().fieldErrors })
    return
  }
  const tournament = await createTournament(parsed.data, req.user!.id)
  res.status(201).json(tournament)
}

export async function updateTournamentHandler(req: Request, res: Response): Promise<void> {
  const parsed = UpdateTournamentSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten().fieldErrors })
    return
  }
  const tournament = await updateTournament(req.params.id, parsed.data)
  res.json(tournament)
}

export async function registerHandler(req: AuthRequest, res: Response): Promise<void> {
  const registration = await registerToTournament(req.params.id, req.user!.id)
  res.status(201).json(registration)
}

export async function approveRegistrationHandler(req: AuthRequest, res: Response): Promise<void> {
  const registration = await approveRegistration(req.params.registrationId, req.user!.id)
  res.json(registration)
}

export async function rejectRegistrationHandler(req: Request, res: Response): Promise<void> {
  const registration = await rejectRegistration(req.params.registrationId)
  res.json(registration)
}
