import { prisma } from '../../config/database'
import type { Role } from '@prisma/client'

export async function getAllUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, name: true, avatarUrl: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getPendingUsers() {
  return prisma.user.findMany({
    where: { role: 'PENDING' },
    select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
}

export async function updateUserRole(userId: string, role: Role) {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, email: true, name: true, role: true },
  })
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, avatarUrl: true, role: true, createdAt: true },
  })
}
