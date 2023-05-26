import type { Logs } from '@prisma/client'
import { prisma } from '../utils/bd'
import { cache } from 'react'

const newLog = async (data: Logs) => {
    try {
        const protocol = await prisma.logs.create({
            data,
        })
        return protocol
    } catch (e) {
        return null
    }
}

const getLogs = cache(async () => {
    try {
        return await prisma.logs.findMany()
    } catch (e) {
        return null
    }
})

export { newLog, getLogs }
