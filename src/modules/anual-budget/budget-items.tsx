'use client'
import { Button } from '@elements/button'
import type { AnualBudgetItem } from '@prisma/client'
import { cx } from '@utils/cx'
import { currencyFormatter } from '@utils/formatters'
import { UpdateABI } from './update-ABI'

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
            <div className="flex items-center">
                <div className="flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        Lista de gastos directos
                    </h1>
                </div>
            </div>
            <div className="-mx-4 mt-8 flow-root sm:mx-0">
                <table className="min-w-full">
                    <colgroup>
                        <col className={cx(approved ? 'w-[45%]' : 'w-[40%]')} />
                        <col className={cx(approved ? 'w-[15%]' : 'w-[20%]')} />
                        <col className={cx(approved ? 'w-[15%]' : 'w-[20%]')} />
                        <col className={cx(approved ? 'w-[15%]' : 'hidden')} />
                        <col className="w-[10%]" />
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
                                    'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900',
                                    approved && 'table-cell'
                                )}
                            >
                                Restante
                            </th>
                            <th
                                scope="col"
                                className={cx(
                                    'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900',
                                    approved && 'table-cell'
                                )}
                            >
                                Ejecutado
                            </th>
                            <th
                                scope="col"
                                className={cx(
                                    'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900',
                                    !approved && 'table-cell'
                                )}
                            >
                                A aprobar
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
                                    'table-cell py-3.5 pr-3 text-right text-sm font-semibold text-gray-900 sm:pr-0'
                                )}
                            >
                                {approved ? 'Ejecuciones' : 'Editar'}
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
                                            'hidden px-3 py-5 text-right text-sm',
                                            approved && 'table-cell'
                                        )}
                                    >
                                        ${currencyFormatter.format(remaining)}
                                    </td>
                                    <td
                                        className={cx(
                                            'hidden px-3 py-5 text-right text-sm',
                                            approved && 'table-cell'
                                        )}
                                    >
                                        $
                                        {currencyFormatter.format(
                                            amount - remaining
                                        )}
                                    </td>
                                    <td
                                        className={cx(
                                            'hidden px-3 py-5 text-right text-sm',
                                            !approved && 'table-cell'
                                        )}
                                    >
                                        ${currencyFormatter.format(amount)}
                                    </td>

                                    <td className="table-cell px-3 py-5 text-right text-sm">
                                        ${currencyFormatter.format(amount)}
                                    </td>
                                    <td>
                                        {approved ? (
                                            <Button
                                                intent={'secondary'}
                                                className="float-right px-2 py-0.5 text-xs"
                                            >
                                                Ver
                                            </Button>
                                        ) : (
                                            <UpdateABI
                                                budgetId="1"
                                                amount={amount}
                                            />
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
                                colSpan={approved ? 3 : 2}
                                className="table-cell pl-4 pt-6 text-left text-sm font-normal text-gray-500 sm:text-right"
                            >
                                Ejecutado
                            </th>
                            <td className="px-3 pt-6 text-right text-sm text-gray-500">
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
                                colSpan={approved ? 3 : 2}
                                className="table-cell pl-4 pt-4 text-left text-sm font-normal text-gray-500 sm:text-right"
                            >
                                Restante
                            </th>
                            <td className="px-3 pt-4 text-right text-sm text-gray-500">
                                ${currencyFormatter.format(ABIr)}
                            </td>
                        </tr>
                        <tr>
                            <th
                                scope="row"
                                colSpan={approved ? 3 : 2}
                                className="table-cell pl-4 pt-4 text-left text-sm font-semibold text-gray-900 sm:text-right"
                            >
                                Total
                            </th>
                            <td className="px-3 pt-4 text-right text-sm font-semibold text-gray-900">
                                ${currencyFormatter.format(ABIr + ABIe)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
