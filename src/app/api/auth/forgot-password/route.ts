import { NextResponse } from 'next/server'
import { findUserByEmail } from '@repositories/user'
import { createPasswordResetToken } from '@repositories/password-reset'
import { sendPasswordResetEmail } from '@utils/emailer/send-password-reset'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find user by email
    const user = await findUserByEmail(email)

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, a reset code has been sent.',
      })
    }

    // Only send reset email to users with local credentials (have a password)
    if (!user.password) {
      return NextResponse.json({
        message: 'If an account exists with this email, a reset code has been sent.',
      })
    }

    // Create password reset token
    const resetToken = await createPasswordResetToken(user.id)

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Failed to create reset token' },
        { status: 500 }
      )
    }

    // Send email with reset code
    const emailSent = await sendPasswordResetEmail(email, resetToken.token)

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'If an account exists with this email, a reset code has been sent.',
    })
  } catch (error) {
    console.error('Error in forgot-password route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
