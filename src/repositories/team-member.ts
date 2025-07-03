'use server'

import type { TeamMember } from '@prisma/client'
import { prisma } from '../utils/bd'
import { orderByQuery } from '@utils/query-helper/orderBy'

export const createTeamMember = async (data: Omit<TeamMember, 'id'>) =>
  await prisma.teamMember.create({
    data,
  })

export const updateTeamMember = async (
  id: string,
  data: Omit<TeamMember, 'id'>
) =>
  await prisma.teamMember.update({
    where: { id },
    data,
    include: { categories: true },
  })

export const updateCategoryHistory = async (data: {
  newCategory: string
  pointsObrero: number | null | undefined
  expireId: string | undefined
  memberId: string
}) => {
  try {
    if (!data.expireId)
      return await prisma.historicTeamMemberCategory.create({
        data: {
          categoryId: data.newCategory,
          pointsObrero: data.pointsObrero,
          teamMemberId: data.memberId,
          from: new Date(),
          to: null,
        },
      })
    return await prisma.$transaction([
      prisma.historicTeamMemberCategory.update({
        where: { id: data.expireId },
        data: { to: new Date() },
      }),
      prisma.historicTeamMemberCategory.create({
        data: {
          categoryId: data.newCategory,
          pointsObrero: data.pointsObrero,
          teamMemberId: data.memberId,
          from: new Date(),
          to: null,
        },
      }),
    ])
  } catch (error) {
    return null
  }
}

export const getTeamMemberById = async (id: string) =>
  await prisma.teamMember.findFirstOrThrow({
    where: { id },
    include: { categories: true, user: true },
  })

export const getTeamMemberCategoriesById = async (teamMemberIds: string[]) =>
  await prisma.teamMember.findFirstOrThrow({
    where: {
      id: {
        in: teamMemberIds,
      },
    },
    include: {
      categories: {
        include: { category: true },
      },
    },
  })

export const getTeamMembersByIds = async (teamMemberIds: string[]) =>
  await prisma.teamMember.findMany({
    where: {
      id: {
        in: teamMemberIds,
      },
    },
    include: {
      user: true,
      categories: { include: { category: true } },
    },
  })

export const getTeamMembers = async ({
  records = '10',
  page = '1',
  search,
  sort,
  order,
}: {
  [key: string]: string
}) => {
  const orderBy = order && sort ? orderByQuery(sort, order) : {}

  return await prisma.$transaction([
    prisma.teamMember.count(),
    prisma.teamMember.findMany({
      skip: Number(records) * (Number(page) - 1),
      take: Number(records),
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        categories: { include: { category: true } },
        AcademicUnit: { select: { name: true } },
      },
      where:
        search ?
          {
            OR: [{ name: { contains: search, mode: 'insensitive' } }],
          }
        : {},

      orderBy,
    }),
  ])
}

export const getAllTeamMembers = async () => await prisma.teamMember.findMany()

export const deactivateTeamMember = async (
  protocolId: string,
  teamMemberIndex: number
) => {
  try {
    const protocol = await prisma.protocol.findUnique({
      where: { id: protocolId },
      select: { sections: true },
    })

    if (!protocol) {
      throw new Error('Protocol not found')
    }

    const team = protocol.sections.identification.team
    if (teamMemberIndex < 0 || teamMemberIndex >= team.length) {
      throw new Error('Invalid team member index')
    }

    // Update the team member's current assignment to set the "to" date
    const updatedTeam = team.map((member, index) => {
      if (index === teamMemberIndex) {
        const currentAssignment = member.assignments.find((a) => !a.to)
        if (currentAssignment) {
          const updatedAssignments = member.assignments.map((assignment) =>
            assignment === currentAssignment ?
              { ...assignment, to: new Date() }
            : assignment
          )
          return {
            ...member,
            assignments: updatedAssignments,
          }
        }
      }
      return member
    })

    const updatedSections = {
      ...protocol.sections,
      identification: {
        ...protocol.sections.identification,
        team: updatedTeam,
      },
    }

    const result = await prisma.protocol.update({
      where: { id: protocolId },
      data: {
        sections: updatedSections,
      },
    })

    return {
      status: true,
      data: result,
      notification: {
        title: 'Miembro desactivado',
        message: 'El miembro del equipo fue desactivado con éxito',
        intent: 'success',
      } as const,
    }
  } catch (error) {
    console.error('Error deactivating team member:', error)
    return {
      status: false,
      notification: {
        title: 'Error',
        message:
          'Ocurrió un error al intentar desactivar el miembro del equipo',
        intent: 'error',
      } as const,
    }
  }
}

export const reactivateTeamMember = async (
  protocolId: string,
  teamMemberIndex: number
) => {
  try {
    const protocol = await prisma.protocol.findUnique({
      where: { id: protocolId },
      select: { sections: true },
    })

    if (!protocol) {
      throw new Error('Protocol not found')
    }

    const team = protocol.sections.identification.team
    if (teamMemberIndex < 0 || teamMemberIndex >= team.length) {
      throw new Error('Invalid team member index')
    }

    // Update the team member's assignment to remove the "to" date (reactivate)
    const updatedTeam = team.map((member, index) => {
      if (index === teamMemberIndex) {
        const deactivatedAssignment = member.assignments.find((a) => a.to)
        if (deactivatedAssignment) {
          const updatedAssignments = member.assignments.map((assignment) =>
            assignment === deactivatedAssignment ?
              { ...assignment, to: null }
            : assignment
          )
          return {
            ...member,
            assignments: updatedAssignments,
          }
        }
      }
      return member
    })

    const updatedSections = {
      ...protocol.sections,
      identification: {
        ...protocol.sections.identification,
        team: updatedTeam,
      },
    }

    const result = await prisma.protocol.update({
      where: { id: protocolId },
      data: {
        sections: updatedSections,
      },
    })

    return {
      status: true,
      data: result,
      notification: {
        title: 'Miembro reactivado',
        message: 'El miembro del equipo fue reactivado con éxito',
        intent: 'success',
      } as const,
    }
  } catch (error) {
    console.error('Error reactivating team member:', error)
    return {
      status: false,
      notification: {
        title: 'Error',
        message: 'Ocurrió un error al intentar reactivar el miembro del equipo',
        intent: 'error',
      } as const,
    }
  }
}
