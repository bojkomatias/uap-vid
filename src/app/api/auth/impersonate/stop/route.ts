import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../[...nextauth]/auth'
import { encode, getToken } from 'next-auth/jwt'
import { findUserById } from '@repositories/user'
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
    // Get the current session
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    // Check if user is impersonating
    if (!session.impersonating?.isActive) {
      return NextResponse.json(
        { error: 'Not currently impersonating any user' },
        { status: 400 }
      )
    }

    const originalUserId = session.impersonating.originalUser.id

    // Fetch the full original user data from database to ensure we have all fields
    const originalUserFromDb = await findUserById(originalUserId)

    if (!originalUserFromDb) {
      return NextResponse.json(
        { error: 'Original user not found' },
        { status: 404 }
      )
    }

    // Get current token to preserve other metadata
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

    // Create new token with original user (remove impersonation)
    const newToken = await encode({
      token: {
        ...token,
        user: {
          ...originalUserFromDb,
          password: null, // Never include password in token
        },
        impersonating: undefined,
      },
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    console.log('✅ Restored token created, length:', newToken.length)

    const response = NextResponse.json({
      success: true,
      restoredUser: {
        id: originalUserFromDb.id,
        name: originalUserFromDb.name,
        email: originalUserFromDb.email,
        role: originalUserFromDb.role,
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
      console.log('✅ Restored cookie set:', sessionCookiePrefix)
    }

    return response
  } catch (error) {
    console.error('❌ Stop impersonation error:', error)
    return NextResponse.json(
      { error: 'Failed to stop impersonation' },
      { status: 500 }
    )
  }
}
