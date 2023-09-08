'use client'
import { Button } from '@elements/button'
import Currency from '@elements/currency'
import { useForm, zodResolver } from '@mantine/form'
import type { Prisma } from '@prisma/client'
import { dateFormatter, formatCurrency } from '@utils/formatters'
import { ProtocolAnualBudgetSchema } from '@utils/zod'
import React from 'react'

type AnualBudgetWithRelations = Prisma.AnualBudgetGetPayload<{
    select: {
        id: true
        protocolId: true
        createdAt: true
        updatedAt: true
        year: true
        budgetTeamMembers: {
            select: {
                teamMember: {
                    include: { categories: { include: { category: true } } }
                }
                hours: true
                remainingHours: true
            }
        }
        budgetItems: true
        protocol: {
            select: {
                sections: {
                    select: {
                        identification: {
                            select: { title: true; sponsor: true }
                        }
                    }
                }
            }
        }
    }
}>
export default function AnualBudgetForm({
    protocolBudget,
}: {
    protocolBudget: AnualBudgetWithRelations
}) {
    const form = useForm({
        initialValues: protocolBudget,
        validate: zodResolver(ProtocolAnualBudgetSchema),
    })

    return (
        <form
            onSubmit={form.onSubmit((values) => console.log(values))}
            className="mx-auto mt-10 max-w-7xl space-y-6"
        >
            <div>
                <div>
                    Presupuesto anual{' '}
                    <span className="font-medium">{protocolBudget.year}</span>{' '}
                    de
                    <span className="ml-1 font-medium italic">
                        {protocolBudget.protocol.sections.identification.title}
                    </span>
                </div>
                <div className="space-x-6 text-sm font-light">
                    <span>
                        Creado: {dateFormatter.format(protocolBudget.createdAt)}
                    </span>
                    <span>
                        Ultima edición:{' '}
                        {dateFormatter.format(protocolBudget.updatedAt)}
                    </span>
                </div>
            </div>

            <div className="w-full border-t border-gray-200" />

            <div className="font-medium">Honorarios calculados</div>
            <div>
                {form.values.budgetTeamMembers.map(
                    ({ teamMember, hours, remainingHours }, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-4 gap-3 space-y-2"
                        >
                            <span className="flex flex-col">
                                <label className="label">Miembro</label>
                                <span>{teamMember.name}</span>
                            </span>
                            <span className="flex flex-col">
                                <label className="label">Categoría</label>
                                <span>
                                    {
                                        teamMember.categories.at(-1)?.category
                                            .name
                                    }
                                </span>
                            </span>
                            <span className="flex flex-col">
                                <label className="label text-right">
                                    Horas
                                </label>
                                <span className="text-right">{hours}</span>
                            </span>
                            <span className="flex flex-col">
                                <label className="label text-right">
                                    Horas restantes
                                </label>
                                <span className="text-right">
                                    {remainingHours}
                                </span>
                            </span>
                        </div>
                    )
                )}
            </div>
            <div className="flex flex-row-reverse">
                <span>Total: $ 500.000</span>
            </div>

            <div className="w-full border-t border-gray-200" />

            <div className="font-medium">Gastos directos</div>
            <div>
                {form.values.budgetItems.map(({ type, detail, amount }, i) => (
                    <div key={i} className="grid grid-cols-4 gap-3 space-y-2">
                        <span className="flex flex-col">
                            <label className="label">Tipo</label>
                            <span>{type}</span>
                        </span>
                        <span className="flex flex-col">
                            <label className="label">Detalle</label>
                            <span>{detail}</span>
                        </span>
                        <span className="flex flex-col items-end">
                            <label className="label">Monto solicitado</label>
                            <Currency amount={amount} />
                        </span>
                        <span className="flex flex-col items-end">
                            <label className="label">Monto restante</label>
                            <Currency amount={amount} />
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex flex-row-reverse">
                <span>
                    Total:
                    <Currency amount={500000} />
                </span>
            </div>

            <Button
                intent="secondary"
                type="submit"
                disabled={!form.isDirty()}
                className="float-right"
            >
                Guardar
            </Button>
        </form>
    )
}
