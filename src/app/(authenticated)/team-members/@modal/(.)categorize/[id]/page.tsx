import { getTeamMemberById } from '@repositories/team-member'
import {
  getAllCategories,
  getObreroCategory,
} from '@repositories/team-member-category'
import { CategorizationDialog } from 'modules/team-member/categorization-dialog'

export default async function Page({ params }: { params: { id: string } }) {
  const member = await getTeamMemberById(params.id)
  const categories = await getAllCategories()
  const obreroCategory = await getObreroCategory()

  return (
    <CategorizationDialog
      member={member}
      categories={categories}
      obreroCategory={obreroCategory}
    />
  )
}
