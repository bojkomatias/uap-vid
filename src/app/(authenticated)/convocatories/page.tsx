import { ConvocatoryTable } from '@convocatory/convocatory-table'
import {
  getAllConvocatories,
  getCurrentConvocatory,
} from '@repositories/convocatory'
import { NewConvocatoryDialog } from '@convocatory/new-convocatory-dialog'
import { Heading } from '@components/heading'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, convocatories] = await getAllConvocatories(searchParams)
  const currentConvocatory = await getCurrentConvocatory()

  return (
    <>
      <div className="flex items-end">
        <Heading className="grow">Convocatorias</Heading>
        <NewConvocatoryDialog />
      </div>

      <ConvocatoryTable
        totalRecords={totalRecords}
        convocatories={convocatories}
        currentConvocatory={currentConvocatory!}
      />
    </>
  )
}
