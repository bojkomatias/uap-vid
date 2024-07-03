import { Access } from '@prisma/client'
import { canAccess } from '@utils/scopes'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })

    //Useful headers. I'm following this thread from StackOverflow https://stackoverflow.com/questions/75362636/how-can-i-get-the-url-pathname-on-a-server-component-next-js-13
    const url = new URL(req.url)
    const origin = url.origin
    const pathname = url.pathname
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-url', req.url)
    requestHeaders.set('x-origin', origin)
    requestHeaders.set('x-pathname', pathname)

    if (req.nextUrl.pathname === '/') {
      if (token) return NextResponse.redirect(new URL('/home', req.url))
      return null
    }

    if (!token) {
      if (req.nextUrl.pathname.startsWith('/api'))
        return new Response('Unauthorized', { status: 401 })
      return NextResponse.redirect(new URL('/', req.url))
    }

    // It's includes(\'[x]'\) and not startsWith, to match /api/users and /users alike
    if (req.nextUrl.pathname.includes('/indexes')) {
      if (!canAccess(Access.INDEXES, token.user.role))
        return NextResponse.redirect(new URL('/protocols', req.url))
    }

    if (req.nextUrl.pathname.includes('/users')) {
      if (!canAccess(Access.USERS, token.user.role)) {
        if (req.nextUrl.pathname.startsWith('/api'))
          return new Response('Unauthorized', { status: 401 })
        return NextResponse.redirect(new URL('/protocols', req.url))
      }
    }

    if (req.nextUrl.pathname.includes('/convocatories')) {
      if (!canAccess(Access.CONVOCATORIES, token.user.role)) {
        if (req.nextUrl.pathname.startsWith('/api'))
          return new Response('Unauthorized', { status: 401 })
        return NextResponse.redirect(new URL('/protocols', req.url))
      }
    }

    if (req.nextUrl.pathname.includes('/academic-units')) {
      if (!canAccess(Access.ACADEMIC_UNITS, token.user.role)) {
        if (req.nextUrl.pathname.startsWith('/api'))
          return new Response('Unauthorized', { status: 401 })
        return NextResponse.redirect(new URL('/protocols', req.url))
      }
    }

    if (req.nextUrl.pathname.includes('/categories')) {
      if (!canAccess(Access.MEMBER_CATEGORIES, token.user.role)) {
        if (req.nextUrl.pathname.startsWith('/api'))
          return new Response('Unauthorized', { status: 401 })
        return NextResponse.redirect(new URL('/protocols', req.url))
      }
    }

    if (req.nextUrl.pathname.includes('/team-members')) {
      if (!canAccess(Access.TEAM_MEMBERS, token.user.role)) {
        if (req.nextUrl.pathname.startsWith('/api'))
          return new Response('Unauthorized', { status: 401 })
        return NextResponse.redirect(new URL('/protocols', req.url))
      }
    }

    if (req.nextUrl.pathname.includes('/anual-budgets')) {
      if (!canAccess(Access.ANUAL_BUDGETS, token.user.role)) {
        if (req.nextUrl.pathname.startsWith('/api'))
          return new Response('Unauthorized', { status: 401 })
        return NextResponse.redirect(new URL('/protocols', req.url))
      }
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  },
  {
    callbacks: {
      // Always return true, to execute middleware in every matched route
      authorized: async () => true,
    },
  }
)

export const config = {
  matcher: [
    '/',
    '/api/:path*',
    '/protocols/:path*',
    '/convocatories/:path*',
    '/team-members/:path*',
    '/users/:path*',
    '/academic-units/:path*',
  ],
}
