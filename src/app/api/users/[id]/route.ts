/* eslint-disable @next/next/no-server-import-in-page */
import { deleteUserById, updateUserRoleById } from '@repositories/user'
import { getServerSession } from 'next-auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { canAccess } from '@utils/scopes'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (session && canAccess('USERS', session.user.role)) {
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
    return new Response('Unauthorized', { status: 401 })
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (session && canAccess('USERS', session.user.role)) {
        const id = params.id

        const deleted = await deleteUserById(id)

        if (!deleted) {
            return new Response('We cannot update delete user', { status: 500 })
        }
        return NextResponse.json({ message: 'success' })
    }
    return new Response('Unauthorized', { status: 401 })
}
