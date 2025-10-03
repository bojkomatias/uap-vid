'use server'

import { prisma } from '../utils/bd'
import crypto from 'crypto'

const createPasswordResetToken = async (userId: string) => {
  try {
    // Generate 6-digit code
    const token = crypto.randomInt(100000, 999999).toString()

    // Set expiration to 3 hours from now
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 3)

    // Invalidate any existing tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: {
        userId,
        used: false,
      },
      data: {
        used: true,
      },
    })

    // Create new token
    const resetToken = await prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    })

    return resetToken
  } catch (error) {
    console.error('Error creating password reset token:', error)
    return null
  }
}

const findValidResetToken = async (token: string) => {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    })

    if (!resetToken) return null

    // Check if token is expired or already used
    if (resetToken.used || resetToken.expiresAt < new Date()) {
      return null
    }

    return resetToken
  } catch (error) {
    console.error('Error finding reset token:', error)
    return null
  }
}

const markTokenAsUsed = async (token: string) => {
  try {
    await prisma.passwordResetToken.update({
      where: {
        token,
      },
      data: {
        used: true,
      },
    })
    return true
  } catch (error) {
    console.error('Error marking token as used:', error)
    return false
  }
}

const cleanupExpiredTokens = async () => {
  try {
    await prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })
    return true
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error)
    return false
  }
}

export {
  createPasswordResetToken,
  findValidResetToken,
  markTokenAsUsed,
  cleanupExpiredTokens,
}
