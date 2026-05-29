import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/auth'
import { useQueryClient } from '@tanstack/react-query'
import { Avatar } from '@/components/ui/Avatar'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const qc = useQueryClient()

  async function handleLogout() {
    await authService.logout()
    logout()
    qc.clear()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-white">
          <span className="text-xl">⚽</span>
          <span className="hidden sm:inline">TicTacToe Hub</span>
        </Link>

        <nav className="flex items-center gap-1">
          {user?.role !== 'PENDING' && (
            <>
              <Link
                to="/dashboard"
                className="rounded-lg px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                Torneos
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="rounded-lg px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Admin
                </Link>
              )}
            </>
          )}

          {user && (
            <div className="ml-2 flex items-center gap-2">
              <Link to="/profile" className="rounded-full hover:ring-2 hover:ring-primary-500 transition-all">
                <Avatar src={user.avatarUrl} name={user.displayName ?? user.name} size="sm" />
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                Salir
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
