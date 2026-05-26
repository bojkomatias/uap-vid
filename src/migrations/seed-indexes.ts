import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

const indexes: { unit: 'FCA' | 'FMR'; price: number }[] = [
  { unit: 'FCA', price: 1_000_000 },
  { unit: 'FMR', price: 1_300_000 },
]

const seed = async () => {
  const prisma = new PrismaClient()
  const now = new Date()

  console.log(`Seeding ${indexes.length} indexes...`)

  let created = 0
  let skipped = 0

  for (const idx of indexes) {
    const existing = await prisma.index.findFirst({ where: { unit: idx.unit } })
    if (existing) {
      skipped++
      console.log(`  skipped  ${idx.unit}  (already exists, latest price: ${existing.values.at(-1)?.price})`)
      continue
    }
    await prisma.index.create({
      data: {
        unit: idx.unit,
        values: [{ from: now, to: null, price: idx.price }],
      },
    })
    created++
    console.log(`  created  ${idx.unit}  (price: ${idx.price.toLocaleString('es-AR')})`)
  }

  console.log(`Done. ${created} created, ${skipped} skipped.`)
  await prisma.$disconnect()
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => process.exit(0))
