import { PageHeading } from '@layout/page-heading'
import { Role } from '@prisma/client'
import { getTeamMemberById } from '@repositories/team-member'
import { getAllNonTeamMembers } from '@repositories/user'

import { authOptions } from 'app/api/auth/[...nextauth]/route'
import TeamMemberForm from 'modules/team-member/team-member-form'
import { getServerSession } from 'next-auth'

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== Role.ADMIN) return

    const member =
        params.id === 'new' ? null : await getTeamMemberById(params.id)

    const researchers = await getAllNonTeamMembers()

    return (
        <>
            <PageHeading title={'Miembro de investigación'} />
            <TeamMemberForm member={member} researchers={researchers} />
        </>
    )
}
