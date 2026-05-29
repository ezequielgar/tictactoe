import 'dotenv/config'
import app from './app'
import { connectDatabase } from './config/database'
import { logger } from './shared/logger'

const PORT = Number(process.env.PORT) || 4000

async function bootstrap() {
  await connectDatabase()
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`)
  })
}

bootstrap()
