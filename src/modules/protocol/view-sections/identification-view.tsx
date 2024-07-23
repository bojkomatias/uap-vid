import type { ProtocolSectionsIdentification } from '@prisma/client'
import type { ListRowValues } from '@protocol/elements/view/item-list-view'
import ItemListView from '@protocol/elements/view/item-list-view'
import SectionViewer from '../elements/view/section-viewer'
import ItemView from '@protocol/elements/view/item-view'
import { getTeamMembersByIds } from '@repositories/team-member'
import { getAcademicUnitByIdWithoutIncludes } from '../../../repositories/academic-unit'
import { getCareerById, getCourseById } from '@repositories/career'
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
      value: academicUnits.join(' - '),
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
    return {
      fullName,
      role: tm.role,
      hours: tm.hours,
    }
  })

  const tableData = {
    title: 'Equipo',
    values: team.reduce((newVal: ListRowValues[], person) => {
      newVal.push([
        {
          up: person.fullName,
          down: person.role,
        },
        {
          up: 'Horas semanales',
          down: person.hours,
        },
      ])
      return newVal
    }, []),
  }
  return (
    <>
      <SectionViewer title="Identificación" description="Datos del proyecto">
        <>
          {/* Details of project */}
          {shortData.map((item) => (
            <ItemView key={item.title} title={item.title} value={item.value!} />
          ))}
          {/* Team details */}
          <ItemListView data={tableData} />
        </>
      </SectionViewer>
    </>
  )
}
