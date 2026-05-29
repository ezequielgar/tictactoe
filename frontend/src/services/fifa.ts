import { api } from './api'
import type { Tournament, Match, PlayerStats, RankingEntry, HeadToHead } from '@/types'

export const tournamentsService = {
  list: () => api.get<Tournament[]>('/tournaments').then((r) => r.data),
  getById: (id: string) => api.get<Tournament>(`/tournaments/${id}`).then((r) => r.data),
  create: (data: Partial<Tournament>) =>
    api.post<Tournament>('/tournaments', data).then((r) => r.data),
  update: (id: string, data: Partial<Tournament>) =>
    api.patch<Tournament>(`/tournaments/${id}`, data).then((r) => r.data),
  register: (id: string) =>
    api.post(`/tournaments/${id}/register`).then((r) => r.data),
  approveRegistration: (tournamentId: string, registrationId: string) =>
    api.patch(`/tournaments/${tournamentId}/registrations/${registrationId}/approve`).then((r) => r.data),
  rejectRegistration: (tournamentId: string, registrationId: string) =>
    api.patch(`/tournaments/${tournamentId}/registrations/${registrationId}/reject`).then((r) => r.data),
}

export const matchesService = {
  listByTournament: (tournamentId: string) =>
    api.get<Match[]>(`/matches?tournamentId=${tournamentId}`).then((r) => r.data),
  getById: (id: string) => api.get<Match>(`/matches/${id}`).then((r) => r.data),
  create: (data: { tournamentId: string; player1Id: string; player2Id: string; scheduledAt?: string }) =>
    api.post<Match>('/matches', data).then((r) => r.data),
  finish: (id: string, data: { player1Goals: number; player2Goals: number }) =>
    api.patch(`/matches/${id}/finish`, data).then((r) => r.data),
}

export const statsService = {
  player: (userId: string, tournamentId?: string) =>
    api
      .get<PlayerStats>(`/stats/player/${userId}${tournamentId ? `?tournamentId=${tournamentId}` : ''}`)
      .then((r) => r.data),
  headToHead: (player1Id: string, player2Id: string) =>
    api.get<HeadToHead>(`/stats/head-to-head?player1Id=${player1Id}&player2Id=${player2Id}`).then((r) => r.data),
  ranking: (tournamentId: string) =>
    api.get<RankingEntry[]>(`/stats/tournament/${tournamentId}/ranking`).then((r) => r.data),
}
