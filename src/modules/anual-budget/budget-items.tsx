'use client'
import type { AnualBudgetItem } from '@prisma/client'
import { cx } from '@utils/cx'
import { currencyFormatter } from '@utils/formatters'

export function BudgetItems({
    approved,
    budgetItems,
    ABIe,
    ABIr,
}: {
    approved: boolean
    budgetItems: AnualBudgetItem[]
    ABIe: number
    ABIr: number
}) {
    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        Lista de gastos directos
                    </h1>
                </div>
            </div>
            <div className="-mx-4 mt-8 flow-root sm:mx-0">
                <table className="min-w-full">
                    <colgroup>
                        <col className={cx('w-full sm:w-1/2')} />
                        <col className="sm:w-1/4" />
                        <col className="sm:w-1/4" />
                    </colgroup>
                    <thead className="border-b border-gray-300 text-gray-900">
                        <tr>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                            >
                                Detalle
                            </th>
                            <th
                                scope="col"
                                className={cx(
                                    'invisible table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-900',
                                    approved && 'visible'
                                )}
                            >
                                Restante
                            </th>
                            <th
                                scope="col"
                                className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-0"
                            >
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgetItems.map(
                            (
                                { detail, type, amount, remaining, executions },
                                i
                            ) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-200 text-gray-600"
                                >
                                    <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div className="font-medium text-gray-900">
                                            {detail}
                                        </div>
                                        <div className="mt-1 truncate text-gray-500">
                                            {type}
                                        </div>
                                    </td>
                                    <td
                                        className={cx(
                                            'invisible table-cell px-3 py-5 text-right text-sm',
                                            approved && 'visible'
                                        )}
                                    >
                                        ${currencyFormatter.format(remaining)}
                                    </td>
                                    <td className="table-cell px-3 py-5 text-right text-sm sm:pr-0">
                                        ${currencyFormatter.format(amount)}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th
                                scope="row"
                                colSpan={2}
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
                                    <>${currencyFormatter.format(ABIe)}</>
                                ) : (
                                    '-'
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th
                                scope="row"
                                colSpan={2}
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
                                ${currencyFormatter.format(ABIr)}
                            </td>
                        </tr>
                        <tr>
                            <th
                                scope="row"
                                colSpan={2}
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
                                ${currencyFormatter.format(ABIr + ABIe)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
