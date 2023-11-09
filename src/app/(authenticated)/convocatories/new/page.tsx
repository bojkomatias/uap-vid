import { ConvocatoryForm } from '@convocatory/convocatory-form'
import { PageHeading } from '@layout/page-heading'

import { redirect } from 'next/navigation'

export default async function Page() {
    const convocatory = {
        name: '',
        from: new Date(),
        to: new Date(),
        year: new Date().getFullYear(),
    }

    if (!convocatory) redirect('/convocatories')

    return (
        <div>
            <PageHeading title={'Nueva Convocatoria'} />
            <div className="mt-20" />
            <ConvocatoryForm convocatory={convocatory} isNew={true} />
        </div>
    )
}
