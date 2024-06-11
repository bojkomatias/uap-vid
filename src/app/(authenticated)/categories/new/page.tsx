import { PageHeading } from '@layout/page-heading'
import CategoryForm from 'modules/categories/category-form'

export default async function Page() {
  return (
    <>
      <PageHeading title={'Crear nueva categoría'} />
      <CategoryForm />
    </>
  )
}
