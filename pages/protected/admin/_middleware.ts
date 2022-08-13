import { getToken, JWT } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET

import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

  interface Token extends JWT {
    email: string
    sub: string
    user: {
        email: string
        id: string
        role: string
    }
    iat: number
    exp: number
    jti: string
    }

export async function middleware(req: any, ev: NextFetchEvent) {
    const token = await getToken({ req, secret }) as Token 
    console.log(token);
    
    //@ts-ignore
    if (token || token.user.role === 'admin') {
        return NextResponse.next()
    } else {
        // the user is not logged in, redirect to the sign-in page
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/`)
    }
}
