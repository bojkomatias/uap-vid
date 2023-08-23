/* eslint-disable @next/next/no-server-import-in-page */
import { updateCategoryById } from '@repositories/team-member-category'
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
    const { data } = await request.json()

    if (!id || !data) {
        return new Response('We cannot update your category: Invalid Data', {
            status: 500,
        })
    }

    const updated = await updateCategoryById(id, data)

    if (!updated) {
        return new Response('We cannot update your category', { status: 500 })
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
    const { data } = await request.json()

    console.log(data)

    if (!id || !data) {
        return new Response('We cannot update your category: Invalid Data', {
            status: 500,
        })
    }

    const updated = await updateCategoryById(id, data)

    if (!updated) {
        return new Response('We cannot update your category', { status: 500 })
    }

    return NextResponse.json({ message: 'success' })
}
