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
            return NextResponse.redirect(new URL('/', req.url))
        }

        if (req.nextUrl.pathname.startsWith('/users')) {
            if (!canAccess('USERS', token.user.role))
                return NextResponse.redirect(new URL('/protocols', req.url))
        }

        if (req.nextUrl.pathname.includes('/convocatories')) {
            if (!canAccess('CONVOCATORIES', token.user.role))
                return NextResponse.redirect(new URL('/protocols', req.url), {
                    status: 401,
                    statusText: 'Unauthorized',
                })
        }
    },
    {
        callbacks: {
            // Always return true, to execute middleware in every matched route
            authorized: async () => true,
        },
    }
)

export const config = {
    matcher: ['/api/:path*', '/protocols/:path*', '/convocatories/:path*', '/'],
}
