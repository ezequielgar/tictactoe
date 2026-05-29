import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tournamentsService, statsService } from '@/services/fifa'
import { MatchCard } from '../components/MatchCard'
import { CreateMatchModal } from '../components/CreateMatchModal'
import { FinishMatchModal } from '../components/FinishMatchModal'
import { Spinner } from '@/components/ui/Spinner'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/store/authStore'
import type { Match, TournamentStatus } from '@/types'

const STATUS_NEXT: Partial<Record<TournamentStatus, { label: string; next: TournamentStatus }>> = {
  DRAFT: { label: 'Abrir inscripción', next: 'OPEN' },
  OPEN: { label: 'Iniciar torneo', next: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Finalizar torneo', next: 'FINISHED' },
}

const STATUS_BADGE: Record<TournamentStatus, string> = {
  DRAFT: 'badge-gray',
  OPEN: 'badge-green',
  IN_PROGRESS: 'badge-yellow',
  FINISHED: 'badge-blue',
}

const STATUS_LABEL: Record<TournamentStatus, string> = {
  DRAFT: 'Borrador',
  OPEN: 'Inscripción abierta',
  IN_PROGRESS: 'En progreso',
  FINISHED: 'Finalizado',
}

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [showCreateMatch, setShowCreateMatch] = useState(false)
  const [matchToFinish, setMatchToFinish] = useState<Match | null>(null)

  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentsService.getById(id!),
    enabled: !!id,
  })

  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking', id],
    queryFn: () => statsService.ranking(id!),
    enabled: !!id && tournament?.status !== 'DRAFT',
  })

  const updateStatus = useMutation({
    mutationFn: (status: TournamentStatus) => tournamentsService.update(id!, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tournament', id] }),
  })

  const register = useMutation({
    mutationFn: () => tournamentsService.register(id!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tournament', id] }),
  })

  if (isLoading) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  if (!tournament) {
    return <p className="text-gray-400 text-center py-16">Torneo no encontrado.</p>
  }

  const isAdmin = user?.role === 'ADMIN'
  const approvedPlayers = tournament.registrations?.filter((r) => r.status === 'APPROVED') ?? []
  const myRegistration = tournament.registrations?.find((r) => r.userId === user?.id)
  const nextStatus = STATUS_NEXT[tournament.status]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 mb-1 block">
            ← Torneos
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
            <span className={STATUS_BADGE[tournament.status]}>
              {STATUS_LABEL[tournament.status]}
            </span>
          </div>
          {tournament.description && (
            <p className="text-gray-400 mt-1">{tournament.description}</p>
          )}
        </div>

        <div className="flex gap-2 flex-wrap shrink-0">
          {/* Player: inscribirse */}
          {user?.role === 'PLAYER' && tournament.status === 'OPEN' && (
            <>
              {!myRegistration && (
                <button
                  onClick={() => register.mutate()}
                  disabled={register.isPending}
                  className="btn-primary text-sm"
                >
                  {register.isPending ? 'Enviando...' : '+ Inscribirse'}
                </button>
              )}
              {myRegistration?.status === 'PENDING' && (
                <span className="badge-yellow text-sm px-3 py-1.5">⏳ Solicitud enviada</span>
              )}
              {myRegistration?.status === 'APPROVED' && (
                <span className="badge-green text-sm px-3 py-1.5">✓ Inscripto</span>
              )}
              {myRegistration?.status === 'REJECTED' && (
                <span className="badge-red text-sm px-3 py-1.5">✗ Rechazado</span>
              )}
            </>
          )}

          {/* Admin: cargar partido */}
          {isAdmin && tournament.status === 'IN_PROGRESS' && approvedPlayers.length >= 2 && (
            <button
              onClick={() => setShowCreateMatch(true)}
              className="btn-secondary text-sm"
            >
              + Cargar partido
            </button>
          )}

          {/* Admin: cambiar estado */}
          {isAdmin && nextStatus && (
            <button
              onClick={() => updateStatus.mutate(nextStatus.next)}
              disabled={updateStatus.isPending}
              className="btn-primary text-sm"
            >
              {updateStatus.isPending ? 'Actualizando...' : nextStatus.label}
            </button>
          )}
        </div>
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
                  <span className="text-sm font-bold text-primary-400">{entry.wins * 3} pts</span>
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
              {approvedPlayers.map((reg) => (
                <div key={reg.user.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar src={reg.user.avatarUrl} name={reg.user.name} size="sm" />
                  <p className="font-medium text-white text-sm flex-1">{reg.user.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Inscripciones pendientes (solo admin) */}
        {isAdmin && tournament.status === 'OPEN' && (
          <section>
            <h2 className="text-lg font-semibold text-gray-200 mb-3">
              Solicitudes pendientes
              {tournament.registrations.filter((r) => r.status === 'PENDING').length > 0 && (
                <span className="ml-2 badge-yellow">
                  {tournament.registrations.filter((r) => r.status === 'PENDING').length}
                </span>
              )}
            </h2>
            {tournament.registrations.filter((r) => r.status === 'PENDING').length === 0 ? (
              <div className="card text-center py-6 text-gray-500 text-sm">
                Sin solicitudes pendientes
              </div>
            ) : (
              <div className="card divide-y divide-gray-800">
                {tournament.registrations
                  .filter((r) => r.status === 'PENDING')
                  .map((reg) => (
                    <div key={reg.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <Avatar src={reg.user.avatarUrl} name={reg.user.name} size="sm" />
                      <p className="font-medium text-white text-sm flex-1">{reg.user.name}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            tournamentsService
                              .approveRegistration(tournament.id, reg.id)
                              .then(() => qc.invalidateQueries({ queryKey: ['tournament', id] }))
                          }
                          className="btn-primary text-xs px-2.5 py-1"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() =>
                            tournamentsService
                              .rejectRegistration(tournament.id, reg.id)
                              .then(() => qc.invalidateQueries({ queryKey: ['tournament', id] }))
                          }
                          className="btn-danger text-xs px-2.5 py-1"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Partidos */}
      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">Partidos</h2>
        {!tournament.matches?.length ? (
          <p className="text-gray-500 text-sm">No hay partidos cargados todavía.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {tournament.matches.map((match) => (
              <div key={match.id} className="space-y-1">
                <MatchCard match={match} />
                {isAdmin && match.status === 'SCHEDULED' && (
                  <button
                    onClick={() => setMatchToFinish(match)}
                    className="btn-secondary text-xs w-full"
                  >
                    Cargar resultado
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      {showCreateMatch && (
        <CreateMatchModal
          tournamentId={tournament.id}
          players={approvedPlayers}
          onClose={() => setShowCreateMatch(false)}
        />
      )}
      {matchToFinish && (
        <FinishMatchModal
          match={matchToFinish}
          players={approvedPlayers}
          tournamentId={tournament.id}
          onClose={() => setMatchToFinish(null)}
        />
      )}
    </div>
  )
}
