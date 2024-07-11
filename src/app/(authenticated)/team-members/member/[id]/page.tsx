import { Heading } from '@components/heading'
import { getAcademicUnitsTabs } from '@repositories/academic-unit'
import { getTeamMemberById } from '@repositories/team-member'
import {
  getAllCategories,
  getObreroCategory,
} from '@repositories/team-member-category'
import { getAllNonTeamMembers } from '@repositories/user'
import CategorizationForm from 'modules/team-member/categorization-form'
import TeamMemberForm from 'modules/team-member/team-member-form'

export default async function Page({ params }: { params: { id: string } }) {
  const member = params.id === 'new' ? null : await getTeamMemberById(params.id)

  const researchers = await getAllNonTeamMembers(
    params.id !== 'new' ? params.id : undefined
  )

  const categories = await getAllCategories()
  const obreroCategory = await getObreroCategory()
  const academicUnits = await getAcademicUnitsTabs()

  return (
    <>
      <Heading>Miembro de investigación</Heading>
      <TeamMemberForm
        member={member}
        researchers={researchers}
        academicUnits={academicUnits}
      />
      {/* {member ?
        <CategorizationForm
          categories={categories}
          obreroCategory={obreroCategory}
          historicCategories={member.categories}
          member={member}
        />
      : null} */}
    </>
  )
}
