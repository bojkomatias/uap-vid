/* eslint-disable @next/next/no-server-import-in-page */
import { getToken, JWT } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const secret = process.env.NEXTAUTH_SECRET

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

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret }) as Token
    if (req.nextUrl.pathname.startsWith('/protected')) {
        if (token) {
            return NextResponse.next()
        } else {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/`)
        }
    }

    if (req.nextUrl.pathname.startsWith('/protected/admin')) {
        //@ts-ignore
        if (token || token.user.role === 'admin') {
            return NextResponse.next()
        } else {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/`)
        }
    }
}