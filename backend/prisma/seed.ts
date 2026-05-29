import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // El seed del Prode (partidos del Mundial 2026) se agregará aquí
  // cuando FIFA publique el fixture oficial.
  // Por ahora solo creamos datos de prueba mínimos.

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
