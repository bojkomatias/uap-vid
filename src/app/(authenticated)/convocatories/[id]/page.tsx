import { ConvocatoryForm } from '@convocatory/convocatory-form'
import { PageHeading } from '@layout/page-heading'
import {
  getConvocatoryById,
  getCurrentConvocatory,
} from '@repositories/convocatory'

import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const convocatory = await getConvocatoryById(params.id)

  if (!convocatory) redirect('/convocatories')
  const current = await getCurrentConvocatory()

  return (
    <div>
      <PageHeading
        title={
          <span>
            Convocatoria:{' '}
            <span className="font-light">{convocatory?.name}</span>
          </span>
        }
      />
      <div className="mt-20" />

      {current && current.id === convocatory.id ?
        <div className="mx-auto max-w-5xl pl-4">
          <span className="rounded border bg-gray-50 px-2 py-0.5 text-sm font-semibold uppercase text-gray-600">
            Convocatoria Actual
          </span>
        </div>
      : null}

      <ConvocatoryForm convocatory={convocatory} isNew={false} />
    </div>
  )
}
