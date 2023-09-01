/* eslint-disable @next/next/no-server-import-in-page */
import { updateAcademicUnit, updateAcademicUnitSecretaries } from '@repositories/academic-unit'
import { getServerSession } from 'next-auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authOptions } from 'app/api/auth/[...nextauth]/route'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const academicUnit = await request.json()

    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const sessionRole = session.user.role

    if (sessionRole.toLocaleLowerCase() !== 'admin') {
        return new Response('Unauthorized', { status: 401 })
    }

    if (!id || !academicUnit) {
        return new Response(
            'We cannot update your academic unit: Invalid Data',
            {
                status: 500,
            }
        )
    }

        const updated = await updateAcademicUnit(id, academicUnit)

    if (!updated) {
        return new Response('We cannot update your academic unit', {
            status: 500,
        })
    }

    return NextResponse.json({ message: 'success' })
}
