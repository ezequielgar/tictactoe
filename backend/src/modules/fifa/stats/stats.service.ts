import { prisma } from '../../../config/database'

export async function getPlayerStats(userId: string, tournamentId?: string) {
  const where = {
    userId,
    match: {
      status: 'FINISHED' as const,
      ...(tournamentId ? { tournamentId } : {}),
    },
  }

  const stats = await prisma.matchPlayerStat.aggregate({
    where,
    _count: { id: true },
    _sum: { goals: true },
  })

  const wins = await prisma.matchPlayerStat.count({
    where: { ...where, isWinner: true },
  })

  const total = stats._count.id
  const losses = total - wins

  return {
    userId,
    tournamentId: tournamentId ?? null,
    matchesPlayed: total,
    wins,
    losses,
    goalsScored: stats._sum.goals ?? 0,
    winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
    goalsPerMatch: total > 0 ? Math.round(((stats._sum.goals ?? 0) / total) * 10) / 10 : 0,
  }
}

export async function getHeadToHead(player1Id: string, player2Id: string) {
  const matches = await prisma.match.findMany({
    where: {
      status: 'FINISHED',
      format: 'ONE_VS_ONE',
      playerStats: {
        some: { userId: player1Id },
      },
    },
    include: {
      playerStats: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      },
    },
    orderBy: { playedAt: 'desc' },
  })

  const h2hMatches = matches.filter((m) =>
    m.playerStats.some((s) => s.userId === player2Id),
  )

  let player1Wins = 0
  let player2Wins = 0

  for (const match of h2hMatches) {
    const p1Stat = match.playerStats.find((s) => s.userId === player1Id)
    if (p1Stat?.isWinner) player1Wins++
    else player2Wins++
  }

  return {
    totalMatches: h2hMatches.length,
    player1Wins,
    player2Wins,
    lastMatches: h2hMatches.slice(0, 5),
  }
}

export async function getTournamentRanking(tournamentId: string) {
  const stats = await prisma.matchPlayerStat.findMany({
    where: {
      match: { tournamentId, status: 'FINISHED' },
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
  })

  const byUser = new Map<string, {
    userId: string
    name: string
    avatarUrl: string | null
    wins: number
    losses: number
    goals: number
    played: number
  }>()

  for (const stat of stats) {
    const current = byUser.get(stat.userId) ?? {
      userId: stat.userId,
      name: stat.user.name,
      avatarUrl: stat.user.avatarUrl,
      wins: 0,
      losses: 0,
      goals: 0,
      played: 0,
    }
    current.played++
    current.goals += stat.goals
    if (stat.isWinner) current.wins++
    else current.losses++
    byUser.set(stat.userId, current)
  }

  return Array.from(byUser.values())
    .sort((a, b) => b.wins - a.wins || b.goals - a.goals)
    .map((s, i) => ({ ...s, position: i + 1 }))
}
