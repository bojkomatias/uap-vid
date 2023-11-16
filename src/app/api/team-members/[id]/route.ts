
import { NextResponse, type NextRequest } from 'next/server'
import {
    updateCategoryHistory,
    updateTeamMember,
} from '@repositories/team-member'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { ...teamMember } = await request.json()
    const updated = await updateTeamMember(params.id, teamMember)
    if (!updated)
        return new Response('Failed to create Team Member', { status: 500 })
    return NextResponse.json(updated)
}

export async function PATCH(request: NextRequest) {
    const data = await request.json()
    const updated = await updateCategoryHistory(data)
    if (!updated)
        return new Response('Failed to update category', { status: 500 })
    return NextResponse.json(updated)
}
