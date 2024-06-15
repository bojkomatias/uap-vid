import { PageHeading } from '@layout/page-heading'
import Link from 'next/link'
import Tabs from '@elements/tabs'
import { getAcademicUnitsTabs } from '@repositories/academic-unit'

export default async function AnualBudgetsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const academicUnits = await getAcademicUnitsTabs()

  const tabs = academicUnits.map((ac) => {
    return {
      ...ac,
      _count: ac._count.AcademicUnitAnualBudgets,
    }
  })

  return (
    <>
      <PageHeading title="Presupuestos anuales" />
      <p className="ml-2 text-sm text-gray-500">
        Lista de los presupuestos anuales de los distintos proyectos de
        investigación{' '}
        <Link
          className="transition hover:underline"
          href="/protocols?page=1&filter=state&values=ACCEPTED"
        >
          aceptados
        </Link>
        .
      </p>
      <Tabs tabs={tabs} />
      {children}
    </>
  )
}
