import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import path from 'path'
import { configurePassport } from './config/passport'
import { errorHandler } from './middleware/errorHandler'
import authRouter from './modules/auth/auth.router'
import usersRouter from './modules/users/users.router'
import tournamentsRouter from './modules/fifa/tournaments/tournaments.router'
import matchesRouter from './modules/fifa/matches/matches.router'
import statsRouter from './modules/fifa/stats/stats.router'
import profileRouter from './modules/profile/profile.router'

configurePassport()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

// Servir imágenes de avatares subidos
const UPLOADS_DIR = process.env.UPLOADS_DIR ?? '/app/uploads/avatars'
app.use('/uploads/avatars', express.static(path.resolve(UPLOADS_DIR)))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/profile', profileRouter)
app.use('/api/tournaments', tournamentsRouter)
app.use('/api/matches', matchesRouter)
app.use('/api/stats', statsRouter)

app.use(errorHandler)

export default app
