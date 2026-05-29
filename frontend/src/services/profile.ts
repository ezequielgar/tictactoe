import { api } from './api'
import type { UserProfile } from '@/types'

export const profileService = {
  get: () => api.get<UserProfile>('/profile').then((r) => r.data),

  update: (data: { displayName?: string; favoriteTeam?: string }) =>
    api.patch<UserProfile>('/profile', data).then((r) => r.data),

  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    return api.post<{ id: string; avatarUrl: string }>('/profile/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },
}
