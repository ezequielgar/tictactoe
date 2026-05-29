import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/auth'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

export function WaitingApprovalPage() {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()
  const qc = useQueryClient()

  async function handleLogout() {
    await authService.logout()
    logout()
    qc.clear()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-white mb-2">Pendiente de aprobación</h1>
        <p className="text-gray-400 mb-2">
          Tu cuenta fue creada correctamente, {user?.name?.split(' ')[0]}.
        </p>
        <p className="text-gray-400 mb-8">
          El administrador revisará tu solicitud y te dará acceso pronto.
        </p>
        <button onClick={handleLogout} className="btn-secondary">
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
