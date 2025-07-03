import type { ProtocolSectionsIdentification } from '@prisma/client'
import SectionViewer from '../elements/view/section-viewer'
import ItemView from '@protocol/elements/view/item-view'
import { getTeamMembersByIds } from '@repositories/team-member'
import { getAcademicUnitByIdWithoutIncludes } from '../../../repositories/academic-unit'
import { getCareerById, getCourseById } from '@repositories/career'
import { getAllCategories } from '@repositories/team-member-category'
import {
  DescriptionDetails,
  DescriptionTerm,
} from '@components/description-list'
import { Text } from '@components/text'
import Info from '@shared/info'

interface IdentificationProps {
  data: ProtocolSectionsIdentification
}
export default async function IdentificationView({
  data,
}: IdentificationProps) {
  const academicUnits = await Promise.all(
    data.academicUnitIds
      .map(async (acId) => await getAcademicUnitByIdWithoutIncludes(acId))
      .map((ac) => ac.then((a) => a?.name))
  )
  const career = await getCareerById(data.careerId)

  const course = data.courseId ? await getCourseById(data.courseId) : null

  const categories = await getAllCategories()

  const shortData = [
    {
      title: 'Título',
      value: data.title,
    },
    {
      title: 'Carrera',
      value: career?.name,
    },
    {
      title: 'Materia',
      value: course?.name,
    },
    {
      title: 'Ente/s Patrocinante',
      value: academicUnits.filter(Boolean).join(' - '),
    },
  ]

  const teamMembersIds = data.team
    .filter((tm) => tm.teamMemberId)
    .map((tm) => tm.teamMemberId) as string[]

  const teamMembers =
    teamMembersIds.length > 0 ? await getTeamMembersByIds(teamMembersIds) : []

  const team = data.team.map((tm) => {
    const teamMember = teamMembers.find((t) => t.id === tm.teamMemberId)
    const fullName = teamMember ? teamMember.name : `${tm.name} ${tm.last_name}`
    // This handles the case where the team member has multiple assignments. Bring the active one.
    const assignment = tm.assignments?.find((a) => !a.to)
    const toDate = tm.assignments?.find((a) => a.to)?.to
    return {
      fullName,
      role: assignment?.role ?? tm.role,
      category: tm.categoryToBeConfirmed,
      toBeConfirmed: tm.toBeConfirmed,
      hours: assignment?.hours ?? tm.hours ?? 0,
    }
  })

  const tableData = {
    title: 'Equipo',
    values: team.reduce((newVal: ListRowValues[], person, idx) => {
      newVal.push([
        {
          up: person.toBeConfirmed ? 'A definir' : person.fullName,
          down:
            person.toBeConfirmed ?
              categories.find((c) => c.id == person.category)?.name
            : person.role,
        },
        {
          up: idx == 0 ? '' : '',
          down: person.hours.toString(),
        },
      ])
      return newVal
    }, []),
  }

  tableData.values.unshift([
    { up: '', down: 'Miembro de equipo' },
    { up: '', down: 'Horas semanales' },
  ])

  return (
    <>
      <SectionViewer title="Identificación" description="Datos del proyecto">
        <>
          {/* Project Information */}
          {shortData.map((item) => (
            <ItemView key={item.title} title={item.title} value={item.value!} />
          ))}

          {/* Team Information Table */}
          <TeamTable team={team} categories={categories} />
        </>
      </SectionViewer>
    </>
  )
}
