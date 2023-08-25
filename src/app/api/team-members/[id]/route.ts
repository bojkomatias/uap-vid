// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, type NextRequest } from 'next/server'
import {
    updateCategoryHistory,
    updateTeamMember,
} from '@repositories/team-member'
import { canAccess } from '@utils/scopes'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (session && canAccess('TEAM_MEMBERS', session.user.role)) {
        const { id, ...teamMember } = await request.json()

        const updated = await updateTeamMember(params.id, teamMember)
        if (!updated)
            return new Response('Failed to create Team Member', { status: 500 })
        return NextResponse.json(updated)
    }
    return new Response('Unauthorized', { status: 401 })
}

export async function PATCH(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (session && canAccess('TEAM_MEMBERS', session.user.role)) {
        const data = await request.json()
        const updated = await updateCategoryHistory(data)
        if (!updated)
            return new Response('Failed to update category', { status: 500 })
        return NextResponse.json(updated)
    }
    return new Response('Unauthorized', { status: 401 })
}
