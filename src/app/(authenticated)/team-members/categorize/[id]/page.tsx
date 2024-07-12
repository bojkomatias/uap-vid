import { Heading } from '@components/heading'
import { getTeamMemberById } from '@repositories/team-member'
import {
  getAllCategories,
  getObreroCategory,
} from '@repositories/team-member-category'
import CategorizationForm from 'modules/team-member/categorization-form'

export default async function Page({ params }: { params: { id: string } }) {
  const member = await getTeamMemberById(params.id)
  const categories = await getAllCategories()
  const obreroCategory = await getObreroCategory()

  return (
    <>
      <Heading>Categorización de investigación</Heading>
      <CategorizationForm
        member={member}
        categories={categories}
        obreroCategory={obreroCategory}
      />
    </>
  )
}
