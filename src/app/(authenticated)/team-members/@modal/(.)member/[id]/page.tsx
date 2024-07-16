import { getAcademicUnitsTabs } from '@repositories/academic-unit'
import { getTeamMemberById } from '@repositories/team-member'
import { getAllNonTeamMembers } from '@repositories/user'
import { TeamMemberDialog } from 'modules/team-member/team-member-dialog'

export default async function Page({ params }: { params: { id: string } }) {
  const member = params.id === 'new' ? null : await getTeamMemberById(params.id)

  const researchers = await getAllNonTeamMembers(
    params.id !== 'new' ? params.id : undefined
  )

  const academicUnits = await getAcademicUnitsTabs()

  return (
    <TeamMemberDialog
      member={member}
      researchers={researchers}
      academicUnits={academicUnits}
    />
  )
}
