import { redirect } from 'next/navigation'
import {
  getConvocatoryById,
  getCurrentConvocatory,
} from '@repositories/convocatory'
import { EditConvocatoryDialog } from '@convocatory/edit-convocatory-dialog'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const convocatory = await getConvocatoryById(id)

  if (!convocatory) redirect('/convocatories')
  const current = await getCurrentConvocatory()

  return (
    <EditConvocatoryDialog
      convocatory={convocatory}
      isCurrent={current ? convocatory.id === current.id : false}
    />
  )
}
