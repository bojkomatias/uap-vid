'use server'


import { prisma } from '../utils/bd'
import type {
  Action,
  ProtocolFlag,
  ProtocolSectionsIdentificationTeam,
  TeamMember,
} from '@prisma/client'
import { type Protocol, ProtocolState } from '@prisma/client'
import { cache } from 'react'
import { getAcademicUnitsByUserId } from './academic-unit'
import { orderByQuery } from '@utils/query-helper/orderBy'
import { Prisma, Role } from '@prisma/client'
import { IdentificationTeamSchema } from '@utils/zod'
import { getCurrentIndexes } from './finance-index'
import { logEvent } from './log'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { withLogging } from '@utils/logging'

const getProtocolBudgetData = async (year: string) => {
  // Get latest FCA index
  const latestIndex = await prisma.index.findFirst({
    where: { unit: 'FCA' },
    include: {
      values: true,
    },
  })
  if (!latestIndex?.values.length) throw new Error('No FCA index found')

  // Sort values by date and get the latest one
  const sortedValues = [...latestIndex.values].sort(
    (a, b) => new Date(b.from).getTime() - new Date(a.from).getTime()
  )
  const currentFCA = sortedValues[0].price

  const protocols = await prisma.protocol.findMany({
    where: {
      state: {
        in: [ProtocolState.ACCEPTED, ProtocolState.ON_GOING],
      },
    },
    select: {
      id: true,
      protocolNumber: true,
      createdAt: true,
      state: true,
      sections: {
        select: {
          identification: {
            select: {
              title: true,
              academicUnitIds: true,
              team: {
                select: {
                  name: true,
                  teamMemberId: true,
                  role: true,
                  hours: true,
                  workingMonths: true,
                },
              },
            },
          },
          duration: {
            select: {
              duration: true,
              modality: true,
            },
          },
          budget: {
            select: {
              expenses: true,
            },
          },
        },
      },
    },
  })

  // Get all unique teamMemberIds
  const teamMemberIds = protocols
    .flatMap((p) => p.sections.identification.team)
    .map((t) => t.teamMemberId)
    .filter((id): id is string => id !== null)

  // Get all unique academic unit IDs
  const academicUnitIds = protocols
    .flatMap((p) => p.sections.identification.academicUnitIds || [])
    .filter((id): id is string => id !== null)

  // Fetch team members data
  const teamMembers = await prisma.teamMember.findMany({
    where: {
      id: { in: teamMemberIds },
    },
    include: {
      categories: {
        include: {
          category: {
            select: {
              name: true,
              amountIndex: true,
            },
          },
        },
      },
    },
  })

  // Fetch academic units data
  const academicUnits = await prisma.academicUnit.findMany({
    where: {
      id: { in: academicUnitIds },
    },
    select: {
      id: true,
      name: true,
    },
  })

  // Create maps for quick lookup
  const teamMemberMap = new Map(teamMembers.map((tm) => [tm.id, tm]))
  const academicUnitMap = new Map(academicUnits.map((au) => [au.id, au]))

  // Transform protocols into flattened format
  const flattenedData = protocols.map((protocol) => {
    const teamMembers = protocol.sections.identification.team.map((member) => {
      const teamMember =
        member.teamMemberId ? teamMemberMap.get(member.teamMemberId) : null
      const currentCategory = teamMember?.categories[0]?.category
      const hourlyPrice =
        currentCategory ? currentCategory.amountIndex.FCA * currentFCA : 0
      const totalCost =
        hourlyPrice * (member.hours || 0) * (member.workingMonths || 0) * 4

      return {
        protocolNumber: protocol.protocolNumber,
        name: member.name || teamMember?.name || 'Desconocido',
        role: member.role,
        category: currentCategory?.name || 'Sin categoría',
        hoursAssigned: member.hours || 0,
        workingMonths: member.workingMonths || 12,
        hourlyPrice,
        totalCost,
      }
    })

    // Flatten and filter expenses by year
    const expenses: { name: string; amount: number }[] = []
    const budgetExpenses = protocol.sections.budget?.expenses || []
    budgetExpenses.forEach((expenseType: any) => {
      const type = expenseType.type
      expenseType.data.forEach((expense: any) => {
        if (expense.amount && expense.amount !== 0 && expense.year === year) {
          expenses.push({
            name: `${type}: ${expense.detail}`,
            amount: expense.amount,
          })
        }
      })
    })

    // Get academic unit names
    const academicUnits = (
      protocol.sections.identification.academicUnitIds || []
    ).map((id) => academicUnitMap.get(id)?.name || 'Sin unidad académica')

    // Format year with duration
    const startYear = new Date(protocol.createdAt ?? '').getFullYear() + 1
    const duration = protocol.sections.duration?.duration || 0
    const yearWithDuration = `${startYear} (${duration} meses)`

    return {
      projectTitle: protocol.sections.identification.title,
      academicUnits:
        academicUnits.length > 0 ? academicUnits : ['Sin unidad académica'],
      teamMembers,
      expenses,
      createdAt: protocol.createdAt,
      state: protocol.state,
      yearWithDuration,
    }
  })

  return flattenedData
}
const findProtocolByIdWithResearcher = cache(
  withLogging(
    'findProtocolByIdWithResearcher',
    async (id: string) =>
      await prisma.protocol.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          createdAt: true,
          protocolNumber: true,
          state: true,
          researcherId: true,
          convocatoryId: true,
          anualBudgetIds: true,
          sections: true,
          researcher: { select: { id: true, name: true, email: true } },
          convocatory: { select: { id: true, name: true } },
          anualBudgets: {
            select: { createdAt: true, year: true, id: true, state: true },
          },
          flags: true,
        },
      })
  )
)

const getProtocolMetadata = cache(
  async (id: string) =>
    await prisma.protocol.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        protocolNumber: true,
        createdAt: true,
        state: true,
        flags: true,
        convocatory: { select: { id: true, name: true } },
        researcher: {
          select: { name: true, email: true, id: true, role: true },
        },
        sections: {
          select: { identification: { select: { title: true, team: true } } },
        },
      },
    })
)
const findProtocolById = cache(
    async (id: string) =>
        await prisma.protocol.findUnique({
            where: {
                id,
            },
        })
)

const findProtocolByIdWithBudgets = cache(
  async (id: string) =>
    await prisma.protocol.findUnique({
      where: {
        id,
      },
      include: { anualBudgets: true },
    })
)

const getResearcherEmailByProtocolId = cache(async (id: string) => {
  try {
    return await prisma.protocol.findUnique({
      select: {
        researcher: {
          select: {
            email: true,
          },
        },
      },
      where: {
        id,
      },
    })
  } catch (e) {
    return null
  }
})

// Manage the history of assignments.
const parseIdentificationTeam = (
  team: ProtocolSectionsIdentificationTeam[]
) => {
  const itAssignmentChange = (member: ProtocolSectionsIdentificationTeam) => {
    const assignment = member.assignments?.find((a) => !a.to)
    // If there is no assignment, may be the creation of the protocol.
    if (!assignment) return true
    const hoursChanged = assignment?.hours !== member.hours
    const roleChanged = assignment?.role !== member.role
    const categoryChanged =
      assignment?.categoryToBeConfirmed !== member.categoryToBeConfirmed
    const categoryToBeConfirmedChanged =
      assignment?.categoryToBeConfirmed !== member.categoryToBeConfirmed

    if (
      hoursChanged ||
      roleChanged ||
      categoryChanged ||
      categoryToBeConfirmedChanged
    ) {
      return true
    }
    return false
  }

  const teamWithAssignments = team.map((member) => {
    const newAssignment = {
      role: member.role,
      hours: member.hours && member.hours > 0 ? member.hours : 1,
      categoryToBeConfirmed: member.categoryToBeConfirmed ?? null,
      from: new Date(),
      to: null,
    }

    // If there is no assignment, may be the creation of the protocol.
    if (member.assignments.length === 0) {
      return {
        ...member,
        assignments: [newAssignment],
      }
    }

    if (itAssignmentChange(member)) {
      const lastAssignment = member.assignments.filter((a) => !a.to).at(0)
      return {
        ...member,
        assignments: [{ ...lastAssignment, to: new Date() }, newAssignment],
      }
    }
    return {
      ...member,
    }
  })

  return teamWithAssignments
}

const updateProtocolById = async (id: string, data: Protocol) => {
  try {
    const { currentFCA, currentFMR } = await getCurrentIndexes()

    // Parsing the section to have correct formats
    data.sections.identification.team = IdentificationTeamSchema.array().parse(
      parseIdentificationTeam(data.sections.identification.team)
    )

    // Indexing the amount
    data.sections.budget.expenses.forEach((expenseType) => {
      expenseType.data.forEach((expense) => {
        expense.amount = parseFloat(expense.amount as any)
        expense.amountIndex = {
          FCA: expense.amount / currentFCA,
          FMR: expense.amount / currentFMR,
        }
      })
    })

    data.sections.bibliography.chart.forEach((ref) => {
      ref.year = parseInt(ref.year as any)
    })

    return await prisma.protocol.update({
      where: {
        id,
      },
      data,
    })
  } catch (e) {
    console.log(e)
    return null
  }
}

const updateProtocolStateById = async (
  id: string,
  action: Action,
  previousState: ProtocolState,
  toState: ProtocolState,
  reviewerId?: string,
  budgetId?: string
) => {
  try {
    const session = await getServerSession(authOptions)
    const protocol = await prisma.protocol.update({
      where: {
        id,
      },
      data: {
        state: toState,
      },
      select: {
        id: true,
        state: true,
        sections: { select: { identification: true } },
        researcher: { select: { email: true } },
      },
    })

    await logEvent({
      userId: session!.user.id,
      protocolId: id,
      action,
      previousState,
      message: null,
      budgetId: budgetId ?? null,
      reviewerId: reviewerId ?? null,
    })

    return {
      status: true,
      data: protocol,
      notification: {
        title: 'Estado modificado',
        message: 'El estado del protocolo fue modificado con éxito',
        intent: 'success',
      } as const,
    }
  } catch (e) {
    return {
      status: false,
      notification: {
        title: 'Error',
        message: 'Ocurrio un error al intentar pasar de estado el protocolo',
        intent: 'error',
      } as const,
    }
  }
}

const updateProtocolResearcher = async (id: string, researcherId: string) => {
  try {
    const result = await prisma.protocol.update({
      where: { id },
      data: {
        researcherId,
      },
    })
    return result.researcherId
  } catch (e) {
    return null
  }
}

const updateProtocolTeamMembers = async (
  id: string,
  team: ProtocolSectionsIdentificationTeam[]
) => {
  try {
    const currentProtocol = await prisma.protocol.findUnique({
      where: { id },
      select: { sections: true },
    })

    if (!currentProtocol) {
      throw new Error('Protocol not found')
    }

    const updatedSections = {
      ...currentProtocol.sections,
      identification: {
        ...currentProtocol.sections.identification,
        team,
      },
    }

    const result = await prisma.protocol.update({
      where: { id },
      data: {
        sections: updatedSections,
      },
    })

    return result.researcherId
  } catch (e) {
    console.error('Error updating protocol team members:', e)
  }
}

const updateProtocolConvocatory = async (id: string, convocatory: string) => {
  try {
    return await prisma.protocol.update({
      where: { id },
      data: { convocatoryId: convocatory },
    })
  } catch (error) {
    return null
  }
}

const upsertProtocolFlag = async (
  id: string,
  flag: Omit<ProtocolFlag, 'createdAt'>
) => {
  try {
    const protocol = await prisma.protocol.findFirst({ where: { id } })
    const protocol_flags = protocol?.flags || []

    // Check if the flag already exists
    const existingFlagIndex = protocol_flags.findIndex(
      (f) => f.flagName === flag.flagName
    )

    let updatedFlags
    if (existingFlagIndex !== -1) {
      // Update the existing flag
      updatedFlags = [...protocol_flags]
      updatedFlags[existingFlagIndex] = {
        ...updatedFlags[existingFlagIndex],
        ...flag,
      }
    } else {
      // Add the new flag
      updatedFlags = [...protocol_flags, flag]
    }

    // Update the protocol with the new flags
    const updatedProtocol = await prisma.protocol.update({
      where: { id },
      data: { flags: updatedFlags },
    })

    return updatedProtocol
  } catch (e) {
    console.log(e)
    return null
  }
}

const patchProtocolNumber = async (id: string, protocolNumber: string) =>
  await prisma.protocol.update({
    where: { id },
    data: { protocolNumber },
    select: { protocolNumber: true },
  })

const createProtocol = async (data: Protocol) => {
  try {
    const { currentFCA, currentFMR } = await getCurrentIndexes()

    // Parsing the section to have correct formats
    data.sections.identification.team = IdentificationTeamSchema.array().parse(
      parseIdentificationTeam(data.sections.identification.team)
    )

    // Indexing the amounts
    data.sections.budget.expenses.forEach((expenseType) => {
      expenseType.data.forEach((expense) => {
        expense.amount = parseFloat(expense.amount as any)
        expense.amountIndex = {
          FCA: expense.amount / currentFCA,
          FMR: expense.amount / currentFMR,
        }
      })
    })

    data.sections.bibliography.chart.forEach((ref) => {
      ref.year = parseInt(ref.year as any)
    })

    const protocol = await prisma.protocol.create({
      data,
    })
    return protocol
  } catch (e) {
    console.log(e)
    return null
  }
}

const getAllProtocols = cache(async () => {
  try {
    return await prisma.protocol.findMany()
  } catch (e) {
    return null
  }
})

const getProtocolsByRole = cache(
  async (
    role: Role,
    id: string,
    {
      records = '10',
      page = '1',
      search,
      sort,
      order,
      state,
      unit,
      convocatory,
    }: { [key: string]: string }
  ) => {
    if (!id) throw Error('No ID passed')

    // Pagination reusable
    const [skip, take] = [Number(records) * (Number(page) - 1), Number(records)]
    // Select model reusable
    const select = {
      id: true,
      protocolNumber: true,
      state: true,
      createdAt: true,
      convocatory: { select: { id: true, name: true, year: true } },
      logs: {
        select: {
          user: true,
          id: true,
          createdAt: true,
          message: true,
          userId: true,
          protocol: true,
          protocolId: true,
          budget: true,
          budgetId: true,
          reviewer: true,
          reviewerId: true,
          action: true,
          previousState: true,
        },
      },
      researcher: {
        select: { id: true, name: true, role: true, email: true },
      },
      reviews: {
        select: {
          id: true,
          updatedAt: true,
          type: true,
          verdict: true,
          reviewer: {
            select: {
              id: true,
              name: true,
              role: true,
              email: true,
            },
          },
        },
      },
      sections: {
        select: {
          identification: true,
          duration: { select: { modality: true, duration: true } },
        },
      },
    }

    // orderBy reusable using the helper function
    const orderBy =
      order && sort ? orderByQuery(sort, order) : { createdAt: 'desc' }

    // Search reusable
    const whereSearch =
      search ?
        {
          OR: [
            {
              sections: {
                is: {
                  identification: {
                    is: {
                      title: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                },
              },
            },
            {
              sections: {
                is: {
                  duration: {
                    is: {
                      modality: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                },
              },
            },

            {
              researcher: {
                name: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
            {
              protocolNumber: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {}

    const convocatoryFilter =
      convocatory ?
        { convocatoryId: convocatory === 'null' ? null : convocatory }
      : {}

    const stateFilter = state ? { state: state as ProtocolState } : {}

    const acUnitFilter =
      unit ?
        {
          sections: {
            is: {
              identification: {
                is: {
                  academicUnitIds: {
                    has: unit,
                  },
                },
              },
            },
          },
        }
      : {}

    const queryBuilder = async () => {
      if (role === Role.RESEARCHER)
        return prisma.$transaction([
          prisma.protocol.count({
            where: {
              AND: [
                // According to business logic
                { researcherId: id },
                // According to table features (search, filter)
                whereSearch,
                stateFilter,
                convocatoryFilter,
              ],
              NOT: { state: ProtocolState.DELETED },
            },
          }),
          prisma.protocol.findMany({
            skip,
            take,
            select,
            orderBy,
            where: {
              AND: [
                // According to business logic
                { researcherId: id },
                // According to table features (search, filter)
                whereSearch,
                stateFilter,
                convocatoryFilter,
              ],
              NOT: { state: ProtocolState.DELETED },
            },
          }),
        ])
      if (role === Role.METHODOLOGIST || role === Role.SCIENTIST)
        return prisma.$transaction([
          prisma.protocol.count({
            where: {
              AND: [
                {
                  // Business logic
                  OR: [
                    {
                      researcherId: id,
                    },
                    {
                      reviews: {
                        some: { reviewerId: id },
                      },
                    },
                  ],
                },
                // Table feature
                whereSearch,
                stateFilter,
                convocatoryFilter,
              ],
              NOT: { state: ProtocolState.DELETED },
            },
          }),
          prisma.protocol.findMany({
            skip,
            take,
            select,
            orderBy,
            where: {
              AND: [
                {
                  // Business logic
                  OR: [
                    {
                      researcherId: id,
                    },
                    {
                      reviews: {
                        some: { reviewerId: id },
                      },
                    },
                  ],
                },
                // Table feature
                whereSearch,
                stateFilter,
                convocatoryFilter,
              ],
              NOT: { state: ProtocolState.DELETED },
            },
          }),
        ])
      if (role === Role.SECRETARY) {
        const academicUnits = await getAcademicUnitsByUserId(id)
        return prisma.$transaction([
          prisma.protocol.count({
            where: {
              AND: [
                // Business logic
                {
                  OR: [
                    {
                      researcherId: id,
                    },
                    {
                      sections: {
                        is: {
                          identification: {
                            is: {
                              academicUnitIds: {
                                hasSome: academicUnits?.map((e) => e.id),
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                whereSearch,
                stateFilter,
                acUnitFilter,
                convocatoryFilter,
              ],

              NOT: { state: ProtocolState.DELETED },
            },
          }),
          prisma.protocol.findMany({
            skip,
            take,
            select,
            orderBy,
            where: {
              AND: [
                // Business logic
                {
                  OR: [
                    {
                      researcherId: id,
                    },
                    {
                      sections: {
                        is: {
                          identification: {
                            is: {
                              academicUnitIds: {
                                hasSome: academicUnits?.map((e) => e.id),
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                whereSearch,
                stateFilter,
                acUnitFilter,
                convocatoryFilter,
              ],

              NOT: { state: ProtocolState.DELETED },
            },
          }),
        ])
      }
      // else admin
      return prisma.$transaction([
        prisma.protocol.count({
          where: {
            AND: [whereSearch, stateFilter, acUnitFilter, convocatoryFilter],
          },
        }),
        prisma.protocol.findMany({
          skip,
          take,
          select,
          where: {
            AND: [whereSearch, stateFilter, acUnitFilter, convocatoryFilter],
          },
          orderBy,
        }),
      ])
    }

    try {
      return await queryBuilder()
    } catch (error) {
      console.log(error)
      return []
    }
  }
)

export {
  findProtocolByIdWithResearcher,
  findProtocolById,
  getProtocolMetadata,
  updateProtocolById,
  updateProtocolResearcher,
  createProtocol,
  getAllProtocols,
  updateProtocolStateById,
  getProtocolsByRole,
  getResearcherEmailByProtocolId,
  patchProtocolNumber,
  upsertProtocolFlag,
  updateProtocolTeamMembers,
  updateProtocolConvocatory,
  findProtocolByIdWithBudgets,
  getProtocolBudgetData,
}
