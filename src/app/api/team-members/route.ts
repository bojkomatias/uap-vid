import { NextResponse, type NextRequest } from 'next/server'
import { createTeamMember, getAllTeamMembers } from '@repositories/team-member'
import type { TeamMember } from '@prisma/client'

export async function GET() {
    const teamMembers = await getAllTeamMembers()
    if (!teamMembers) return new Response('Failed to fetch', { status: 500 })
    return NextResponse.json(teamMembers)
}

export async function POST(request: NextRequest) {
    /**
     *  Destructured ID so it's not passed on runtime,
     * prisma doesn't like a malformed ID
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...teamMember } = (await request.json()) as TeamMember

    const created = await createTeamMember(teamMember)
    if (!created)
        return new Response('Failed to create Team Member', { status: 500 })
    return NextResponse.json(created)
}
