'use server'

import { Action, type Logs } from '@prisma/client'
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
        budget: {
          select: {
            budgetItems: true,
            budgetTeamMembers: true,
            state: true,
            id: true,
            AcademicUnits: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return result
  } catch (error) {
    console.log(error)
    return null
  }
})

const updateLogsBudgetIdOnProtocolReactivation = cache(
  async (protocolId: string, newBudgetId: string) => {
    try {
      const result = await prisma.logs.updateMany({
        where: {
          protocolId,
          OR: [
            { action: Action.REACTIVATE },
            { action: Action.APPROVE },
            { action: Action.DISCONTINUE },
          ],
        },
        data: { budgetId: newBudgetId },
      })

      return result
    } catch (e) {
      return null
    }
  }
)

export { logEvent, getLogs, updateLogsBudgetIdOnProtocolReactivation }
