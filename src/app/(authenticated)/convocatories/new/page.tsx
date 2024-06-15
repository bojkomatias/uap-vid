import { Heading } from '@components/heading'
import { Text } from '@components/text'

import { ConvocatoryForm } from '@convocatory/convocatory-form'

export default function Page() {
  const convocatory = {
    name: '',
    from: new Date(),
    to: new Date(),
    year: new Date().getFullYear(),
  }

  return (
    <div className="mt-20 max-w-5xl">
      <Heading>Crear convocatoria</Heading>
      <Text>
        Aquí puede crear una nueva convocatoria a cual asignar proyectos de
        investigación
      </Text>
      <div className="mt-10" />

      <ConvocatoryForm convocatory={convocatory} />
    </div>
  )
}
