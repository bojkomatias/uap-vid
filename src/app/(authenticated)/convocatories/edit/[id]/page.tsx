import { Badge } from '@components/badge'
import { Heading } from '@components/heading'
import { Text } from '@components/text'
import { ConvocatoryForm } from '@convocatory/convocatory-form'

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
    <div className="max-w-4xl">
      <div className="flex items-center gap-2">
        <Heading>{convocatory.name}</Heading>
        {current && current.id === convocatory.id ?
          <Badge color="teal">Activa</Badge>
        : null}
      </div>
      <Text>
        Tenga en cuenta que esto puede afectar al resto de la applicación
      </Text>

      <ConvocatoryForm convocatory={convocatory} />
    </div>
  )
}
