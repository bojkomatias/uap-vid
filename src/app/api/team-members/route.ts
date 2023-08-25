// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, type NextRequest } from 'next/server'
import { createTeamMember, getAllTeamMembers } from '@repositories/team-member'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { canAccess } from '@utils/scopes'

export async function GET() {
    const teamMembers = await getAllTeamMembers()
    if (!teamMembers) return new Response('Failed to fetch', { status: 500 })
    return NextResponse.json(teamMembers)
}
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (session && canAccess('TEAM_MEMBERS', session.user.role)) {
        const teamMember = await request.json()
        const created = await createTeamMember(teamMember)
        if (!created)
            return new Response('Failed to create Team Member', { status: 500 })
        return NextResponse.json(created)
    }
    return new Response('Unauthorized', { status: 401 })
}
