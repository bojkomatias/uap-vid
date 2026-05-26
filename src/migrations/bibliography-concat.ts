import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'
import { chartToBibliographyHtml } from '../utils/bibliography'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

// One-shot migration: populate `sections.bibliography.content` from the
// legacy `sections.bibliography.chart` entries. Leaves `chart` untouched as a
// data archive in case the new field needs to be regenerated.
const migrate = async () => {
  const prisma = new PrismaClient()
  const protocols = await prisma.protocol.findMany()

  console.log(`Processing ${protocols.length} protocols...`)

  const updates = protocols
    .map((protocol) => {
      const bibliography = protocol.sections.bibliography
      const alreadyMigrated =
        typeof bibliography.content === 'string' &&
        bibliography.content.trim().length > 0
      if (alreadyMigrated) return null

      const content = chartToBibliographyHtml(bibliography.chart)
      if (!content) return null

      return {
        id: protocol.id,
        sections: {
          ...protocol.sections,
          bibliography: {
            chart: bibliography.chart,
            content,
          },
        },
      }
    })
    .filter((u): u is NonNullable<typeof u> => u !== null)

  console.log(
    `Updating ${updates.length} protocols (skipped ${protocols.length - updates.length})...`
  )

  await prisma.$transaction(
    async (tx) => {
      for (const update of updates) {
        await tx.protocol.update({
          where: { id: update.id },
          data: { sections: update.sections },
        })
      }
    },
    { timeout: 10000 * 60 * 60 }
  )

  console.log('Done.')
  await prisma.$disconnect()
}

migrate()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => process.exit(0))
