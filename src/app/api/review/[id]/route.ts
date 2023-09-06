/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { markRevised, updateReview } from '@repositories/review'

export async function PUT(request: NextRequest) {
    const data = await request.json()
    const review = await updateReview(data)

    return NextResponse.json(review)
}

// Researcher (Owner) marks as revised
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const data = await request.json()
    const review = await markRevised(params.id, data)
    return NextResponse.json(review)
}
