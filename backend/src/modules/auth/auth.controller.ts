import type { Request, Response } from 'express'
import passport from 'passport'
import { generateTokens, refreshTokens, getMe } from './auth.service'
import type { AuthRequest } from '../../middleware/auth'
import { logger } from '../../shared/logger'
import type { User } from '@prisma/client'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
}

export function googleLogin(req: Request, res: Response) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res)
}

export function googleCallback(req: Request, res: Response) {
  passport.authenticate('google', { session: false }, (err: Error, user: User) => {
    if (err || !user) {
      logger.error('Google OAuth error', err)
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`)
    }

    const { accessToken, refreshToken } = generateTokens(user)

    res
      .cookie('access_token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 })
      .cookie('refresh_token', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 })

    const redirect =
      user.role === 'PENDING'
        ? `${process.env.FRONTEND_URL}/waiting-approval`
        : user.role === 'ADMIN'
          ? `${process.env.FRONTEND_URL}/admin`
          : `${process.env.FRONTEND_URL}/dashboard`

    return res.redirect(redirect)
  })(req, res)
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies?.refresh_token as string | undefined
    if (!token) {
      res.status(401).json({ message: 'No refresh token' })
      return
    }
    const { accessToken, refreshToken } = await refreshTokens(token)
    res
      .cookie('access_token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 })
      .cookie('refresh_token', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json({ message: 'Tokens refreshed' })
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}

export function logout(_req: Request, res: Response): void {
  res
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .json({ message: 'Logged out' })
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  const user = await getMe(req.user!.id)
  res.json(user)
}
