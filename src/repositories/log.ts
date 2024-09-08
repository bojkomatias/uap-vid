'use server'

import type { Logs } from '@prisma/client'
import { prisma } from '../utils/bd'
import { cache } from 'react'

const logEvent = async (data: Omit<Logs, 'id' | 'createdAt'>) => {
  try {
    const log = await prisma.logs.create({
      data,
    })
    return log
  } catch (e) {
    return null
  }
}

const getLogs = cache(async (search: { [key: string]: string }) => {
  try {
    const result = await prisma.logs.findMany({
      where: search,
      include: {
        user: { select: { name: true } },
        reviewer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    console.log(result)
    return result
  } catch (e) {
    return null
  }
})

const getLogsByProtocolId = cache(async (protocolId: string) => {
  try {
    return await prisma.logs.findMany({
      where: { protocolId },
      include: { user: true },
    })
  } catch (e) {
    return null
  }
})

export { logEvent, getLogs, getLogsByProtocolId }
