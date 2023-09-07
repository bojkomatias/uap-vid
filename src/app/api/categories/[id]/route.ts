/* eslint-disable @next/next/no-server-import-in-page */
import {
    updatePriceCategoryById,
    deleteCategoryById,
} from '@repositories/team-member-category'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const data = await request.json()

    if (!id || !data) {
        return new Response('We cannot update your category: Invalid Data', {
            status: 500,
        })
    }

    const updated = await updatePriceCategoryById(id, data)

    if (!updated) {
        return new Response('We cannot update your category', {
            status: 500,
        })
    }

    return NextResponse.json({ message: 'success' })
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id

    const data = await request.json()

    if (!id || !data) {
        return new Response('We cannot update your category: Invalid Data', {
            status: 500,
        })
    }

    const updated = await deleteCategoryById(id, data)

    if (!updated) {
        return new Response('We cannot update your category', { status: 500 })
    }

    return NextResponse.json({ message: 'success' })
}
