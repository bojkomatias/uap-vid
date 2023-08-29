/* eslint-disable @next/next/no-server-import-in-page */
import { updateAcademicUnit } from '@repositories/academic-unit'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const secretariesIds = await request.json()

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
