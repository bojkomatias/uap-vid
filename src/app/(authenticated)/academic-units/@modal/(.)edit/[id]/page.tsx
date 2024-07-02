import { getAcademicUnitWithSecretariesById } from '@repositories/academic-unit'
import { getAllSecretaries } from '@repositories/user'
import { EditSecretariesInAcademicUnitDialog } from 'modules/academic-unit/edit-secretaries-in-academic-unit-dialog'

export default async function Page({ params }: { params: { id: string } }) {
  const academicUnit = await getAcademicUnitWithSecretariesById(params.id)
  const secretaries = await getAllSecretaries()

  if (!academicUnit) return

  return (
    <EditSecretariesInAcademicUnitDialog
      academicUnit={academicUnit}
      secretaries={secretaries}
    />
  )
}
