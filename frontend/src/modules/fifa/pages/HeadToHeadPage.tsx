import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { statsService, usersService } from '@/services'
import { MatchCard } from '../components/MatchCard'
import { Spinner } from '@/components/ui/Spinner'
import type { User } from '@/types'

export function HeadToHeadPage() {
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => import('@/services/users').then((m) => m.usersService.list()),
  })

  const { data: h2h, isLoading, refetch } = useQuery({
    queryKey: ['h2h', player1Id, player2Id],
    queryFn: () => statsService.headToHead(player1Id, player2Id),
    enabled: false,
  })

  function handleSearch() {
    if (player1Id && player2Id && player1Id !== player2Id) {
      refetch()
    }
  }

  const player1 = users.find((u: User) => u.id === player1Id)
  const player2 = users.find((u: User) => u.id === player2Id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Comparador Head to Head</h1>

      <div className="card mb-6">
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Jugador 1</label>
            <select
              value={player1Id}
              onChange={(e) => setPlayer1Id(e.target.value)}
              className="input"
            >
              <option value="">Seleccionar jugador</option>
              {users
                .filter((u: User) => u.id !== player2Id)
                .map((u: User) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Jugador 2</label>
            <select
              value={player2Id}
              onChange={(e) => setPlayer2Id(e.target.value)}
              className="input"
            >
              <option value="">Seleccionar jugador</option>
              {users
                .filter((u: User) => u.id !== player1Id)
                .map((u: User) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleSearch}
          disabled={!player1Id || !player2Id || player1Id === player2Id}
          className="btn-primary w-full sm:w-auto"
        >
          Ver historial
        </button>
      </div>

      {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}

      {h2h && player1 && player2 && (
        <div className="space-y-4">
          <div className="card">
            <div className="grid grid-cols-3 text-center">
              <div>
                <p className="text-3xl font-bold text-white">{h2h.player1Wins}</p>
                <p className="text-sm text-gray-400 mt-1 truncate">{player1.name}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs text-gray-500">{h2h.totalMatches} partidos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{h2h.player2Wins}</p>
                <p className="text-sm text-gray-400 mt-1 truncate">{player2.name}</p>
              </div>
            </div>
          </div>

          {h2h.lastMatches.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-200 mb-3">Últimos partidos</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {h2h.lastMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
