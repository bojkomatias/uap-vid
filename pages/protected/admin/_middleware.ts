import { getSession } from 'next-auth/react'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const requestForNextAuth = {
        headers: {
            cookie: req.headers.get('cookie'),
        },
    }

    const session = await getSession({ req: requestForNextAuth })

    // Middleware para proteger el acceso a solo administradores a estos archivos
    if (session?.user?.role === 'admin') {
        return NextResponse.next()
    } else {
        // the user is not logged in, redirect to the sign-in page
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/`)
    }
}
