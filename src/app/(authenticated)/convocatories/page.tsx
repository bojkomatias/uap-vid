import { ConvocatoryTable } from '@convocatory/convocatory-table'
import { PageHeading } from '@layout/page-heading'
import { CalendarPlus } from 'tabler-icons-react'
import {
  getAllConvocatories,
  getCurrentConvocatory,
} from '@repositories/convocatory'
import { NewConvocatoryDialog } from '@convocatory/new-convocatory-dialog'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, convocatories] = await getAllConvocatories(searchParams)
  const currentConvocatory = await getCurrentConvocatory()

  return (
    <>
      <PageHeading title="Lista de convocatorias" />
      {/* New convocatory Dialog */}
      <NewConvocatoryDialog />
      <ConvocatoryTable
        totalRecords={totalRecords}
        convocatories={convocatories}
        currentConvocatory={currentConvocatory!}
      />
    </>
  )
}
