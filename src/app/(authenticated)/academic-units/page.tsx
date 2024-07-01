import { Heading } from '@components/heading'
import { getAllAcademicUnits } from '@repositories/academic-unit'
import { getAllSecretaries } from '@repositories/user'
import AcademicUnitsTable from 'modules/academic-unit/academic-units-table'
import { NewAcademicUnitFormDialog } from 'modules/academic-unit/new-academic-unit-form-dialog'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, academicUnits] = await getAllAcademicUnits(searchParams)
  const secretaries = await getAllSecretaries()
  if (!secretaries) return <div>No hay secretarios cargados en el sistema</div>

  return (
    <>
      <div className="flex items-end">
        <Heading>Unidades Académicas</Heading>
        <NewAcademicUnitFormDialog />
      </div>

      {academicUnits && academicUnits.length > 0 ?
        <AcademicUnitsTable
          academicUnits={academicUnits}
          secretaries={secretaries}
          totalRecords={totalRecords}
        />
      : 'No se encontraron unidades académicas'}
    </>
  )
}
