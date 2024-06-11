import { ConvocatoryTable } from '@convocatory/convocatory-table'
import { PageHeading } from '@layout/page-heading'
import Link from 'next/link'
import { CalendarPlus } from 'tabler-icons-react'
import { buttonStyle } from '@elements/button/styles'
import {
  getAllConvocatories,
  getCurrentConvocatory,
} from '@repositories/convocatory'

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
      <div className="flex flex-row-reverse">
        <Link
          scroll={false}
          href={'/convocatories/new'}
          className={buttonStyle('secondary')}
        >
          <CalendarPlus className="h-4 w-4 text-current" />
          Nueva convocatoria
        </Link>
      </div>
      <ConvocatoryTable
        totalRecords={totalRecords}
        convocatories={convocatories}
        currentConvocatory={currentConvocatory!}
      />
    </>
  )
}
