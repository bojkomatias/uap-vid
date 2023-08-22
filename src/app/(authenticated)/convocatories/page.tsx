import { ConvocatoryTable } from '@convocatory/convocatory-table'
import { PageHeading } from '@layout/page-heading'
import { canAccess } from '@utils/scopes'
import { ACCESS } from '@utils/zod'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { CalendarPlus } from 'tabler-icons-react'
import { buttonStyle } from '@elements/button/styles'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) return
    if (!canAccess(ACCESS.CONVOCATORIES, session.user.role))
        redirect('/protocols')

    return (
        <>
            <PageHeading title="Lista de convocatorias" />
            <div className="flex flex-row-reverse">
                <Link
                    href={'/convocatories/new'}
                    className={buttonStyle('secondary')}
                    passHref
                >
                    <CalendarPlus className="h-5 w-5" />
                    <span className="ml-3"> Nueva convocatoria</span>
                </Link>
            </div>
            <ConvocatoryTable />
        </>
    )
}
