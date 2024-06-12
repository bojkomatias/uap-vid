import { PrismaClient } from '@prisma/client'

const prisma: Promise<PrismaClient> = new Promise((resolve) => {
    const prisma = new PrismaClient()
    resolve(prisma)
})

export default prisma
