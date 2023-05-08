import { Button } from '@elements/button'
import MultipleButton from '@elements/multiple-button'
import { Role } from '@prisma/client'
import {
    getAllConvocatories,
    getCurrentConvocatory,
} from '@repositories/convocatory'
import type { RoleType } from '@utils/zod'
import Link from 'next/link'
import { FilePlus } from 'tabler-icons-react'

export default async function CreateButton({ role }: { role: RoleType }) {
    if (role === Role.RESEARCHER) {
        const currentConvocatory = await getCurrentConvocatory()
        if (!currentConvocatory)
            return (
                <Button intent={'secondary'} disabled>
                    <FilePlus className="mr-2 h-5" /> Nueva Postulación
                </Button>
            )
        return (
            <Link
                href={`/protocols/new/0?convocatory=${currentConvocatory?.id}`}
                passHref
            >
                <Button intent={'secondary'}>
                    <FilePlus className="mr-2 h-5" /> Nueva Postulación
                </Button>
            </Link>
        )
    }
    if (role === Role.ADMIN || Role.SECRETARY) {
        const convocatories = await getAllConvocatories()
        if (!convocatories || convocatories.length === 0) return null
        const current = await getCurrentConvocatory()
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
                        : null
                }
                options={convocatories.map((e) => ({
                    title: e.name,
                    href: `/protocols/new/0?convocatory=${e.id}`,
                    description: `${e.from.toLocaleDateString(
                        'es-AR'
                    )},  ${e.to.toLocaleDateString('es-AR')}`,
                }))}
            />
        )
    }
}
