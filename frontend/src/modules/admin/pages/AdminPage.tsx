import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from '@/services/users'
import { Avatar } from '@/components/ui/Avatar'
import { Spinner } from '@/components/ui/Spinner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function AdminPage() {
  const qc = useQueryClient()
  const { data: pending = [], isLoading } = useQuery({
    queryKey: ['users', 'pending'],
    queryFn: usersService.getPending,
  })

  const approve = useMutation({
    mutationFn: (id: string) => usersService.updateRole(id, 'PLAYER'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  const reject = useMutation({
    mutationFn: (id: string) => usersService.updateRole(id, 'PENDING'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Panel de Administración</h1>

      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">
          Solicitudes pendientes
          {pending.length > 0 && (
            <span className="ml-2 badge-yellow">{pending.length}</span>
          )}
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : pending.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">
            No hay solicitudes pendientes.
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((user) => (
              <div key={user.id} className="card flex items-center gap-4">
                <Avatar src={user.avatarUrl} name={user.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{user.name}</p>
                  <p className="text-sm text-gray-400 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {format(new Date(user.createdAt), "d MMM yyyy", { locale: es })}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => approve.mutate(user.id)}
                    disabled={approve.isPending}
                    className="btn-primary text-xs px-3 py-1.5"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => reject.mutate(user.id)}
                    disabled={reject.isPending}
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
