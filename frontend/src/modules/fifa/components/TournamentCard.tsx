import { Link } from 'react-router-dom'
import type { Tournament } from '@/types'

const STATUS_LABEL: Record<Tournament['status'], string> = {
  DRAFT: 'Borrador',
  OPEN: 'Inscripciones abiertas',
  IN_PROGRESS: 'En curso',
  FINISHED: 'Finalizado',
}

const STATUS_BADGE: Record<Tournament['status'], string> = {
  DRAFT: 'badge-gray',
  OPEN: 'badge-blue',
  IN_PROGRESS: 'badge-green',
  FINISHED: 'badge-gray',
}

const FORMAT_LABEL: Record<Tournament['format'], string> = {
  ONE_VS_ONE: '1v1',
  TWO_VS_TWO: '2v2',
  MIXED: 'Mixto',
}

const TYPE_LABEL: Record<Tournament['type'], string> = {
  LEAGUE: 'Liga',
  CUP: 'Copa',
  FRIENDLY: 'Amistoso',
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <Link to={`/tournaments/${tournament.id}`} className="card block hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-white truncate">{tournament.name}</h3>
        <span className={STATUS_BADGE[tournament.status]}>{STATUS_LABEL[tournament.status]}</span>
      </div>

      {tournament.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{tournament.description}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>{TYPE_LABEL[tournament.type]}</span>
        <span>·</span>
        <span>{FORMAT_LABEL[tournament.format]}</span>
        {tournament._count && (
          <>
            <span>·</span>
            <span>{tournament._count.registrations} jugadores</span>
            <span>·</span>
            <span>{tournament._count.matches} partidos</span>
          </>
        )}
      </div>
    </Link>
  )
}
