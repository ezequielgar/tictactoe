import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profile'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/ui/Spinner'
import { Avatar } from '@/components/ui/Avatar'

const TEAM_OPTIONS = [
  'River Plate', 'Boca Juniors', 'Racing Club', 'Independiente',
  'San Lorenzo', 'Huracán', 'Vélez Sársfield', 'Estudiantes',
  'Talleres', 'Newell\'s', 'Rosario Central', 'Otro',
]

export function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const qc = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [form, setForm] = useState({ displayName: '', favoriteTeam: '' })
  const [editing, setEditing] = useState(false)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.get,
  })

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName ?? profile.name,
        favoriteTeam: profile.favoriteTeam ?? '',
      })
    }
  }, [profile])

  const updateProfile = useMutation({
    mutationFn: profileService.update,
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      qc.invalidateQueries({ queryKey: ['me'] })
      setUser({ ...user!, ...updated })
      setEditing(false)
    },
  })

  const uploadAvatar = useMutation({
    mutationFn: profileService.uploadAvatar,
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      qc.invalidateQueries({ queryKey: ['me'] })
      setUser({ ...user!, avatarUrl: updated.avatarUrl })
      setAvatarPreview(null)
    },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Preview local
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
    // Subir inmediatamente
    uploadAvatar.mutate(file)
  }

  if (isLoading || !profile) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  const displayName = profile.displayName ?? profile.name
  const stats = profile.stats

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>

      {/* Card avatar + info */}
      <div className="card flex items-center gap-5">
        {/* Avatar con botón de cambio */}
        <div className="relative shrink-0">
          <div
            className="cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="preview"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <Avatar src={profile.avatarUrl} name={displayName} size="lg" />
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {uploadAvatar.isPending ? '...' : '📷'}
              </span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xl font-bold text-white truncate">{displayName}</p>
          <p className="text-sm text-gray-400">{profile.email}</p>
          {profile.favoriteTeam && (
            <p className="text-sm text-gray-400 mt-0.5">⚽ {profile.favoriteTeam}</p>
          )}
          <p className="text-xs text-gray-600 mt-1 capitalize">{profile.role.toLowerCase()}</p>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className="btn-secondary text-sm shrink-0"
        >
          {editing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {/* Form edición */}
      {editing && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-white">Editar información</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre a mostrar
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              className="input"
              placeholder="¿Cómo querés que te vean los demás?"
              maxLength={50}
            />
            <p className="text-xs text-gray-600 mt-1">
              Tu nombre de Google es <span className="text-gray-400">{profile.name}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Equipo favorito
            </label>
            <select
              value={form.favoriteTeam}
              onChange={(e) => setForm({ ...form, favoriteTeam: e.target.value })}
              className="input"
            >
              <option value="">Sin seleccionar</option>
              {TEAM_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => updateProfile.mutate({
              displayName: form.displayName || undefined,
              favoriteTeam: form.favoriteTeam || undefined,
            })}
            disabled={updateProfile.isPending}
            className="btn-primary w-full"
          >
            {updateProfile.isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Mis estadísticas globales</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatBox label="Partidos" value={stats.matchesPlayed} />
            <StatBox label="Victorias" value={stats.wins} color="text-green-400" />
            <StatBox label="Derrotas" value={stats.losses} color="text-red-400" />
            <StatBox label="Goles" value={stats.goalsScored} color="text-yellow-400" />
            <StatBox label="% Victorias" value={`${stats.winRate}%`} color="text-primary-400" />
            <StatBox label="Goles/partido" value={stats.goalsPerMatch} />
          </div>
        </div>
      )}

      {stats?.matchesPlayed === 0 && (
        <p className="text-center text-gray-500 text-sm">
          Todavía no jugaste ningún partido registrado.
        </p>
      )}
    </div>
  )
}

function StatBox({ label, value, color = 'text-white' }: {
  label: string
  value: string | number
  color?: string
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}
