import { ConvocatoryTable } from '@convocatory/convocatory-table'
import { PageHeading } from '@layout/page-heading'
import Link from 'next/link'
import { CalendarPlus } from 'tabler-icons-react'
import { buttonStyle } from '@elements/button/styles'

export default async function Page() {
    return (
        <>
            <PageHeading title="Lista de convocatorias" />
            <div className="flex flex-row-reverse">
                <Link
                    href={'/convocatories/new'}
                    className={buttonStyle('secondary')}
                    passHref
                >
                    <CalendarPlus className="h-5 w-5 text-current" />
                    Nueva convocatoria
                </Link>
            </div>
            <ConvocatoryTable />
        </>
    )
}
