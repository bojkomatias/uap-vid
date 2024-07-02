import { Heading } from '@components/heading'
import CategoryForm from 'modules/categories/category-form'

export default async function Page() {
  return (
    <>
      <Heading>Crear nueva categoría</Heading>
      <CategoryForm />
    </>
  )
}
