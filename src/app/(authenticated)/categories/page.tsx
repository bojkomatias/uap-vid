import { PageHeading } from '@layout/page-heading'
import { cx } from '@utils/cx'
import { buttonStyle } from '@elements/button/styles'
import Link from 'next/link'
import CategoriesTable from 'modules/categories/team-member-category-table'
import { getCategories } from '@repositories/team-member-category'
import { Heading, Subheading } from '@components/heading'
import { Button } from '@components/button'
import { CodePlus, Plus, VariablePlus } from 'tabler-icons-react'

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
        <Button scroll={false} href={'/categories/new'}>
          <Plus data-slot="icon" />
          Crear categoría
        </Button>
      </div>
      <Subheading>
        Lista de las categorías asignables a los miembros de equipo de un
        proyecto de investigación.
      </Subheading>

      <CategoriesTable categories={categories} totalRecords={totalRecords} />
    </>
  )
}
