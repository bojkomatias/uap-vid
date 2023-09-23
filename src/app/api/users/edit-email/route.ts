/* eslint-disable @next/next/no-server-import-in-page */
import { updateUserEmailById } from '@repositories/user'
import { NextResponse, type NextRequest } from 'next/server'

export async function PATCH(request: NextRequest) {
    const res = await request.json()

    const id = res.id
    const email = res.email

    if (!id || !email) {
        return new Response('We cannot update your user: Invalid Data', {
            status: 500,
        })
    }

    const updated = await updateUserEmailById(id, email)

    if (!updated) {
        return new Response('We cannot update your email', { status: 500 })
    }

    return NextResponse.json({ message: 'success', status: 200 })
}
