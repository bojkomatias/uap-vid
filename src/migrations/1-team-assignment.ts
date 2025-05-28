import {
  PrismaClient,
  ProtocolSectionsIdentificationTeam,
  TeamAssignment,
} from '@prisma/client'

const parseTeamAssignment = (
  team: ProtocolSectionsIdentificationTeam,
  from: Date
): ProtocolSectionsIdentificationTeam => {
  return {
    ...team,
    assignments: [
      {
        categoryToBeConfirmed: team.categoryToBeConfirmed ?? null,
        role: team.role!,
        hours: team.hours!,
        from,
        to: null,
      },
    ],
  }
}
export const migrate = async () => {
  const prisma = new PrismaClient()
  const protocols = await prisma.protocol.findMany()

  console.log('Processing...')

  const protocolWithTeamAssignment = protocols.map((protocol) => {
    const team = protocol.sections.identification.team
    const from = protocol.createdAt
    if (!from) {
      throw new Error('Protocol has no createdAt date')
    }

    const teamWithAssignments = team.map((team) =>
      parseTeamAssignment(team, from)
    )
    return {
      ...protocol,
      sections: {
        ...protocol.sections,
        identification: {
          ...protocol.sections.identification,
          team: teamWithAssignments,
        },
      },
    }
  })

  console.log('Updating...')

  await prisma.$transaction(
    async (tx) => {
      for (const protocol of protocolWithTeamAssignment) {
        const { id, ...rest } = protocol
        await tx.protocol.update({
          where: { id: protocol.id },
          data: rest,
        })
      }
    },
    {
      timeout: 10000 * 60 * 60,
    }
  )
}
