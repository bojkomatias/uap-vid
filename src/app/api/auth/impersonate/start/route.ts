import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../[...nextauth]/auth'
import { findUserById } from '@repositories/user'
import { getToken, encode } from 'next-auth/jwt'
import { cookies } from 'next/headers'

// Maximum cookie size (4KB limit, use 3900 to be safe)
const MAX_COOKIE_SIZE = 3900

function chunkString(str: string, size: number): string[] {
  const chunks: string[] = []
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size))
  }
  return chunks
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can impersonate users.' },
        { status: 403 }
      )
    }

    // Check if already impersonating
    if (session.impersonating?.isActive) {
      return NextResponse.json(
        { error: 'Already impersonating a user. Stop current impersonation first.' },
        { status: 400 }
      )
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user to impersonate
    const userToImpersonate = await findUserById(userId)

    if (!userToImpersonate) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent impersonating another admin
    if (userToImpersonate.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot impersonate another admin' },
        { status: 403 }
      )
    }

    // Get current token
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET!
    })

    if (!token) {
      return NextResponse.json(
        { error: 'Could not read session token' },
        { status: 500 }
      )
    }

    // Use full user objects to ensure all fields are preserved (especially dni)
    // We need to include ALL fields to pass middleware checks
    const impersonatedUser = {
      ...userToImpersonate,
      // Ensure password is not included in token
      password: null,
    }

    const originalUser = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      dni: session.user.dni,
      lastLogin: session.user.lastLogin,
      password: session.user.password,
      image: session.user.image,
      AcademicUnitIds: session.user.AcademicUnitIds,
    }

    // Create new token with impersonation data
    const newToken = await encode({
      token: {
        ...token,
        user: impersonatedUser,
        impersonating: {
          originalUser: originalUser,
          isActive: true,
        },
      },
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: 7 * 24 * 60 * 60,
    })

    console.log('✅ New token created, length:', newToken.length)

    const response = NextResponse.json({
      success: true,
      impersonatedUser: {
        id: impersonatedUser.id,
        name: impersonatedUser.name,
        email: impersonatedUser.email,
        role: impersonatedUser.role,
      },
    })

    // Delete all existing session cookies
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const sessionCookiePrefix = process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'

    const sessionCookies = allCookies.filter(c => c.name.startsWith(sessionCookiePrefix))
    console.log('🗑️  Deleting cookies:', sessionCookies.map(c => c.name))

    // Delete old session cookies
    sessionCookies.forEach(cookie => {
      response.cookies.set(cookie.name, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      })
    })

    // Chunk the token if it's too large
    if (newToken.length > MAX_COOKIE_SIZE) {
      const chunks = chunkString(newToken, MAX_COOKIE_SIZE)
      console.log(`📦 Chunking token into ${chunks.length} pieces`)

      chunks.forEach((chunk, index) => {
        const cookieName = `${sessionCookiePrefix}.${index}`
        response.cookies.set(cookieName, chunk, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        })
        console.log(`✅ Set cookie: ${cookieName} (${chunk.length} chars)`)
      })
    } else {
      // Token is small enough for a single cookie
      response.cookies.set(sessionCookiePrefix, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      })
      console.log('✅ New cookie set:', sessionCookiePrefix)
    }

    return response
  } catch (error) {
    console.error('❌ Impersonation error:', error)
    return NextResponse.json(
      { error: 'Failed to impersonate user' },
      { status: 500 }
    )
  }
}
