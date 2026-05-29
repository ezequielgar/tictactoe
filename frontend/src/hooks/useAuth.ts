import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, isLoading, setUser, setLoading } = useAuthStore()

  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (!queryLoading) {
      setUser(data ?? null)
    } else {
      setLoading(true)
    }
  }, [data, queryLoading, setUser, setLoading])

  return { user, isLoading: isLoading || queryLoading }
}
