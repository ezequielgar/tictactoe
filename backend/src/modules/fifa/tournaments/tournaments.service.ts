import { prisma } from '../../../config/database'
import type { TournamentType, MatchFormat, TournamentStatus } from '@prisma/client'
import { z } from 'zod'

export const CreateTournamentSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['LEAGUE', 'CUP', 'FRIENDLY']),
  format: z.enum(['ONE_VS_ONE', 'TWO_VS_TWO', 'MIXED']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export const UpdateTournamentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['DRAFT', 'OPEN', 'IN_PROGRESS', 'FINISHED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export type CreateTournamentInput = z.infer<typeof CreateTournamentSchema>
export type UpdateTournamentInput = z.infer<typeof UpdateTournamentSchema>

export async function getTournaments() {
  return prisma.tournament.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { registrations: true, matches: true } },
    },
  })
}

export async function getTournamentById(id: string) {
  return prisma.tournament.findUnique({
    where: { id },
    include: {
      registrations: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { registeredAt: 'asc' as const },
      },
      matches: {
        orderBy: { scheduledAt: 'desc' },
        include: { playerStats: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } } },
      },
      _count: { select: { registrations: true, matches: true } },
    },
  })
}

export async function createTournament(input: CreateTournamentInput, createdById: string) {
  return prisma.tournament.create({
    data: {
      name: input.name,
      description: input.description,
      type: input.type as TournamentType,
      format: input.format as MatchFormat,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      createdById,
    },
  })
}

export async function updateTournament(id: string, input: UpdateTournamentInput) {
  return prisma.tournament.update({
    where: { id },
    data: {
      ...input,
      status: input.status as TournamentStatus | undefined,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
    },
  })
}

export async function registerToTournament(tournamentId: string, userId: string) {
  return prisma.userTournamentRegistration.create({
    data: { tournamentId, userId },
  })
}

export async function approveRegistration(registrationId: string, approvedById: string) {
  return prisma.userTournamentRegistration.update({
    where: { id: registrationId },
    data: { status: 'APPROVED', approvedAt: new Date(), approvedById },
  })
}

export async function rejectRegistration(registrationId: string) {
  return prisma.userTournamentRegistration.update({
    where: { id: registrationId },
    data: { status: 'REJECTED' },
  })
}
