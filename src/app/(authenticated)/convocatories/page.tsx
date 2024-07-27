import { ConvocatoryTable } from '@convocatory/convocatory-table'
import {
  getAllConvocatories,
  getCurrentConvocatory,
} from '@repositories/convocatory'
import { NewConvocatoryDialog } from '@convocatory/new-convocatory-dialog'
import { Heading } from '@components/heading'
import { ContainerAnimations } from '@elements/container-animations'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, convocatories] = await getAllConvocatories(searchParams)
  const currentConvocatory = await getCurrentConvocatory()

  return (
    <>
      <ContainerAnimations duration={0.4} delay={0}>
        <div className="flex items-end">
          <Heading>Convocatorias</Heading>
          <NewConvocatoryDialog />
        </div>
      </ContainerAnimations>
      <ContainerAnimations duration={0.3} delay={0.1} animation={2}>
        <ConvocatoryTable
          totalRecords={totalRecords}
          convocatories={convocatories}
          currentConvocatory={currentConvocatory!}
        />
      </ContainerAnimations>
    </>
  )
}
