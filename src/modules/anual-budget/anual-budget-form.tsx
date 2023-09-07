'use client'
import { Button } from '@elements/button'
import { useForm, zodResolver } from '@mantine/form'
import type { AnualBudget, Prisma } from '@prisma/client'
import { ProtocolAnualBudgetSchema } from '@utils/zod'
import React from 'react'

type AnualBudgetWithRelations = Prisma.AnualBudgetGetPayload<{
    select: {
        id: true
        protocolId: true
        createdAt: true
        updatedAt: true
        year: true
        budgetTeamMembers: { select: { teamMember: true } }
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
                <div className="mb-2 text-sm font-medium">
                    Honorarios calculados
                </div>
                <pre className="prose">
                    {JSON.stringify(form.values.budgetTeamMembers, null, 2)}
                </pre>
                <div>
                    {form.values.budgetTeamMembers.map((tm, i) => (
                        <div key={i}>{tm.teamMember.id}</div>
                    ))}
                </div>
            </div>
            <div className="relative">
                <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                >
                    <div className="w-full border-t border-gray-300" />
                </div>
            </div>
            <div>
                <div className="mb-2 text-sm font-medium">Gastos directos</div>
                <pre className="prose">
                    {JSON.stringify(form.values.budgetItems, null, 2)}
                </pre>
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
