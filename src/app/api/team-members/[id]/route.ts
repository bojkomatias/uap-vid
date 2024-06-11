import { NextResponse, type NextRequest } from 'next/server'
import {
  updateCategoryHistory,
  updateTeamMember,
} from '@repositories/team-member'
import type { TeamMember } from '@prisma/client'

// Updates Team Member
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  /**
   *  Destructured ID so it's not passed on runtime,
   * prisma doesn't like a malformed ID
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...teamMember } = (await request.json()) as TeamMember
  const updated = await updateTeamMember(params.id, teamMember)
  if (!updated)
    return new Response('Failed to create Team Member', { status: 500 })
  return NextResponse.json(updated)
}

// Updates Category of a Team Member
export async function PATCH(request: NextRequest) {
  const data = await request.json()
  const updated = await updateCategoryHistory(data)
  if (!updated)
    return new Response('Failed to update category', { status: 500 })
  return NextResponse.json(updated)
}
