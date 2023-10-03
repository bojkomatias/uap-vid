/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { emailer, useCases } from '@utils/emailer'
export async function POST(request: NextRequest) {
    const data = await request.json()
    const emailData = { ...data, useCase: useCases.changeUserEmail }
    const email = await emailer(emailData)

    return NextResponse.json({ email: email }, { status: 200 })
}
