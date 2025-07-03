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

// Custom Team Table Component
const TeamTable = ({
  team,
  categories,
}: {
  team: any[]
  categories: any[]
}) => {
  return (
    <>
      <DescriptionTerm>Integrantes del Equipo de Investigación</DescriptionTerm>
      <DescriptionDetails>
        <div className="space-y-2">
          {/* Table Header */}
          <DescriptionDetails className="grid grid-cols-3 gap-4 !border-t-0  border-b !pt-0 pb-2">
            <Text className="text-left">Nombre</Text>
            <Text className="text-left">Rol / Categoría</Text>
            <Text className="text-left">Horas semanales</Text>
          </DescriptionDetails>

          {/* Table Rows */}
          {team.map((person, index) => (
            <Info
              className={`${person.active && 'pointer-events-none'}`}
              key={index}
              content={
                person.toDate ?
                  `${person.fullName} dejó de colaborar en el proyecto el ${new Date(person.toDate).getDate()} de ${new Date(person.toDate).toLocaleString('es-ES', { month: 'long' })} de ${new Date(person.toDate).getFullYear()}`
                : ''
              }
            >
              <div
                className={`grid grid-cols-3 gap-4 py-1 ${
                  !person.active && 'line-through opacity-50'
                }`}
              >
                <Text className="text-left ">
                  {person.toBeConfirmed ? 'A definir' : person.fullName}
                </Text>
                <Text className="text-left ">
                  {person.toBeConfirmed ?
                    categories.find((c) => c.id == person.category)?.name ||
                    'Categoría pendiente'
                  : person.role}
                </Text>
                <Text className="text-left ">{person.hours.toString()}</Text>
              </div>
            </Info>
          ))}
        </div>
      </DescriptionDetails>
    </>
  )
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
      active: !toDate,
      toDate: toDate ? toDate.toISOString() : null,
    }
  })

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
