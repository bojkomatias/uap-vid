import { getAcademicUnitsTabs } from '@repositories/academic-unit'
import { getTeamMemberById } from '@repositories/team-member'
import { getAllNonTeamMembers } from '@repositories/user'
import { TeamMemberDialog } from 'modules/team-member/team-member-dialog'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = id === 'new' ? null : await getTeamMemberById(id)

  const researchers = await getAllNonTeamMembers(
    id !== 'new' ? id : undefined
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
