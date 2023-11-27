import { PageHeading } from '@layout/page-heading'
import { getAcademicUnitsTabs } from '@repositories/academic-unit'
import { getTeamMemberById } from '@repositories/team-member'
import { getAllCategories } from '@repositories/team-member-category'
import { getAllNonTeamMembers } from '@repositories/user'
import TeamMemberForm from 'modules/team-member/team-member-form'

export default async function Page({ params }: { params: { id: string } }) {
    const member =
        params.id === 'new' ? null : await getTeamMemberById(params.id)

    const researchers = await getAllNonTeamMembers(
        params.id !== 'new' ? params.id : undefined
    )

    const categories = await getAllCategories()
    const academicUnits = await getAcademicUnitsTabs()

    return (
        <div className="w-full">
            <div className="mx-auto max-w-3xl pt-5">
                <PageHeading title={'Miembro de investigación'} />
                <TeamMemberForm
                    member={member}
                    researchers={researchers}
                    categories={categories}
                    academicUnits={academicUnits}
                />
            </div>
        </div>
    )
}
