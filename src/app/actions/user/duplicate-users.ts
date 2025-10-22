'use server'

import { prisma } from '@utils/bd'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { Role } from '@prisma/client'

/**
 * Detects duplicate users based on email (case-insensitive)
 * Returns groups of users that share the same email
 */
export async function findDuplicateUsers() {
  try {
    const session = await getServerSession(authOptions)

    // Only admins can run this function
    if (!session || session.user.role !== Role.ADMIN) {
      return {
        status: false,
        message: 'Solo los administradores pueden ejecutar esta función',
        data: null,
      }
    }

    // Get all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        lastLogin: true,
        _count: {
          select: {
            protocols: true,
            Review: true,
          },
        },
      },
      orderBy: {
        email: 'asc',
      },
    })

    // Group users by normalized email (lowercase, trimmed)
    const emailGroups = new Map<string, typeof allUsers>()

    for (const user of allUsers) {
      const normalizedEmail = user.email.toLowerCase().trim()
      const existing = emailGroups.get(normalizedEmail) || []
      emailGroups.set(normalizedEmail, [...existing, user])
    }

    // Filter only groups with duplicates
    const duplicates = Array.from(emailGroups.entries())
      .filter(([_, users]) => users.length > 1)
      .map(([email, users]) => ({
        email,
        count: users.length,
        users: users.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          lastLogin: u.lastLogin,
          protocolCount: u._count.protocols,
          reviewCount: u._count.Review,
        })),
      }))

    return {
      status: true,
      message: `Se encontraron ${duplicates.length} grupos de usuarios duplicados`,
      data: duplicates,
    }
  } catch (error) {
    console.error('Error finding duplicate users:', error)
    return {
      status: false,
      message: 'Error al buscar usuarios duplicados',
      data: null,
    }
  }
}

/**
 * Consolidates duplicate user accounts by merging reviews and protocols
 * into the primary account and deleting the duplicate
 *
 * @param primaryUserId - The user ID to keep (usually the one with more data or most recent login)
 * @param duplicateUserId - The user ID to merge and delete
 */
export async function mergeDuplicateUsers(
  primaryUserId: string,
  duplicateUserId: string
) {
  try {
    const session = await getServerSession(authOptions)

    // Only admins can run this function
    if (!session || session.user.role !== Role.ADMIN) {
      return {
        status: false,
        message: 'Solo los administradores pueden ejecutar esta función',
      }
    }

    // Verify both users exist
    const [primaryUser, duplicateUser] = await Promise.all([
      prisma.user.findUnique({
        where: { id: primaryUserId },
        include: {
          _count: {
            select: {
              protocols: true,
              Review: true,
            },
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: duplicateUserId },
        include: {
          _count: {
            select: {
              protocols: true,
              Review: true,
            },
          },
        },
      }),
    ])

    if (!primaryUser || !duplicateUser) {
      return {
        status: false,
        message: 'Uno o ambos usuarios no existen',
      }
    }

    // Verify emails match (case-insensitive)
    if (primaryUser.email.toLowerCase().trim() !== duplicateUser.email.toLowerCase().trim()) {
      return {
        status: false,
        message: 'Los usuarios no tienen el mismo email',
      }
    }

    // Prevent merging the same user
    if (primaryUserId === duplicateUserId) {
      return {
        status: false,
        message: 'No se puede fusionar un usuario consigo mismo',
      }
    }

    // Use a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update all reviews from duplicate user to primary user
      const reviewsUpdated = await tx.review.updateMany({
        where: { reviewerId: duplicateUserId },
        data: { reviewerId: primaryUserId },
      })

      // 2. Update all protocols from duplicate user to primary user
      const protocolsUpdated = await tx.protocol.updateMany({
        where: { researcherId: duplicateUserId },
        data: { researcherId: primaryUserId },
      })

      // 3. Update all logs from duplicate user to primary user (UserToLogs relation)
      const logsUpdated = await tx.logs.updateMany({
        where: { userId: duplicateUserId },
        data: { userId: primaryUserId },
      })

      // 4. Update all reviewer logs from duplicate user to primary user (ReviewerToLogs relation)
      const reviewerLogsUpdated = await tx.logs.updateMany({
        where: { reviewerId: duplicateUserId },
        data: { reviewerId: primaryUserId },
      })

      // 5. Update all chat messages from duplicate user to primary user
      const chatMessagesUpdated = await tx.chatMessage.updateMany({
        where: { userId: duplicateUserId },
        data: { userId: primaryUserId },
      })

      // 6. Update all password reset tokens (if any)
      const passwordResetTokensUpdated = await tx.passwordResetToken.updateMany({
        where: { userId: duplicateUserId },
        data: { userId: primaryUserId },
      })

      // 7. Handle TeamMember relationship (one-to-one, need to be careful)
      const duplicateTeamMember = await tx.teamMember.findFirst({
        where: { userId: duplicateUserId },
      })

      const primaryTeamMember = await tx.teamMember.findFirst({
        where: { userId: primaryUserId },
      })

      let teamMemberHandled = false
      if (duplicateTeamMember && !primaryTeamMember) {
        // Move the team member to primary user
        await tx.teamMember.update({
          where: { id: duplicateTeamMember.id },
          data: { userId: primaryUserId },
        })
        teamMemberHandled = true
      } else if (duplicateTeamMember && primaryTeamMember) {
        // Both have team members, disconnect the duplicate's one
        await tx.teamMember.update({
          where: { id: duplicateTeamMember.id },
          data: { userId: null },
        })
        teamMemberHandled = true
      }

      // 8. Update the primary user's email to the normalized version (lowercase)
      await tx.user.update({
        where: { id: primaryUserId },
        data: {
          email: primaryUser.email.toLowerCase().trim(),
          // Update lastLogin to the most recent one
          lastLogin:
            primaryUser.lastLogin && duplicateUser.lastLogin ?
              primaryUser.lastLogin > duplicateUser.lastLogin ?
                primaryUser.lastLogin
              : duplicateUser.lastLogin
            : primaryUser.lastLogin || duplicateUser.lastLogin,
        },
      })

      // 9. Delete the duplicate user
      await tx.user.delete({
        where: { id: duplicateUserId },
      })

      return {
        reviewsUpdated: reviewsUpdated.count,
        protocolsUpdated: protocolsUpdated.count,
        logsUpdated: logsUpdated.count,
        reviewerLogsUpdated: reviewerLogsUpdated.count,
        chatMessagesUpdated: chatMessagesUpdated.count,
        passwordResetTokensUpdated: passwordResetTokensUpdated.count,
        teamMemberHandled,
      }
    })

    return {
      status: true,
      message: `Usuario ${duplicateUser.email} fusionado exitosamente con ${primaryUser.email}`,
      operations: result,
    }
  } catch (error) {
    console.error('Error merging duplicate users:', error)
    return {
      status: false,
      message: `Error al fusionar usuarios: ${error instanceof Error ? error.message : 'Error desconocido'}`,
    }
  }
}

/**
 * Normalizes all user emails to lowercase to prevent future duplicates
 */
export async function normalizeUserEmails() {
  try {
    const session = await getServerSession(authOptions)

    // Only admins can run this function
    if (!session || session.user.role !== Role.ADMIN) {
      return {
        status: false,
        message: 'Solo los administradores pueden ejecutar esta función',
      }
    }

    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true },
    })

    let normalizedCount = 0

    for (const user of allUsers) {
      const normalizedEmail = user.email.toLowerCase().trim()
      if (user.email !== normalizedEmail) {
        await prisma.user.update({
          where: { id: user.id },
          data: { email: normalizedEmail },
        })
        normalizedCount++
      }
    }

    return {
      status: true,
      message: `Se normalizaron ${normalizedCount} emails de usuarios`,
      data: { normalizedCount, totalUsers: allUsers.length },
    }
  } catch (error) {
    console.error('Error normalizing user emails:', error)
    return {
      status: false,
      message: 'Error al normalizar emails',
    }
  }
}
