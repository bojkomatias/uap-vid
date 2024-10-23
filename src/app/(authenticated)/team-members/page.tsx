import { Button } from '@components/button'
import { Heading, Subheading } from '@components/heading'
import { ContainerAnimations } from '@elements/container-animations'
import { getTeamMembers } from '@repositories/team-member'
import TeamMemberTable from 'modules/team-member/team-member-table'
import { UserPlus } from 'tabler-icons-react'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, teamMembers] = await getTeamMembers(searchParams)

  return (
    <>
      <ContainerAnimations duration={0.4} delay={0}>
        <div className="flex items-end">
          <Heading>Miembros del equipo de investigación</Heading>
          <Button href={'/team-members/member/new'}>
            <UserPlus data-slot="icon" />
            Nuevo miembro
          </Button>
        </div>
        <Subheading>
          Lista de todos los docentes, técnicos y becarios que son parte del
          equipo de investigación y sus categorías.
        </Subheading>
      </ContainerAnimations>
      <ContainerAnimations duration={0.3} delay={0.1} animation={2}>
        <TeamMemberTable
          teamMembers={teamMembers}
          totalRecords={totalRecords}
        />
      </ContainerAnimations>
    </>
  )
}
