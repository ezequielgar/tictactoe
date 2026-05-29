import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tournamentsService, matchesService, statsService } from '@/services/fifa'
import { MatchCard } from '../components/MatchCard'
import { Spinner } from '@/components/ui/Spinner'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/store/authStore'

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()

  const { data: tournament, isLoading: loadingTournament } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentsService.getById(id!),
    enabled: !!id,
  })

  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking', id],
    queryFn: () => statsService.ranking(id!),
    enabled: !!id && tournament?.status !== 'DRAFT',
  })

  if (loadingTournament) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  if (!tournament) {
    return <p className="text-gray-400 text-center py-16">Torneo no encontrado.</p>
  }

  const approvedPlayers = tournament.registrations?.filter((r: { status: string }) => r.status === 'APPROVED') ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 mb-1 block">
            ← Torneos
          </Link>
          <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
          {tournament.description && (
            <p className="text-gray-400 mt-1">{tournament.description}</p>
          )}
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn-secondary text-sm shrink-0">Cargar resultado</button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ranking */}
        {ranking.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-200 mb-3">Ranking</h2>
            <div className="card divide-y divide-gray-800">
              {ranking.map((entry) => (
                <div key={entry.userId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="text-sm font-bold text-gray-500 w-5 text-center">
                    {entry.position}
                  </span>
                  <Avatar src={entry.avatarUrl} name={entry.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{entry.name}</p>
                    <p className="text-xs text-gray-500">
                      {entry.wins}V – {entry.losses}D · {entry.goals} goles
                    </p>
                  </div>
                  <span className="text-sm font-bold text-primary-400">
                    {entry.wins * 3} pts
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Jugadores inscriptos */}
        {approvedPlayers.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-200 mb-3">
              Jugadores ({approvedPlayers.length})
            </h2>
            <div className="card divide-y divide-gray-800">
              {approvedPlayers.map((reg: { user: { id: string; name: string; avatarUrl?: string } }) => (
                <div key={reg.user.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar src={reg.user.avatarUrl} name={reg.user.name} size="sm" />
                  <p className="font-medium text-white text-sm">{reg.user.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Partidos */}
      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">Partidos</h2>
        {tournament.matches?.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay partidos cargados todavía.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {tournament.matches?.map((match: Parameters<typeof MatchCard>[0]['match']) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
