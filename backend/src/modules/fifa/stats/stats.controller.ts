import type { Request, Response } from 'express'
import { getPlayerStats, getHeadToHead, getTournamentRanking } from './stats.service'

export async function playerStats(req: Request, res: Response): Promise<void> {
  const { userId } = req.params
  const { tournamentId } = req.query
  const stats = await getPlayerStats(userId, tournamentId as string | undefined)
  res.json(stats)
}

export async function headToHead(req: Request, res: Response): Promise<void> {
  const { player1Id, player2Id } = req.query
  if (!player1Id || !player2Id || typeof player1Id !== 'string' || typeof player2Id !== 'string') {
    res.status(400).json({ message: 'player1Id and player2Id query params required' })
    return
  }
  const data = await getHeadToHead(player1Id, player2Id)
  res.json(data)
}

export async function tournamentRanking(req: Request, res: Response): Promise<void> {
  const { tournamentId } = req.params
  const ranking = await getTournamentRanking(tournamentId)
  res.json(ranking)
}
