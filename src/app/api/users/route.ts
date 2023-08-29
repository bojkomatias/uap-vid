/* eslint-disable @next/next/no-server-import-in-page */
import { updateUserEmailById } from '@repositories/user'
import { getServerSession } from 'next-auth'
import { NextResponse, type NextRequest } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'

export async function PATCH(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const sessionRole = session.user.role

    if (sessionRole.toLocaleLowerCase() !== 'admin') {
        return new Response('Unauthorized', { status: 401 })
    }

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

    return NextResponse.json({ message: 'success' })
}
