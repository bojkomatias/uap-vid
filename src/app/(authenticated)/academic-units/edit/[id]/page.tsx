import { Heading, Subheading } from '@components/heading'
import { getAcademicUnitWithSecretariesById } from '@repositories/academic-unit'
import { getAllSecretaries } from '@repositories/user'
import { EditSecretariesForm } from 'modules/academic-unit/edit-secretaries-form'

export default async function Page({ params }: { params: { id: string } }) {
  const academicUnit = await getAcademicUnitWithSecretariesById(params.id)
  const secretaries = await getAllSecretaries()

  if (!academicUnit) return

  return (
    <>
      <Heading>{academicUnit.name}</Heading>
      <Subheading>
        Asigne secretarios a la unidad academica, recien una vez enviado el
        formulario se va a actualizar con los datos modificados
      </Subheading>
      <EditSecretariesForm
        academicUnit={academicUnit}
        secretaries={secretaries}
      />
    </>
  )
}
