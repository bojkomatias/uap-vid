/* eslint-disable @next/next/no-server-import-in-page */
import { deleteUserById, updateUserRoleById } from '@repositories/user'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
    const id = params.id

    const deleted = await deleteUserById(id)

    if (!deleted) {
        return new Response('We cannot update delete user', { status: 500 })
    }
    return NextResponse.json({ message: 'success' })
}
