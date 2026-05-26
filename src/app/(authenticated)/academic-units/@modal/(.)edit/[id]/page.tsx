import { getAcademicUnitWithSecretariesById } from '@repositories/academic-unit'
import { getAllSecretaries } from '@repositories/user'
import { EditSecretariesDialog } from 'modules/academic-unit/edit-secretaries-dialog'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const academicUnit = await getAcademicUnitWithSecretariesById(id)
  const secretaries = await getAllSecretaries()

  if (!academicUnit) return

  return (
    <EditSecretariesDialog
      academicUnit={academicUnit}
      secretaries={secretaries}
    />
  )
}
