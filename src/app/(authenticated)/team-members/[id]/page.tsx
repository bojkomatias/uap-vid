import { PageHeading } from '@layout/page-heading'
import { getTeamMemberById } from '@repositories/team-member'
import { getAllCategories } from '@repositories/team-member-category'
import { getAllNonTeamMembers } from '@repositories/user'
import { canAccess } from '@utils/scopes'

import { authOptions } from 'app/api/auth/[...nextauth]/route'
import TeamMemberForm from 'modules/team-member/team-member-form'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || !canAccess('TEAM_MEMBERS', session.user.role))
        redirect('/protocols')

    const member =
        params.id === 'new' ? null : await getTeamMemberById(params.id)

    const researchers = await getAllNonTeamMembers(
        params.id !== 'new' ? params.id : undefined
    )

    const categories = await getAllCategories()
    return (
        <>
            <PageHeading title={'Miembro de investigación'} />
            <TeamMemberForm
                member={member}
                researchers={researchers}
                categories={categories}
            />
        </>
    )
}
