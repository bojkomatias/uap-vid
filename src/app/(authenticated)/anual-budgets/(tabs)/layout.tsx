import Tabs from '@elements/tabs'
import { getAcademicUnitsTabs } from '@repositories/academic-unit'
import { Heading, Subheading } from '@components/heading'
import { Text, TextLink } from '@components/text'

export default async function AnualBudgetsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const academicUnits = await getAcademicUnitsTabs()

  // const tabs = academicUnits.map((ac) => {
  //   return {
  //     ...ac,
  //     _count: ac._count.AcademicUnitAnualBudgets,
  //   }
  // })

  return (
    <>
      {/* <Heading>Presupuestos anuales</Heading>
      <Subheading>
        Lista de los presupuestos anuales de los distintos proyectos de
        investigación{' '}
        <TextLink
          className="transition hover:underline"
          href="/protocols?page=1&filter=state&values=ACCEPTED"
        >
          aceptados
        </TextLink>
      </Subheading>
      <Tabs tabs={tabs} /> */}
      {children}
    </>
  )
}
