import { PrismaClient, Role } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'
import { createHashScrypt } from '../utils/hash'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

const SEED_PASSWORD = '123456'

const users: { email: string; name: string; role: Role }[] = [
  { email: 'admin@local.test', name: 'Admin Local', role: 'ADMIN' },
  { email: 'secretary@local.test', name: 'Secretario Local', role: 'SECRETARY' },
  { email: 'methodologist@local.test', name: 'Metodólogo Local', role: 'METHODOLOGIST' },
  { email: 'scientist@local.test', name: 'Científico Local', role: 'SCIENTIST' },
  { email: 'researcher@local.test', name: 'Investigador Local', role: 'RESEARCHER' },
  { email: 'researcher2@local.test', name: 'Investigadora Adjunta', role: 'RESEARCHER' },
]

const seed = async () => {
  const prisma = new PrismaClient()
  const passwordHash = await createHashScrypt(SEED_PASSWORD)

  console.log(`Seeding ${users.length} users (password: "${SEED_PASSWORD}")...`)

  let created = 0
  let updated = 0

  for (const user of users) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } })
    if (existing) {
      await prisma.user.update({
        where: { email: user.email },
        data: {
          name: user.name,
          role: user.role,
          password: passwordHash,
        },
      })
      updated++
      console.log(`  updated  ${user.email}  (${user.role})`)
    } else {
      await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          role: user.role,
          password: passwordHash,
        },
      })
      created++
      console.log(`  created  ${user.email}  (${user.role})`)
    }
  }

  console.log(`Done. ${created} created, ${updated} updated.`)
  await prisma.$disconnect()
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => process.exit(0))
