/* eslint-disable @next/next/no-server-import-in-page */
import { canAccess } from '@utils/scopes'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    async function middleware(req) {
        const token = await getToken({ req })

        if (req.nextUrl.pathname === '/') {
            if (token)
                return NextResponse.redirect(new URL('/protocols', req.url))
            return null
        }

        if (!token) {
            if (req.nextUrl.pathname.startsWith('/api'))
                return new Response('Unauthorized', { status: 401 })
            return NextResponse.redirect(new URL('/', req.url))
        }

        // It's includes(\'[x]'\) and not startsWith, to match /api/users and /users alike

        if (req.nextUrl.pathname.includes('/users')) {
            if (!canAccess('USERS', token.user.role)) {
                if (req.nextUrl.pathname.startsWith('/api'))
                    return new Response('Unauthorized', { status: 401 })
                return NextResponse.redirect(new URL('/protocols', req.url))
            }
        }

        if (req.nextUrl.pathname.includes('/convocatories')) {
            if (!canAccess('CONVOCATORIES', token.user.role)) {
                if (req.nextUrl.pathname.startsWith('/api'))
                    return new Response('Unauthorized', { status: 401 })
                return NextResponse.redirect(new URL('/protocols', req.url))
            }
        }

        if (req.nextUrl.pathname.includes('/academic-units')) {
            if (!canAccess('ACADEMIC_UNITS', token.user.role)) {
                if (req.nextUrl.pathname.startsWith('/api'))
                    return new Response('Unauthorized', { status: 401 })
                return NextResponse.redirect(new URL('/protocols', req.url))
            }
        }

        if (req.nextUrl.pathname.includes('/categories')) {
            if (!canAccess('MEMBER_CATEGORIES', token.user.role)) {
                if (req.nextUrl.pathname.startsWith('/api'))
                    return new Response('Unauthorized', { status: 401 })
                return NextResponse.redirect(new URL('/protocols', req.url))
            }
        }

        if (req.nextUrl.pathname.includes('/team-members')) {
            if (!canAccess('TEAM_MEMBERS', token.user.role)) {
                if (req.nextUrl.pathname.startsWith('/api'))
                    return new Response('Unauthorized', { status: 401 })
                return NextResponse.redirect(new URL('/protocols', req.url))
            }
        }

        return NextResponse.next()
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
