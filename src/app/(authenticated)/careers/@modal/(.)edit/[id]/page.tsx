import { Heading, Subheading } from '@components/heading'
import { getCareerById } from '@repositories/career'
import { EditCareerDialog } from 'modules/careers/edit-career-dialog'

import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const career = await getCareerById(id)

  if (!career) redirect('/careers')

  return (
    <>
      <EditCareerDialog career={career} />
    </>
  )
}
