import { authService } from '@/services/auth'

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-3xl font-bold text-white">TicTacToe Hub</h1>
          <p className="mt-2 text-gray-400">Gestión de campeonatos y estadísticas</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-1">Bienvenido</h2>
          <p className="text-sm text-gray-400 mb-6">
            Iniciá sesión con tu cuenta de Google para acceder a la plataforma.
          </p>

          <a
            href={authService.googleLoginUrl()}
            className="btn-primary w-full gap-3"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Continuar con Google
          </a>

          <p className="mt-4 text-center text-xs text-gray-500">
            El acceso requiere aprobación del administrador.
          </p>
        </div>
      </div>
    </div>
  )
}
