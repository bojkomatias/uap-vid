/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createAnualBudget } from '@repositories/anual-budget'

export async function POST(request: NextRequest) {
    const data = await request.json()
    const created = await createAnualBudget({
        ...data,
    })
    console.log(created)

    if (!created) {
        return new Response('Problema al crear la categoría', {
            status: 500,
        })
    }

    return NextResponse.json(created)
}
