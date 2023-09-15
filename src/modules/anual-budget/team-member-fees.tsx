'use client'
import type { AnualBudgetTeamMemberWithAllRelations } from '@utils/anual-budget'
import { cx } from '@utils/cx'
import { currencyFormatter } from '@utils/formatters'

export function TeamMemberFees({
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
    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        Honorarios Calculados
                    </h1>
                </div>
            </div>
            <div className="-mx-4 mt-8 flow-root sm:mx-0">
                <table className="min-w-full">
                    <colgroup>
                        <col
                            className={cx(
                                'w-full',
                                approved ? ' sm:w-[40%]' : ' sm:w-1/3'
                            )}
                        />
                        <col className={approved ? 'sm:w-[12%]' : 'w-1/6'} />
                        <col className={approved ? 'sm:w-[12%]' : 'w-1/6'} />
                        <col className={approved ? 'sm:w-[12%]' : 'w-1/6'} />
                        <col hidden={!approved} className="sm:w-[12%]" />
                        <col hidden={!approved} className="sm:w-[12%]" />
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
                                    'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 ',
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
                                    'hidden py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0',
                                    approved && 'sm:table-cell'
                                )}
                            >
                                Restante
                            </th>
                            <th
                                scope="col"
                                className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0"
                            >
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgetTeamMembers.map(
                            ({
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
                            }) => (
                                <tr
                                    key={id}
                                    className="border-b border-gray-200"
                                >
                                    <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div className="font-medium text-gray-900">
                                            {name}
                                        </div>
                                        <div className="mt-1 truncate text-gray-500">
                                            {memberRole} -
                                            {obrero ? (
                                                <i>Obrero: {pointsObrero}</i>
                                            ) : (
                                                <i>
                                                    {
                                                        categories.at(-1)
                                                            ?.category.name
                                                    }
                                                </i>
                                            )}
                                        </div>
                                    </td>
                                    <td className="table-cell px-3 py-5 text-right text-sm text-gray-500">
                                        {hours}
                                    </td>
                                    <td
                                        className={cx(
                                            'hidden px-3 py-5 text-right text-sm text-gray-500',
                                            approved && 'sm:table-cell'
                                        )}
                                    >
                                        {remainingHours}
                                    </td>
                                    <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                                        {currencyFormatter.format(
                                            categories
                                                .at(-1)
                                                ?.category.price.at(-1)
                                                ?.price ?? 0
                                        )}
                                    </td>
                                    <td
                                        className={cx(
                                            'hidden px-3 py-5 text-right text-sm text-gray-500',
                                            approved && 'sm:table-cell'
                                        )}
                                    >
                                        $
                                        {currencyFormatter.format(
                                            categories
                                                .at(-1)
                                                ?.category.price.at(-1)
                                                ?.price ?? 0 * remainingHours
                                        )}
                                    </td>
                                    <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">
                                        $
                                        {currencyFormatter.format(
                                            categories
                                                .at(-1)
                                                ?.category.price.at(-1)
                                                ?.price ?? 0 * hours
                                        )}
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
                                className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                            >
                                Ejecutado
                            </th>
                            <th
                                scope="row"
                                colSpan={2}
                                className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden"
                            >
                                Ejecutado
                            </th>
                            <td className="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">
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
                                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                            >
                                Restante
                            </th>
                            <th
                                scope="row"
                                colSpan={2}
                                className="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden"
                            >
                                Restante
                            </th>
                            <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                                ${currencyFormatter.format(ABTr)}
                            </td>
                        </tr>
                        <tr>
                            <th
                                scope="row"
                                colSpan={approved ? 5 : 3}
                                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
                            >
                                Total
                            </th>
                            <th
                                scope="row"
                                colSpan={2}
                                className="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden"
                            >
                                Total
                            </th>
                            <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                                ${currencyFormatter.format(ABTr + ABTe)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
