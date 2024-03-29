import { buttonStyle } from '@elements/button/styles'
import { PageHeading } from '@layout/page-heading'
import { getTeamMembers } from '@repositories/team-member'
import TeamMemberTable from 'modules/team-member/team-member-table'
import Link from 'next/link'
import { UserPlus } from 'tabler-icons-react'

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string }
}) {
    const [totalRecords, teamMembers] = await getTeamMembers(searchParams)

    return (
        <>
            <PageHeading title={'Miembros del equipo de investigación'} />
            <p className="ml-2 mt-2 text-sm text-gray-500">
                Lista de todos los docentes, técnicos y becarios que son parte
                del equipo de investigación y sus categorías.
            </p>
            <div className="flex flex-row-reverse">
                <Link
                    href={'/team-members/new'}
                    className={buttonStyle('secondary')}
                >
                    <UserPlus className="h-4 w-4 text-current" />
                    Nuevo miembro
                </Link>
            </div>
            <TeamMemberTable
                teamMembers={teamMembers}
                totalRecords={totalRecords}
            />
        </>
    )
}
