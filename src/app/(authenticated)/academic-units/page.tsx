import { PageHeading } from '@layout/page-heading'
import { getAllAcademicUnits } from '@repositories/academic-unit'
import { canAccess } from '@utils/scopes'
import AcademicUnitsTable from 'modules/academic-unit/academic-units-table'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) return
    if (!canAccess('USERS', session.user.role)) redirect('/protocols')

    const academicUnits = await getAllAcademicUnits()

    return (
        <>
            <PageHeading title="Asignación de Secretarios de Investigación" />

            {academicUnits && academicUnits.length > 0 ? (
                // @ts-expect-error
                <AcademicUnitsTable academicUnits={academicUnits} />
            ) : (
                'No se encontraron unidades académicas'
            )}
        </>
    )
}
