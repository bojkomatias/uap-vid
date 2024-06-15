import { ConvocatoryForm } from '@convocatory/convocatory-form'
import { DialogTitle, DialogDescription } from '@components/dialog'
import { InterceptDialog } from '@shared/intercept-dialog'
import { redirect } from 'next/navigation'
import {
  getConvocatoryById,
  getCurrentConvocatory,
} from '@repositories/convocatory'
import { Badge } from '@components/badge'

export default async function Page({ params }: { params: { id: string } }) {
  const convocatory = await getConvocatoryById(params.id)

  if (!convocatory) redirect('/convocatories')
  const current = await getCurrentConvocatory()

  return (
    <InterceptDialog
      intercept={`/convocatories/edit/${params.id}`}
      push="/convocatories"
      size="xl"
    >
      <div className="flex items-center gap-2">
        <DialogTitle>{convocatory.name}</DialogTitle>
        {current && current.id === convocatory.id ?
          <Badge color="teal">Activa</Badge>
        : null}
      </div>
      <DialogDescription>
        Tenga en cuenta que esto puede afectar al resto de la applicación
      </DialogDescription>
      <ConvocatoryForm convocatory={convocatory} />
    </InterceptDialog>
  )
}
