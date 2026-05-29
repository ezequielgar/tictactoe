import { prisma } from '../../config/database'
import { getPlayerStats } from '../fifa/stats/stats.service'
import { z } from 'zod' 

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  favoriteTeam: z.string().max(50).optional(),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      displayName: true,
      avatarUrl: true,
      favoriteTeam: true,
      role: true,
      createdAt: true,
    },
  })
  if (!user) return null

  const stats = await getPlayerStats(userId)

  return { ...user, stats }
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      displayName: input.displayName,
      favoriteTeam: input.favoriteTeam,
    },
    select: {
      id: true,
      email: true,
      name: true,
      displayName: true,
      avatarUrl: true,
      favoriteTeam: true,
      role: true,
    },
  })
}

export async function updateAvatar(userId: string, avatarUrl: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
    select: { id: true, avatarUrl: true },
  })
}
