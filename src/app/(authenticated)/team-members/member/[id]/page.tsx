import { Heading } from '@components/heading'
import { getAcademicUnitsTabs } from '@repositories/academic-unit'
import { getTeamMemberById } from '@repositories/team-member'
import { getAllNonTeamMembers } from '@repositories/user'
import TeamMemberForm from 'modules/team-member/team-member-form'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = id === 'new' ? null : await getTeamMemberById(id)

  const researchers = await getAllNonTeamMembers(
    id !== 'new' ? id : undefined
  )

  const academicUnits = await getAcademicUnitsTabs()

  return (
    <>
      <Heading>Miembro de investigación</Heading>
      <TeamMemberForm
        member={member}
        researchers={researchers}
        academicUnits={academicUnits}
      />
    </>
  )
}
