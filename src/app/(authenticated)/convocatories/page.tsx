import { ConvocatoryTable } from '@convocatory/convocatory-table'
import { Button } from '@elements/button'
import { PageHeading } from '@layout/page-heading'
import { canAccess } from '@utils/scopes'
import { ACCESS } from '@utils/zod'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { CalendarPlus } from 'tabler-icons-react'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) return
    if (!canAccess(ACCESS.CONVOCATORIES, session.user.role))
        redirect('/protocols')

    return (
        <>
            <PageHeading title="Lista de convocatorias" />
            <div className="flex flex-row-reverse">
                <Link href={'/convocatories/new'} passHref>
                    <Button intent="secondary">
                        <CalendarPlus className="h-5 w-5" />
                        <span className="ml-3"> Nueva convocatoria</span>
                    </Button>
                </Link>
            </div>
            {/* @ts-expect-error */}
            <ConvocatoryTable />
        </>
    )
}
