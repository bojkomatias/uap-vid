/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { emailer, type Emailer } from '@utils/emailer'
export async function POST(request: NextRequest) {
    const emailData: Emailer = await request.json()

    const email = emailer(emailData)

    console.log(email)

    return NextResponse.json(email)
}
