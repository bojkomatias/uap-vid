import CategoriesTable from 'modules/categories/team-member-category-table'
import { getCategories } from '@repositories/team-member-category'
import { Heading, Subheading } from '@components/heading'
import { Button } from '@components/button'
import { Plus } from 'tabler-icons-react'
import { NewCategoryDialog } from 'modules/categories/new-category-dialog'
import { ContainerAnimations } from '@elements/container-animations'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const [totalRecords, categories] = await getCategories(searchParams)

  return (
    <>
      <ContainerAnimations duration={0.4} delay={0}>
        <div className="flex items-end">
          <Heading>Categorías de miembros de equipo de investigación</Heading>
          <NewCategoryDialog />
        </div>
        <Subheading>
          Lista de las categorías asignables a los miembros de equipo de un
          proyecto de investigación.
        </Subheading>
      </ContainerAnimations>
      <ContainerAnimations duration={0.3} delay={0.1} animation={2}>
        <CategoriesTable categories={categories} totalRecords={totalRecords} />
      </ContainerAnimations>
    </>
  )
}
