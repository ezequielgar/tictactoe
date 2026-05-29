import { api } from './api'
import type { User } from '@/types'

export const usersService = {
  list: () => api.get<User[]>('/users').then((r) => r.data),
  getPending: () => api.get<User[]>('/users/pending').then((r) => r.data),
  getById: (id: string) => api.get<User>(`/users/${id}`).then((r) => r.data),
  updateRole: (id: string, role: string) =>
    api.patch<User>(`/users/${id}/role`, { role }).then((r) => r.data),
}
