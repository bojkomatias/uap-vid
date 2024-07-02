'use client'
import { Button } from '@elements/button'
import CurrencyInput from '@elements/currency-input'
import { notifications } from '@elements/notifications'
import { useForm } from '@mantine/form'
import type { AcademicUnit, AnualBudgetItem } from '@prisma/client'
import { updateAnualBudgetItems } from '@repositories/anual-budget'
import { ExecutionType } from '@utils/anual-budget'
import { cx } from '@utils/cx'
import { currencyFormatter } from '@utils/formatters'
import BudgetExecutionView from './execution/budget-execution-view'
import { useRouter } from 'next/navigation'

export function BudgetItems({
  budgetId,
  editable,
  budgetItems,
  ABIe,
  ABIr,
  academicUnits,
}: {
  budgetId: string
  editable: boolean
  budgetItems: AnualBudgetItem[]
  ABIe: number
  ABIr: number
  academicUnits: AcademicUnit[]
}) {
  const router = useRouter()
  const form = useForm({ initialValues: budgetItems })

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        if (!editable) return
        const itemsWithRemainingUpdated = values.map((item) => {
          const remaining = item.amount
          return { ...item, remaining }
        })
        const res = await updateAnualBudgetItems(
          budgetId,
          itemsWithRemainingUpdated
        )
        if (res) {
          notifications.show({
            title: 'Valores actualizados',
            message: 'Los montos a aprobar fueron actualizados con éxito',
            intent: 'success',
          })
          router.refresh()
        }
      })}
    >
      <div className="flex items-center">
        <div className="flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-700">
            Lista de gastos directos
          </h1>
        </div>
      </div>

      <div className="-mx-4 mt-8 flow-root sm:mx-0">
        {editable ?
          <Button
            type="submit"
            intent="secondary"
            disabled={!form.isDirty()}
            className="float-right px-2 py-1.5 text-xs"
          >
            Guardar valores actualizados
          </Button>
        : null}
        <table className="min-w-full">
          <colgroup>
            <col className={cx(!editable ? 'w-[45%]' : 'w-[50%]')} />
            <col className={cx(!editable ? 'w-[15%]' : 'w-[20%]')} />
            <col className={cx(!editable ? 'w-[15%]' : 'w-[20%]')} />
            <col className={cx(!editable ? 'w-[15%]' : 'hidden')} />
            <col className={cx(!editable ? 'w-[10%]' : 'hidden')} />
          </colgroup>
          <thead className="border-b border-gray-300 text-gray-700">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-0"
              >
                Detalle
              </th>
              <th
                scope="col"
                className={cx(
                  'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700',
                  !editable && 'table-cell'
                )}
              >
                Restante
              </th>
              <th
                scope="col"
                className={cx(
                  'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700',
                  !editable && 'table-cell'
                )}
              >
                Ejecutado
              </th>
              <th
                scope="col"
                className={cx(
                  'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700',
                  !!editable && 'table-cell'
                )}
              >
                A aprobar
              </th>
              <th
                scope="col"
                className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-700"
              >
                Total
              </th>
              <th
                scope="col"
                className={cx(
                  'hidden py-3.5 pr-3 text-right text-sm font-semibold text-gray-700 sm:pr-0',
                  !editable && 'table-cell'
                )}
              >
                Ejecuciones
              </th>
            </tr>
          </thead>
          <tbody>
            {budgetItems.map(
              ({ detail, type, amount, remaining, executions }, i) => (
                <tr key={i} className="border-b border-gray-200 text-gray-600">
                  <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div className="font-medium text-gray-700">{detail}</div>
                    <div className="mt-1 truncate text-gray-500">{type}</div>
                  </td>
                  <td
                    className={cx(
                      'hidden px-3 py-5 text-right text-sm',
                      !editable && 'table-cell'
                    )}
                  >
                    ${currencyFormatter.format(remaining)}
                  </td>
                  <td
                    className={cx(
                      'hidden px-3 py-5 text-right text-sm',
                      !editable && 'table-cell'
                    )}
                  >
                    ${currencyFormatter.format(amount - remaining)}
                  </td>
                  <td
                    className={cx(
                      'hidden px-3 py-5 text-right text-sm',
                      !!editable && 'float-right table-cell'
                    )}
                  >
                    <CurrencyInput
                      defaultPrice={form.getInputProps(`${i}.amount`).value}
                      priceSetter={(e) => form.setFieldValue(`${i}.amount`, e)}
                      className={cx(
                        'w-32 text-xs',
                        form.isDirty(`${i}.amount`) &&
                          'border-warning-200 bg-warning-50'
                      )}
                    />
                  </td>

                  <td className="table-cell px-3 py-5 text-right text-sm">
                    ${currencyFormatter.format(amount)}
                  </td>
                  <td className={cx('hidden', !editable && 'table-cell')}>
                    <BudgetExecutionView
                      academicUnits={academicUnits}
                      maxAmountPerAcademicUnit={
                        budgetItems
                          .map((bi) => bi.amount)
                          .reduce((a, b) => a + b, 0) / academicUnits.length
                      }
                      allExecutions={budgetItems
                        .map((bi) => bi.executions)
                        .flat()}
                      positionIndex={i}
                      remaining={remaining}
                      title={detail}
                      executionType={ExecutionType.Item}
                      itemName={type}
                      executions={executions}
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>

          <tfoot>
            <tr>
              <th
                scope="row"
                colSpan={!editable ? 3 : 2}
                className="table-cell pl-4 pt-6 text-left text-sm font-normal text-gray-500 sm:text-right"
              >
                Ejecutado
              </th>
              <td className="px-3 pt-6 text-right text-sm text-gray-500">
                {!editable ?
                  <>${currencyFormatter.format(ABIe)}</>
                : '-'}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={!editable ? 3 : 2}
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
                colSpan={!editable ? 3 : 2}
                className="table-cell pl-4 pt-4 text-left text-sm font-semibold text-gray-700 sm:text-right"
              >
                Total
              </th>
              <td className="px-3 pt-4 text-right text-sm font-semibold text-gray-700">
                ${currencyFormatter.format(ABIr + ABIe)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </form>
  )
}
