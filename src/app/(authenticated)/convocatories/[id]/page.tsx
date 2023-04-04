import { ConvocatoryForm } from '@convocatory/convocatory-form'
import { PageHeading } from '@layout/page-heading'
import { Convocatory } from '@prisma/client'
import {
    getConvocatoryById,
    getCurrentConvocatory,
} from '@repositories/convocatory'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
    const convocatory =
        params.id === 'new'
            ? {
                  name: '',
                  from: new Date(),
                  to: new Date(),
                  year: new Date().getFullYear(),
              }
            : await getConvocatoryById(params.id)
    if (!convocatory) return redirect('/convocatories')

    return (
        <div>
            <PageHeading
                title={
                    params.id === 'new' ? (
                        'Nueva Convocatoria'
                    ) : (
                        <span>
                            Convocatoria:{' '}
                            <span className="font-light">
                                {convocatory?.name}
                            </span>
                        </span>
                    )
                }
            />

            <ConvocatoryForm
                convocatory={convocatory}
                isNew={params.id === 'new'}
            />
        </div>
    )
}
