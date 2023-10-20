import { NextResponse, type NextRequest } from 'next/server'
import { createTeamMember, getAllTeamMembers } from '@repositories/team-member'

export async function GET() {
    const teamMembers = await getAllTeamMembers()
    if (!teamMembers) return new Response('Failed to fetch', { status: 500 })
    return NextResponse.json(teamMembers)
}

export async function POST(request: NextRequest) {
    const { id, ...teamMember } = await request.json()

    const created = await createTeamMember(teamMember)
    if (!created)
        return new Response('Failed to create Team Member', { status: 500 })
    return NextResponse.json(created)
}
