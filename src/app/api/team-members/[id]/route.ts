import { NextResponse, type NextRequest } from 'next/server'
import {
    updateCategoryHistory,
    updateTeamMember,
} from '@repositories/team-member'
import { getObreroCategory } from '@repositories/team-member-category'
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
    /**
     * When a team Member is marked as an "Obrero" do a flow to categorize it as such.
     */
    if (updated.obrero) {
        const obreroCategory = await getObreroCategory()
        if (!obreroCategory) {
            return new Response('Obrero category FMR not created', {
                status: 428,
            })
        }
        // Only if different proceed to re categorize
        if (obreroCategory.id !== updated.categories.at(-1)?.id) {
            const data = {
                newCategory: obreroCategory.id,
                expireId: updated.categories.at(-1)?.id,
                memberId: updated.id,
            }
            const reCategorized = await updateCategoryHistory(data)
            if (!reCategorized)
                return new Response('Error categorizing obrero!', {
                    status: 501,
                })
        }
    }
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
