import { getSession } from 'next-auth/react'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    if (req.url === `${process.env.NEXTAUTH_URL}/signin`) {
        return NextResponse.next()
    }
    const requestForNextAuth = {
        headers: {
            cookie: req.headers.get('cookie'),
        },
    }

    const session = await getSession({ req: requestForNextAuth })

    if (session) {
        return NextResponse.next()
    } else {
        // the user is not logged in, redirect to the sign-in page
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`)
    }
}
