export type Role = 'PENDING' | 'PLAYER' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role: Role
  createdAt: string
}

export type TournamentType = 'LEAGUE' | 'CUP' | 'FRIENDLY'
export type MatchFormat = 'ONE_VS_ONE' | 'TWO_VS_TWO' | 'MIXED'
export type TournamentStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'FINISHED'

export interface Tournament {
  id: string
  name: string
  description?: string
  type: TournamentType
  format: MatchFormat
  status: TournamentStatus
  startDate?: string
  endDate?: string
  createdById: string
  createdAt: string
  _count?: { registrations: number; matches: number }
}

export type MatchStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED'

export interface MatchPlayerStat {
  id: string
  matchId: string
  userId: string
  goals: number
  isWinner: boolean
  user: Pick<User, 'id' | 'name' | 'avatarUrl'>
}

export interface Match {
  id: string
  tournamentId: string
  format: MatchFormat
  status: MatchStatus
  player1Id?: string
  player2Id?: string
  winnerId?: string
  scheduledAt?: string
  playedAt?: string
  playerStats: MatchPlayerStat[]
}

export interface PlayerStats {
  userId: string
  tournamentId: string | null
  matchesPlayed: number
  wins: number
  losses: number
  goalsScored: number
  winRate: number
  goalsPerMatch: number
}

export interface RankingEntry {
  position: number
  userId: string
  name: string
  avatarUrl: string | null
  wins: number
  losses: number
  goals: number
  played: number
}

export interface HeadToHead {
  totalMatches: number
  player1Wins: number
  player2Wins: number
  lastMatches: Match[]
}
