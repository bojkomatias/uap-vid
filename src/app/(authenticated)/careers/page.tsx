import { CareerTable } from 'modules/careers/careers-table'
import { getAllCareers } from '@repositories/career'
import { NewConvocatoryDialog } from '@convocatory/new-convocatory-dialog'
import { Heading } from '@components/heading'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, careers] = await getAllCareers(searchParams)

  return (
    <>
      <div className="flex items-end">
        <Heading>Carreras</Heading>
        {/* <NewConvocatoryDialog /> */}
      </div>

      <CareerTable totalRecords={totalRecords} careers={careers} />
    </>
  )
}
