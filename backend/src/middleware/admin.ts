import type { Response, NextFunction } from 'express'
import type { AuthRequest } from './auth'

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ message: 'Admin access required' })
    return
  }
  next()
}
