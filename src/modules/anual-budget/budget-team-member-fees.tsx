'use client'
import { Button } from '@elements/button'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { updateAnualBudgetTeamMemberHours } from '@repositories/anual-budget'
import type { AnualBudgetTeamMemberWithAllRelations } from '@utils/anual-budget'
import { cx } from '@utils/cx'
import { currencyFormatter } from '@utils/formatters'
import { Check } from 'tabler-icons-react'

export function BudgetTeamMemberFees({
    approved,
    budgetTeamMembers,
    ABTe,
    ABTr,
}: {
    approved: boolean
    budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
    ABTe: number
    ABTr: number
}) {
    const form = useForm({ initialValues: budgetTeamMembers })
    return (
        <form
            onSubmit={form.onSubmit(async (values) => {
                if (approved) return

                const res = await updateAnualBudgetTeamMemberHours(
                    values.map((e) => {
                        return {
                            id: e.id,
                            hours: e.hours,
                            remainingHours: e.hours,
                        }
                    })
                )
                if (res)
                    return notifications.show({
                        title: 'Valores actualizados',
                        message:
                            'Las horas de los miembros de equipo fueron actualizadas con éxito',
                        color: 'teal',
                        icon: <Check />,
                        radius: 0,
                        style: {
                            marginBottom: '.8rem',
                        },
                    })
            })}
        >
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        Honorarios Calculados
                    </h1>
                </div>
            </div>

            <div className="-mx-4 mt-8 flow-root sm:mx-0">
                {!approved ? (
                    <Button
                        type="submit"
                        intent="secondary"
                        disabled={!form.isDirty()}
                        className="float-right px-2 py-1.5 text-xs"
                    >
                        Guardar valores actualizados
                    </Button>
                ) : null}
                <table className="min-w-full">
                    <colgroup>
                        <col
                            className={cx(approved ? ' w-[30%]' : ' w-[38%]')}
                        />
                        <col className={approved ? 'w-[12%]' : 'w-[20%]'} />
                        <col className={approved ? 'w-[12%]' : 'w-[20%]'} />
                        <col className={approved ? 'w-[12%]' : 'w-[20%]'} />
                        <col className={approved ? 'w-[12%]' : 'hidden'} />
                        <col className={approved ? 'w-[12%]' : 'hidden'} />
                        <col className={approved ? 'w-[10%]' : 'hidden'} />
                    </colgroup>
                    <thead className="border-b border-gray-300 text-gray-900">
                        <tr>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                            >
                                Miembro
                            </th>
                            <th
                                scope="col"
                                className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                            >
                                Horas
                            </th>
                            <th
                                scope="col"
                                className={cx(
                                    'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900',
                                    approved && 'sm:table-cell'
                                )}
                            >
                                Horas restantes
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                            >
                                Valor / hora
                            </th>
                            <th
                                scope="col"
                                className={cx(
                                    'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900',
                                    approved && 'sm:table-cell'
                                )}
                            >
                                Restante
                            </th>
                            <th
                                scope="col"
                                className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                            >
                                Total
                            </th>
                            <th
                                scope="col"
                                className={cx(
                                    'hidden py-3.5 pr-3 text-right text-sm font-semibold text-gray-900 sm:pr-0',
                                    approved && 'table-cell'
                                )}
                            >
                                Ejecuciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {form.values.map(
                            (
                                {
                                    teamMember: {
                                        id,
                                        name,
                                        obrero,
                                        categories,
                                        pointsObrero,
                                    },
                                    memberRole,
                                    hours,
                                    remainingHours,
                                },
                                i
                            ) => (
                                <tr
                                    key={id}
                                    className="border-b border-gray-200"
                                >
                                    <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div className="font-medium text-gray-900">
                                            {name}
                                        </div>
                                        <div className="mt-1 truncate text-gray-500">
                                            {memberRole}
                                            {' - '}
                                            {obrero ? (
                                                <span className="font-medium text-gray-700">
                                                    Puntos de obrero:{' '}
                                                    {pointsObrero}
                                                </span>
                                            ) : (
                                                <span className="font-medium text-gray-700">
                                                    {
                                                        categories.at(-1)
                                                            ?.category.name
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="table-cell px-3 py-5 text-right text-sm text-gray-600">
                                        <input
                                            type="number"
                                            {...form.getInputProps(
                                                `${i}.hours`
                                            )}
                                            onBlur={(e) =>
                                                form.setFieldValue(
                                                    `${i}.hours`,
                                                    Number(e.target.value)
                                                )
                                            }
                                            className={cx(
                                                'input w-16 text-right text-xs',
                                                form.isDirty(`${i}.hours`) &&
                                                    'border-warning-200 bg-warning-50'
                                            )}
                                            placeholder="24"
                                        />
                                    </td>
                                    <td
                                        className={cx(
                                            'hidden px-3 py-5 text-right text-sm text-gray-600',
                                            approved && 'sm:table-cell'
                                        )}
                                    >
                                        {remainingHours}
                                    </td>
                                    <td className="hidden px-3 py-5 text-right text-sm text-gray-600 sm:table-cell">
                                        $
                                        {currencyFormatter.format(
                                            categories
                                                .at(-1)
                                                ?.category.price.at(-1)
                                                ?.price ?? 0
                                        )}
                                    </td>
                                    <td
                                        className={cx(
                                            'hidden px-3 py-5 text-right text-sm text-gray-600',
                                            approved && 'sm:table-cell'
                                        )}
                                    >
                                        $
                                        {currencyFormatter.format(
                                            (categories
                                                .at(-1)
                                                ?.category.price.at(-1)
                                                ?.price ?? 0) * remainingHours
                                        )}
                                    </td>
                                    <td className="px-3 py-5 text-right text-sm text-gray-600 ">
                                        $
                                        {currencyFormatter.format(
                                            (categories
                                                .at(-1)
                                                ?.category.price.at(-1)
                                                ?.price ?? 0) * hours
                                        )}
                                    </td>
                                    <td
                                        className={cx(
                                            'hidden',
                                            approved && 'table-cell'
                                        )}
                                    >
                                        <Button
                                            intent={'secondary'}
                                            className="float-right px-2 py-0.5 text-xs"
                                        >
                                            Ver
                                        </Button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th
                                scope="row"
                                colSpan={approved ? 5 : 3}
                                className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0 sm:text-right"
                            >
                                Ejecutado
                            </th>
                            <td className="px-3 pt-6 text-right text-sm text-gray-500">
                                {approved ? (
                                    <> ${currencyFormatter.format(ABTe)}</>
                                ) : (
                                    '-'
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th
                                scope="row"
                                colSpan={approved ? 5 : 3}
                                className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0 sm:text-right"
                            >
                                Restante
                            </th>
                            <td className="px-3 pt-4 text-right text-sm text-gray-500">
                                ${currencyFormatter.format(ABTr)}
                            </td>
                        </tr>
                        <tr>
                            <th
                                scope="row"
                                colSpan={approved ? 5 : 3}
                                className="pl-4 pr-3 pt-6 text-left text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0 sm:text-right"
                            >
                                Total
                            </th>

                            <td className="px-3 pt-4 text-right text-sm font-semibold text-gray-900">
                                ${currencyFormatter.format(ABTr + ABTe)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </form>
    )
}
