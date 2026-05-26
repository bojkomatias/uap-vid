import { Heading, Subheading } from '@components/heading'

import { getCareerById } from '@repositories/career'
import { CareerForm } from 'modules/careers/career-form'

import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const career = await getCareerById(id)

  if (!career) redirect('/careers')

  return (
    <>
      <div className="flex items-center gap-2">
        <Heading>{career.name}</Heading>
      </div>
      <Subheading>
        Tenga en cuenta que esto puede afectar al resto de la applicación
      </Subheading>

      <CareerForm career={career} />
    </>
  )
}
