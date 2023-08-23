import { PageHeading } from '@layout/page-heading'
import { getTeamMembers } from '@repositories/team-member'
import { canAccess } from '@utils/scopes'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Page() {
    const session = await getServerSession(authOptions)

    if (session && canAccess('TEAM_MEMBERS', session.user.role)) {
        const teamMembers = await getTeamMembers()

        return (
            <>
                <PageHeading title={'Miembros del equipo de investigación'} />
                <pre>{JSON.stringify(teamMembers, null, 2)}</pre>
            </>
        )
    }
    return redirect('/protocols')
}
