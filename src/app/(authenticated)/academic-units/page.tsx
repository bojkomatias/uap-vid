import { PageHeading } from '@layout/page-heading'
import { getAllAcademicUnits } from '@repositories/academic-unit'
import { canAccess } from '@utils/scopes'
import AcademicUnitsTable from 'modules/academic-unit/academic-units-table'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { getAllSecretaries } from '@repositories/user'

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session || !canAccess('USERS', session.user.role))
        redirect('/protocols')

    const [totalRecords, academicUnits] = await getAllAcademicUnits(
        searchParams
    )
    const secretaries = await getAllSecretaries()
    if (!secretaries)
        return <div>No hay secretarios cargados en el sistema</div>

    return (
        <>
            <PageHeading title="Unidades Academicas" />

            {academicUnits && academicUnits.length > 0 ? (
                <AcademicUnitsTable
                    academicUnits={academicUnits}
                    secretaries={secretaries}
                    totalRecords={totalRecords}
                />
            ) : (
                'No se encontraron unidades académicas'
            )}
        </>
    )
}
