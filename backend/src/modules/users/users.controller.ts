import type { Request, Response } from 'express'
import { z } from 'zod'
import { getAllUsers, getPendingUsers, updateUserRole, getUserById } from './users.service'
import type { Role } from '@prisma/client'

const UpdateRoleSchema = z.object({
  role: z.enum(['PLAYER', 'ADMIN', 'PENDING']),
})

export async function listUsers(_req: Request, res: Response): Promise<void> {
  const users = await getAllUsers()
  res.json(users)
}

export async function listPendingUsers(_req: Request, res: Response): Promise<void> {
  const users = await getPendingUsers()
  res.json(users)
}

export async function approveUser(req: Request, res: Response): Promise<void> {
  const parsed = UpdateRoleSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid role', errors: parsed.error.flatten().fieldErrors })
    return
  }
  const user = await updateUserRole(req.params.id, parsed.data.role as Role)
  res.json(user)
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const user = await getUserById(req.params.id)
  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }
  res.json(user)
}
