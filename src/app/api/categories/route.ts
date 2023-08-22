/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createCategory } from '@repositories/team-member-category'
export async function POST(request: NextRequest) {
    const session = await getServerSession()
    if (!session) {
        return new Response('No autorizado', { status: 401 })
    }

    const data = await request.json()
    const created = await createCategory({
        ...data,
    })

    if (!created) {
        return new Response('Problema al crear la categoría', { status: 500 })
    }

    return NextResponse.json(created)
}
