import { PageHeading } from '@layout/page-heading'
import { getAllAcademicUnits } from '@repositories/academic-unit'
import AcademicUnitsTable from 'modules/academic-unit/academic-units-table'

export default async function Page() {
    const academicUnits = await getAllAcademicUnits()

    return (
        <>
            <PageHeading title="Asignación de Secretarios de Investigación" />

            {academicUnits && academicUnits.length > 0 ? (
                <AcademicUnitsTable academicUnits={academicUnits} />
            ) : (
                'No se encontraron unidades académicas'
            )}
        </>
    )
}
