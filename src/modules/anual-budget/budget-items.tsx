'use client'

import { notifications } from '@elements/notifications'
import { useForm } from '@mantine/form'
import type { AcademicUnit, AmountIndex, AnualBudgetItem } from '@prisma/client'
import { updateAnualBudgetItems } from '@repositories/anual-budget'
import { ExecutionType } from '@utils/anual-budget'
import { cx } from '@utils/cx'
import BudgetExecutionView from './execution/budget-execution-view'
import { useRouter } from 'next/navigation'
import { Currency } from '@shared/currency'
import {
  divideAmountIndex,
  subtractAmountIndex,
  sumAmountIndex,
} from '@utils/amountIndex'
import { Button } from '@components/button'
import { Text } from '@components/text'
import { Heading, Subheading } from '@components/heading'
import { FormInput } from '@shared/form/form-input'

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
  ABIe: AmountIndex
  ABIr: AmountIndex
  academicUnits: AcademicUnit[]
}) {
  const router = useRouter()
  const form = useForm({ initialValues: budgetItems })

  if (budgetItems.length < 1) return null

  return (
    <form
      className="mt-10 rounded-lg border p-4 dark:border-gray-800 print:border-none"
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
        <div className="flex w-full items-center justify-between">
          <Heading>Lista de gastos directos</Heading>
          {editable && (
            <Button
              outline
              type="submit"
              disabled={!form.isDirty()}
              className="print:hidden"
            >
              Guardar valores actualizados
            </Button>
          )}
        </div>
      </div>

      <div className="-mx-4 mt-8 flow-root sm:mx-0">
        <table className="min-w-full">
          <colgroup>
            <col className={cx(!editable ? 'w-[45%]' : 'w-[50%]')} />
            <col className={cx(!editable ? 'w-[15%]' : 'w-[20%]')} />
            <col className={cx(!editable ? 'w-[15%]' : 'w-[20%]')} />
            <col className={cx(!editable ? 'w-[15%]' : 'hidden')} />
            <col className={cx(!editable ? 'w-[10%]' : 'hidden')} />
          </colgroup>
          <thead className="border-b text-gray-700 dark:border-gray-700">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-0"
              >
                <Subheading>Detalle</Subheading>
              </th>
              <th
                scope="col"
                className={cx(
                  'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700',
                  !editable && 'table-cell'
                )}
              >
                <Subheading>Restante</Subheading>
              </th>
              <th
                scope="col"
                className={cx(
                  'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700',
                  !editable && 'table-cell'
                )}
              >
                <Subheading>Ejecutado</Subheading>
              </th>
              <th
                scope="col"
                className={cx(
                  'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700',
                  !!editable && 'table-cell'
                )}
              >
                <Subheading>A aprobar</Subheading>
              </th>
              <th
                scope="col"
                className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-700"
              >
                <Subheading>Total</Subheading>
              </th>
              <th
                scope="col"
                className={cx(
                  'hidden py-3.5 pr-3 text-right text-sm font-semibold text-gray-700 sm:pr-0 print:hidden',
                  !editable && 'table-cell'
                )}
              >
                <Subheading>Ejecuciones</Subheading>
              </th>
            </tr>
          </thead>
          <tbody>
            {budgetItems.map(
              (
                {
                  detail,
                  type,
                  amountIndex: amount,
                  remainingIndex: remaining,
                  executions,
                },
                i
              ) => (
                <tr
                  key={i}
                  className="relative border-b text-gray-600 dark:border-gray-800"
                >
                  <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0 print:py-0">
                    <Subheading>{detail}</Subheading>
                    <Text>{type}</Text>
                  </td>
                  <td
                    className={cx(
                      'hidden px-3 py-5 text-right text-sm',
                      !editable && 'table-cell'
                    )}
                  >
                    <Currency amountIndex={remaining} />
                  </td>
                  <td
                    className={cx(
                      'hidden px-3 py-5 text-right text-sm',
                      !editable && 'table-cell'
                    )}
                  >
                    <Currency
                      amountIndex={subtractAmountIndex(amount, remaining)}
                    />
                  </td>
                  <td
                    className={cx(
                      'hidden px-3 py-5 text-right text-sm ',
                      !!editable && 'float-right flex items-center gap-2'
                    )}
                  >
                    $
                    <FormInput
                      type="number"
                      defaultValue={form.getInputProps(`${i}.amount`).value}
                      className={cx('ml-full float-right w-32')}
                      {...form.getInputProps(`${i}.amount`)}
                    />
                  </td>

                  <td className="table-cell px-3 py-5 text-right text-sm">
                    <Currency amountIndex={amount} />
                  </td>
                  <td
                    className={cx(
                      'hidden text-right print:hidden',
                      !editable && 'table-cell'
                    )}
                  >
                    <BudgetExecutionView
                      academicUnits={academicUnits}
                      maxAmountPerAcademicUnit={divideAmountIndex(
                        sumAmountIndex(budgetItems.map((bi) => bi.amountIndex)),
                        academicUnits.length
                      )}
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
                <Text>Ejecutado</Text>{' '}
              </th>
              <td className="px-3 pt-6 text-right text-sm text-gray-500">
                {!editable ?
                  <Currency amountIndex={ABIe} />
                : '-'}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={!editable ? 3 : 2}
                className="table-cell pl-4 pt-4 text-left text-sm font-normal text-gray-500 sm:text-right"
              >
                <Text>Restante</Text>
              </th>
              <td className="px-3 pt-4 text-right text-sm text-gray-500">
                <Currency amountIndex={ABIr} />
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={!editable ? 3 : 2}
                className="table-cell pl-4 pt-4 text-left text-sm font-semibold text-gray-700 sm:text-right"
              >
                <Subheading>Total</Subheading>
              </th>
              <td className="px-3 pt-4 text-right text-sm font-semibold text-gray-700">
                <Currency amountIndex={sumAmountIndex([ABIe, ABIr])} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </form>
  )
}
