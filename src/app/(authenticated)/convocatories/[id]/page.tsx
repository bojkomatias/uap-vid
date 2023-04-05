import { ConvocatoryForm } from '@convocatory/convocatory-form'
import { PageHeading } from '@layout/page-heading'

import {
    getConvocatoryById,
    getCurrentConvocatory,
} from '@repositories/convocatory'
import { Convocatory } from '@utils/zod'
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
    const current = await getCurrentConvocatory()

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
            <div className="mt-20" />
            {/* @ts-expect-error Don't know how to handle .id (less)*/}
            {params.id !== 'new' && current && current.id === convocatory.id ? (
                <div className="mx-auto max-w-5xl pl-4">
                    <span className="rounded border bg-gray-50 px-2 py-0.5 text-sm font-semibold uppercase text-gray-600">
                        Convocatoria Actual
                    </span>
                </div>
            ) : null}

            <ConvocatoryForm
                convocatory={convocatory}
                isNew={params.id === 'new'}
            />
        </div>
    )
}
