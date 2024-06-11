import { Button } from '@elements/button'
import { buttonStyle } from '@elements/button/styles'
import MultipleButton from '@elements/multiple-button'
import { Role } from '@prisma/client'
import {
  getAllConvocatories,
  getCurrentConvocatory,
} from '@repositories/convocatory'
import Link from 'next/link'
import { FilePlus } from 'tabler-icons-react'

export default async function CreateButton({ role }: { role: Role }) {
  if (role === Role.ADMIN) {
    const [, convocatories] = await getAllConvocatories({})
    if (!convocatories || convocatories.length === 0) return null
    const current = await getCurrentConvocatory()
    const options = convocatories.map((e) => ({
      title: e.name,
      href: `/protocols/new/0?convocatory=${e.id}`,
      description: `${e.from.toLocaleDateString(
        'es-AR'
      )},  ${e.to.toLocaleDateString('es-AR')}`,
    }))
    return (
      <MultipleButton
        defaultValue={
          current
            ? {
              title: current.name,
              href: `/protocols/new/0?convocatory=${current.id}`,
              description: `${current.from.toLocaleDateString(
                'es-AR'
              )},  ${current.to.toLocaleDateString('es-AR')}`,
            }
            : options[0]
        }
        options={options}
      />
    )
  } else {
    const currentConvocatory = await getCurrentConvocatory()
    if (!currentConvocatory)
      return (
        <Button intent={'secondary'} disabled>
          <FilePlus className="mr-2 h-4 w-4 text-current" /> Nueva
          Postulación
        </Button>
      )
    return (
      <Link
        href={`/protocols/new/0?convocatory=${currentConvocatory?.id}`}
        className={buttonStyle('secondary')}
        passHref
      >
        <FilePlus className="mr-2 h-4 w-4 text-current" /> Nueva
        Postulación
      </Link>
    )
  }
}
