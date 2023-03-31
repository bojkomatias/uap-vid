import { Button } from '@elements/custom-button'
import MultipleButton from '@elements/multiple-button'
import { Role } from '@prisma/client'
import {
    getAllConvocatories,
    getCurrentConvocatory,
} from '@repositories/convocatory'
import { canExecute } from '@utils/scopes'
import { ACTION, RoleType } from '@utils/zod'
import Link from 'next/link'
import { FilePlus } from 'tabler-icons-react'

export default async function CreateButton({ role }: { role: RoleType }) {
    if (role === Role.RESEARCHER) {
        const currentConvocatory = await getCurrentConvocatory()
        if (!currentConvocatory)
            return (
                <Button intent={'tertiary'} disabled>
                    <FilePlus className="mr-3 h-5" /> Nueva Postulación
                </Button>
            )
        return (
            <Link
                href={`/protocols/new/0?convocatory=${currentConvocatory?.id}`}
                passHref
            >
                <Button intent={'tertiary'}>
                    <FilePlus className="mr-3 h-5" /> Nueva Postulación
                </Button>
            </Link>
        )
    }
    if (role === Role.ADMIN || Role.SECRETARY) {
        const convocatories = await getAllConvocatories()
        if (!convocatories) return null
        return (
            <MultipleButton
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
