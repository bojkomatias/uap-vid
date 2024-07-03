import { Heading, Subheading } from '@components/heading'
import { getCareerById } from '@repositories/career'
import { EditCareerDialog } from 'modules/careers/edit-career-dialog'

import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const career = await getCareerById(params.id)

  if (!career) redirect('/careers')

  return (
    <>
      <EditCareerDialog career={career} />
    </>
  )
}
