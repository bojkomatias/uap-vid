/* eslint-disable @next/next/no-server-import-in-page */
import { deleteUserById, updateUserRoleById } from '@repositories/user'
import { getServerSession } from 'next-auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authOptions } from 'app/api/auth/[...nextauth]/route'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const sessionRole = session.user.role

    if (sessionRole.toLocaleLowerCase() !== 'admin') {
        return new Response('Unauthorized', { status: 401 })
    }

    const id = params.id
    const { role } = await request.json()

    if (!id || !role) {
        return new Response('We cannot update your user: Invalid Data', {
            status: 500,
        })
    }

    const updated = await updateUserRoleById(id, role)

    if (!updated) {
        return new Response('We cannot update your user', { status: 500 })
    }

    return NextResponse.json({ message: 'success' })
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const sessionRole = session.user.role

    if (sessionRole.toLocaleLowerCase() !== 'admin') {
        return new Response('Unauthorized', { status: 401 })
    }

    const id = params.id

    const deleted = await deleteUserById(id)

    if (!deleted) {
        return new Response('We cannot update delete user', { status: 500 })
    }
    return NextResponse.json({ message: 'success' })
}
