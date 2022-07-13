import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET

import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export async function middleware(req: any, ev: NextFetchEvent) {
    const token = await getToken({ req, secret })

    if (token?.user?.role === 'admin') {
        return NextResponse.next()
    } else {
        // the user is not logged in, redirect to the sign-in page
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/`)
    }
}
