import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { matchesService } from '@/services/fifa'
import type { Registration } from '@/types'

interface Props {
  tournamentId: string
  players: Registration[]
  onClose: () => void
}

export function CreateMatchModal({ tournamentId, players, onClose }: Props) {
  const qc = useQueryClient()
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')

  const create = useMutation({
    mutationFn: () =>
      matchesService.create({
        tournamentId,
        player1Id,
        player2Id,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tournament', tournamentId] })
      onClose()
    },
  })

  const canSubmit = player1Id && player2Id && player1Id !== player2Id

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Nuevo partido</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Jugador 1</label>
          <select
            className="input"
            value={player1Id}
            onChange={(e) => setPlayer1Id(e.target.value)}
          >
            <option value="">Seleccionar jugador...</option>
            {players.map((r) => (
              <option key={r.user.id} value={r.user.id} disabled={r.user.id === player2Id}>
                {r.user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Jugador 2</label>
          <select
            className="input"
            value={player2Id}
            onChange={(e) => setPlayer2Id(e.target.value)}
          >
            <option value="">Seleccionar jugador...</option>
            {players.map((r) => (
              <option key={r.user.id} value={r.user.id} disabled={r.user.id === player1Id}>
                {r.user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Fecha y hora (opcional)
          </label>
          <input
            type="datetime-local"
            className="input"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>

        {create.isError && (
          <p className="text-sm text-red-400">Error al crear el partido. Intentá de nuevo.</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button
            onClick={() => create.mutate()}
            className="btn-primary"
            disabled={!canSubmit || create.isPending}
          >
            {create.isPending ? 'Creando...' : 'Crear partido'}
          </button>
        </div>
      </div>
    </div>
  )
}
