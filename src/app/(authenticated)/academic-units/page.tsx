import { PageHeading } from '@layout/page-heading'
import { getAllAcademicUnits } from '@repositories/academic-unit'
import { canAccess } from '@utils/scopes'
import AcademicUnitsTable from 'modules/academic-unit/academic-units-table'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/route'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session || !canAccess('USERS', session.user.role))
        redirect('/protocols')

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
