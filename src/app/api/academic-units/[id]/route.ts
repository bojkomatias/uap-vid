/* eslint-disable @next/next/no-server-import-in-page */
import { updateAcademicUnit } from '@repositories/academic-unit'
import { getServerSession } from 'next-auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const secretariesIds = await request.json()

    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const sessionRole = session.user.role

    if (sessionRole.toLocaleLowerCase() !== 'admin') {
        return new Response('Unauthorized', { status: 401 })
    }

    if (!id || !secretariesIds) {
        return new Response(
            'We cannot update your academic unit: Invalid Data',
            {
                status: 500,
            }
        )
    }

    const updated = await updateAcademicUnit(id, secretariesIds)

    if (!updated) {
        return new Response('We cannot update your academic unit', {
            status: 500,
        })
    }

    return NextResponse.json({ message: 'success' })
}
