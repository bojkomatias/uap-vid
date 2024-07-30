import { CareerTable } from 'modules/careers/careers-table'
import { getAllCareers } from '@repositories/career'
import { Heading, Subheading } from '@components/heading'
import { NewCareerDialog } from 'modules/careers/new-career-dialog'
import { ContainerAnimations } from '@elements/container-animations'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, careers] = await getAllCareers(searchParams)

  return (
    <>
      <ContainerAnimations duration={0.4} delay={0}>
        <div className="flex items-end">
          <Heading>Carreras</Heading>
          <NewCareerDialog />
        </div>
        <Subheading>
          La lista de carreras de la Universidad Adventista del plata. A su vez
          cada carrera tiene su lista de asignaturas.
        </Subheading>
      </ContainerAnimations>
      <ContainerAnimations duration={0.3} delay={0.1} animation={2}>
        <CareerTable totalRecords={totalRecords} careers={careers} />
      </ContainerAnimations>
    </>
  )
}
