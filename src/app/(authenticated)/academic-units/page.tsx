import { Heading, Subheading } from '@components/heading'
import { ContainerAnimations } from '@elements/container-animations'
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
      <ContainerAnimations duration={0.4} delay={0}>
        <div className="flex items-end">
          <Heading>Unidades Académicas</Heading>
          <NewAcademicUnitFormDialog />
        </div>
        <Subheading>
          Lista de las unidades académicas dadas de alta en el sistema. Puede
          asignarse secretarios así como un presupuesto anual a las mismas.
        </Subheading>
      </ContainerAnimations>
      <ContainerAnimations duration={0.3} delay={0.1} animation={2}>
        {academicUnits && academicUnits.length > 0 ?
          <AcademicUnitsTable
            academicUnits={academicUnits}
            totalRecords={totalRecords}
          />
        : 'No se encontraron unidades académicas'}
      </ContainerAnimations>
    </>
  )
}
