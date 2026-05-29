import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { matchesService } from '@/services/fifa'
import type { Match, Registration } from '@/types'

interface Props {
  match: Match
  players: Registration[]
  tournamentId: string
  onClose: () => void
}

export function FinishMatchModal({ match, players, tournamentId, onClose }: Props) {
  const qc = useQueryClient()
  const [p1Goals, setP1Goals] = useState(0)
  const [p2Goals, setP2Goals] = useState(0)

  const p1Name =
    players.find((p) => p.user.id === match.player1Id)?.user.name ?? 'Jugador 1'
  const p2Name =
    players.find((p) => p.user.id === match.player2Id)?.user.name ?? 'Jugador 2'

  const finish = useMutation({
    mutationFn: () =>
      matchesService.finish(match.id, {
        player1Goals: p1Goals,
        player2Goals: p2Goals,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tournament', tournamentId] })
      qc.invalidateQueries({ queryKey: ['ranking', tournamentId] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Cargar resultado</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 text-center space-y-2">
            <p className="text-sm font-medium text-gray-300 truncate">{p1Name}</p>
            <input
              type="number"
              min={0}
              max={99}
              className="input text-center text-3xl font-bold h-16 px-2"
              value={p1Goals}
              onChange={(e) => setP1Goals(Math.max(0, Number(e.target.value)))}
            />
          </div>
          <span className="text-gray-600 font-bold text-xl shrink-0">–</span>
          <div className="flex-1 text-center space-y-2">
            <p className="text-sm font-medium text-gray-300 truncate">{p2Name}</p>
            <input
              type="number"
              min={0}
              max={99}
              className="input text-center text-3xl font-bold h-16 px-2"
              value={p2Goals}
              onChange={(e) => setP2Goals(Math.max(0, Number(e.target.value)))}
            />
          </div>
        </div>

        {p1Goals === p2Goals && (
          <p className="text-xs text-yellow-400 text-center">
            ⚠️ Empate — no se asignará ganador
          </p>
        )}

        {finish.isError && (
          <p className="text-sm text-red-400 text-center">
            Error al cargar el resultado. Intentá de nuevo.
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button
            onClick={() => finish.mutate()}
            className="btn-primary"
            disabled={finish.isPending}
          >
            {finish.isPending ? 'Guardando...' : 'Confirmar resultado'}
          </button>
        </div>
      </div>
    </div>
  )
}
