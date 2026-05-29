import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Match } from '@/types'

const STATUS_BADGE: Record<Match['status'], string> = {
  SCHEDULED: 'badge-blue',
  IN_PROGRESS: 'badge-yellow',
  FINISHED: 'badge-green',
  CANCELLED: 'badge-gray',
}

const STATUS_LABEL: Record<Match['status'], string> = {
  SCHEDULED: 'Programado',
  IN_PROGRESS: 'En juego',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado',
}

export function MatchCard({ match }: { match: Match }) {
  const [p1, p2] = match.playerStats ?? []

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className={STATUS_BADGE[match.status]}>{STATUS_LABEL[match.status]}</span>
        {match.playedAt && (
          <span className="text-xs text-gray-500">
            {format(new Date(match.playedAt), "d MMM yyyy", { locale: es })}
          </span>
        )}
        {match.scheduledAt && match.status === 'SCHEDULED' && (
          <span className="text-xs text-gray-500">
            {format(new Date(match.scheduledAt), "d MMM yyyy HH:mm", { locale: es })}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-center">
          <p className="font-medium text-white text-sm truncate">{p1?.user?.name ?? '—'}</p>
          {p1?.isWinner && <span className="text-xs text-yellow-400">👑 Ganador</span>}
        </div>

        <div className="text-center shrink-0">
          {match.status === 'FINISHED' ? (
            <span className="text-2xl font-bold text-white">
              {p1?.goals ?? 0} – {p2?.goals ?? 0}
            </span>
          ) : (
            <span className="text-gray-500 text-sm">vs</span>
          )}
        </div>

        <div className="flex-1 text-center">
          <p className="font-medium text-white text-sm truncate">{p2?.user?.name ?? '—'}</p>
          {p2?.isWinner && <span className="text-xs text-yellow-400">👑 Ganador</span>}
        </div>
      </div>
    </div>
  )
}
