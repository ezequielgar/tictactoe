import { prisma } from '../../config/database'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../config/jwt'
import type { User } from '@prisma/client'

export function generateTokens(user: User) {
  const payload = { userId: user.id, role: user.role }
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  }
}

export async function refreshTokens(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken)
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) throw new Error('User not found')
  return generateTokens(user)
}

export async function getMe(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, avatarUrl: true, role: true, createdAt: true },
  })
}
