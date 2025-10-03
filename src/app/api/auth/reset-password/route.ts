import { NextResponse } from 'next/server'
import {
  findValidResetToken,
  markTokenAsUsed,
} from '@repositories/password-reset'
import { updateUserById } from '@repositories/user'
import { createHashScrypt } from '@utils/hash'

export async function POST(request: Request) {
  try {
    const { code, newPassword } = await request.json()

    console.log('📥 Reset password request received:', { code, passwordLength: newPassword?.length })

    if (!code || !newPassword) {
      return NextResponse.json(
        { error: 'Code and new password are required' },
        { status: 400 }
      )
    }

    // Validate password length
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find valid reset token
    console.log('🔍 Looking for reset token...')
    const resetToken = await findValidResetToken(code)

    if (!resetToken) {
      console.log('❌ Reset token not found or expired')
      return NextResponse.json(
        { error: 'Invalid or expired reset code' },
        { status: 400 }
      )
    }

    console.log('✅ Valid reset token found:', {
      userId: resetToken.userId,
      userEmail: resetToken.user.email,
      tokenExpiry: resetToken.expiresAt,
      tokenUsed: resetToken.used
    })

    // Hash the new password
    console.log('🔐 Hashing new password...')
    const hashedPassword = await createHashScrypt(newPassword)
    console.log('✅ Password hashed successfully')

    // Update user password - only update the password field
    console.log('📝 Updating user password...', { userId: resetToken.userId, email: resetToken.user.email })

    const updatedUser = await updateUserById(resetToken.userId, {
      email: resetToken.user.email,
      name: resetToken.user.name,
      dni: resetToken.user.dni,
      image: resetToken.user.image,
      role: resetToken.user.role,
      lastLogin: resetToken.user.lastLogin,
      password: hashedPassword,
      AcademicUnitIds: resetToken.user.AcademicUnitIds,
    })

    if (!updatedUser) {
      console.error('❌ Failed to update user password - updateUserById returned null')
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      )
    }

    console.log('✅ User password updated successfully')

    // Mark token as used
    console.log('🔒 Marking token as used...')
    await markTokenAsUsed(code)
    console.log('✅ Token marked as used')

    return NextResponse.json({
      message: 'Password successfully reset',
    })
  } catch (error) {
    console.error('💥 Error in reset-password route:', error)
    console.error('Error stack:', (error as Error).stack)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
