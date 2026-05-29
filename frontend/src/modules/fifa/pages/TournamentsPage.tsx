import { useQuery } from '@tanstack/react-query'
import { tournamentsService } from '@/services/fifa'
import { TournamentCard } from '../components/TournamentCard'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuthStore } from '@/store/authStore'
import { Link } from 'react-router-dom'

export function TournamentsPage() {
  const { user } = useAuthStore()
  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: tournamentsService.list,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Torneos</h1>
        <div className="flex gap-2">
          <Link to="/head-to-head" className="btn-secondary text-sm">
            Head to Head
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/tournaments/new" className="btn-primary text-sm">
              + Nuevo torneo
            </Link>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : tournaments.length === 0 ? (
        <EmptyState
          title="No hay torneos todavía"
          description="El administrador creará el primer torneo pronto."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </div>
  )
}
