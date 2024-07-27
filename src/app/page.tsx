import { Button } from '@components/button'
import { Heading, Subheading } from '@components/heading'
import { Text } from '@components/text'
import { List, NewSection } from 'tabler-icons-react'

export default async function Page() {
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <Heading>Bienvenido Matías</Heading>
      <Subheading>Actualmente estás autenticado como Administrador</Subheading>
      <Text className="mt-6">
        Podes comenzar por realizar alguna de las siguientes acciones:
      </Text>
      <div className="mx-auto mt-6 flex max-w-md flex-col items-start gap-3">
        <Button color="light">
          <NewSection data-slot="icon" />
          Crear proyecto
        </Button>
        <Button color="light">
          <List data-slot="icon" />
          Ir a la lista de proyectos
        </Button>
      </div>
    </div>
  )
}
