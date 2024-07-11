import CategoriesTable from 'modules/categories/team-member-category-table'
import { getCategories } from '@repositories/team-member-category'
import { Heading, Subheading } from '@components/heading'
import { Button } from '@components/button'
import { Plus } from 'tabler-icons-react'
import { NewCategoryDialog } from 'modules/categories/new-category-dialog'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, categories] = await getCategories(searchParams)

  return (
    <>
      <div className="flex items-end">
        <Heading>Categorías de miembros de equipo de investigación</Heading>
        <NewCategoryDialog />
      </div>
      <Subheading>
        Lista de las categorías asignables a los miembros de equipo de un
        proyecto de investigación.
      </Subheading>

      <CategoriesTable categories={categories} totalRecords={totalRecords} />
    </>
  )
}
