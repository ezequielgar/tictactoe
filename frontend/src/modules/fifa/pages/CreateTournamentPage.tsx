import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tournamentsService } from '@/services/fifa'
import type { TournamentType, MatchFormat } from '@/types'

export function CreateTournamentPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'LEAGUE' as TournamentType,
    format: 'ONE_VS_ONE' as MatchFormat,
    startDate: '',
    endDate: '',
  })

  const create = useMutation({
    mutationFn: () =>
      tournamentsService.create({
        name: form.name,
        description: form.description || undefined,
        type: form.type,
        format: form.format,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      }),
    onSuccess: (tournament) => {
      qc.invalidateQueries({ queryKey: ['tournaments'] })
      navigate(`/tournaments/${tournament.id}`)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    create.mutate()
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 mb-4 block">
        ← Torneos
      </Link>
      <h1 className="text-2xl font-bold text-white mb-6">Nuevo Torneo</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nombre <span className="text-red-400">*</span>
          </label>
          <input
            className="input"
            placeholder="Ej: Liga Verano 2025"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
          <textarea
            className="input resize-none"
            rows={3}
            placeholder="Descripción opcional..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as TournamentType }))}
            >
              <option value="LEAGUE">Liga</option>
              <option value="CUP">Copa</option>
              <option value="FRIENDLY">Amistoso</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Formato</label>
            <select
              className="input"
              value={form.format}
              onChange={(e) => setForm((f) => ({ ...f, format: e.target.value as MatchFormat }))}
            >
              <option value="ONE_VS_ONE">1 vs 1</option>
              <option value="TWO_VS_TWO">2 vs 2</option>
              <option value="MIXED">Mixto</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha inicio</label>
            <input
              type="date"
              className="input"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha fin</label>
            <input
              type="date"
              className="input"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            />
          </div>
        </div>

        {create.isError && (
          <p className="text-sm text-red-400">Error al crear el torneo. Intentá de nuevo.</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/dashboard" className="btn-secondary">
            Cancelar
          </Link>
          <button
            type="submit"
            className="btn-primary"
            disabled={create.isPending || !form.name.trim()}
          >
            {create.isPending ? 'Creando...' : 'Crear torneo'}
          </button>
        </div>
      </form>
    </div>
  )
}
