import { prisma } from '../../../config/database'
import { z } from 'zod'

export const CreateMatchSchema = z.object({
  tournamentId: z.string(),
  player1Id: z.string(),
  player2Id: z.string(),
  scheduledAt: z.string().datetime().optional(),
})

export const FinishMatchSchema = z.object({
  player1Goals: z.number().int().min(0),
  player2Goals: z.number().int().min(0),
  playedAt: z.string().datetime().optional(),
})

export type CreateMatchInput = z.infer<typeof CreateMatchSchema>
export type FinishMatchInput = z.infer<typeof FinishMatchSchema>

export async function getMatchesByTournament(tournamentId: string) {
  return prisma.match.findMany({
    where: { tournamentId },
    orderBy: { scheduledAt: 'desc' },
    include: {
      playerStats: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      },
    },
  })
}

export async function getMatchById(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      playerStats: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      },
      tournament: { select: { id: true, name: true } },
    },
  })
}

export async function createMatch(input: CreateMatchInput) {
  return prisma.match.create({
    data: {
      tournamentId: input.tournamentId,
      format: 'ONE_VS_ONE',
      player1Id: input.player1Id,
      player2Id: input.player2Id,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
    },
  })
}

export async function finishMatch(matchId: string, input: FinishMatchInput) {
  const match = await prisma.match.findUnique({ where: { id: matchId } })
  if (!match || !match.player1Id || !match.player2Id) {
    throw new Error('Match not found or missing players')
  }

  const { player1Goals, player2Goals } = input
  const winnerId =
    player1Goals > player2Goals
      ? match.player1Id
      : player2Goals > player1Goals
        ? match.player2Id
        : null

  return prisma.$transaction([
    prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'FINISHED',
        winnerId,
        playedAt: input.playedAt ? new Date(input.playedAt) : new Date(),
      },
    }),
    prisma.matchPlayerStat.upsert({
      where: { matchId_userId: { matchId, userId: match.player1Id } },
      create: {
        matchId,
        userId: match.player1Id,
        goals: player1Goals,
        isWinner: winnerId === match.player1Id,
      },
      update: { goals: player1Goals, isWinner: winnerId === match.player1Id },
    }),
    prisma.matchPlayerStat.upsert({
      where: { matchId_userId: { matchId, userId: match.player2Id } },
      create: {
        matchId,
        userId: match.player2Id,
        goals: player2Goals,
        isWinner: winnerId === match.player2Id,
      },
      update: { goals: player2Goals, isWinner: winnerId === match.player2Id },
    }),
  ])
}
