import { Heading } from '@components/heading'
import { getAllAcademicUnits } from '@repositories/academic-unit'
import AcademicUnitsTable from 'modules/academic-unit/academic-units-table'
import { NewAcademicUnitFormDialog } from 'modules/academic-unit/new-academic-unit-form-dialog'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, academicUnits] = await getAllAcademicUnits(searchParams)

  return (
    <>
      <div className="flex items-end">
        <Heading>Unidades Académicas</Heading>
        <NewAcademicUnitFormDialog />
      </div>

      {academicUnits && academicUnits.length > 0 ?
        <AcademicUnitsTable
          academicUnits={academicUnits}
          totalRecords={totalRecords}
        />
      : 'No se encontraron unidades académicas'}
    </>
  )
}
