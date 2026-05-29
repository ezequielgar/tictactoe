import type { Request, Response } from 'express'
import {
  getMatchesByTournament,
  getMatchById,
  createMatch,
  finishMatch,
  CreateMatchSchema,
  FinishMatchSchema,
} from './matches.service'

export async function listMatches(req: Request, res: Response): Promise<void> {
  const { tournamentId } = req.query
  if (!tournamentId || typeof tournamentId !== 'string') {
    res.status(400).json({ message: 'tournamentId query param required' })
    return
  }
  const matches = await getMatchesByTournament(tournamentId)
  res.json(matches)
}

export async function getMatch(req: Request, res: Response): Promise<void> {
  const match = await getMatchById(req.params.id)
  if (!match) {
    res.status(404).json({ message: 'Match not found' })
    return
  }
  res.json(match)
}

export async function createMatchHandler(req: Request, res: Response): Promise<void> {
  const parsed = CreateMatchSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten().fieldErrors })
    return
  }
  const match = await createMatch(parsed.data)
  res.status(201).json(match)
}

export async function finishMatchHandler(req: Request, res: Response): Promise<void> {
  const parsed = FinishMatchSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten().fieldErrors })
    return
  }
  const result = await finishMatch(req.params.id, parsed.data)
  res.json(result)
}
