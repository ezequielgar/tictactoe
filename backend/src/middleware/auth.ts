import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../config/jwt'
import { prisma } from '../config/database'

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string; name: string }
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.access_token as string | undefined
    if (!token) {
      res.status(401).json({ message: 'Not authenticated' })
      return
    }

    const payload = verifyAccessToken(token)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, email: true, name: true },
    })

    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }

    if (user.role === 'PENDING') {
      res.status(403).json({ message: 'Account pending approval' })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
