'use client'
import { notifications } from '@elements/notifications'
import { useForm } from '@mantine/form'
import type { AcademicUnit, AmountIndex, Index } from '@prisma/client'
import { updateAnualBudgetItems } from '@repositories/anual-budget'
import {
  ExecutionType,
  type AnualBudgetItemWithExecutions,
} from '@utils/anual-budget'
import { cx } from '@utils/cx'
import BudgetExecutionView from './execution/budget-execution-view'
import BudgetNewExecution from './execution/budget-new-execution'
import { useRouter } from 'next/navigation'
import { Currency } from '@shared/currency'
import {
  divideAmountIndex,
  subtractAmountIndex,
  sumAmountIndex,
  ZeroAmountIndex,
} from '@utils/amountIndex'
import { Button } from '@components/button'
import { Text } from '@components/text'
import { Heading, Subheading } from '@components/heading'
import { FormInput } from '@shared/form/form-input'
import { useAtom } from 'jotai'
import { indexSwapAtom } from '@shared/index-swapper'
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from '@components/dialog'
import { useState } from 'react'

export function BudgetItems({
  budgetId,
  editable,
  budgetItems,
  ABIe,
  ABIr,
  academicUnits,
  currentIndexes,
}: {
  budgetId: string
  editable: boolean
  budgetItems: AnualBudgetItemWithExecutions[]
  ABIe: AmountIndex
  ABIr: AmountIndex
  academicUnits: AcademicUnit[]
  currentIndexes: { currentFCA: number; currentFMR: number }
}) {
  const router = useRouter()
  const form = useForm({ initialValues: budgetItems })
  const [selectedItem, setSelectedItem] =
    useState<AnualBudgetItemWithExecutions | null>(null)

  if (budgetItems.length < 1) return null

  const { currentFCA } = currentIndexes
  const { currentFMR } = currentIndexes

  // Helper function to calculate executed amount for a budget item
  const calculateExecutedAmount = (executions: any[]): AmountIndex => {
    return executions.reduce(
      (acc, execution) => {
        if (!execution?.amountIndex) return acc
        return sumAmountIndex([acc, execution.amountIndex])
      },
      { FCA: 0, FMR: 0 } as AmountIndex
    )
  }

  const openItemDialog = (item: AnualBudgetItemWithExecutions) => {
    setSelectedItem(item)
  }

  const closeItemDialog = () => {
    setSelectedItem(null)
  }

  return (
    <div className="overflow-auto">
      <form
        className="mt-10 rounded-lg border p-4 dark:border-gray-800 print:border-none"
        onSubmit={form.onSubmit(async (values) => {
          if (!editable) return
          const itemsWithRemainingUpdated = Object.values(values).map(
            (item) => {
              const remainingIndex = {
                FCA: item.amount! / currentFCA,
                FMR: item.amount! / currentFMR,
              }
              const amountIndex = {
                FCA: item.amount! / currentFCA,
                FMR: item.amount! / currentFMR,
              }
              if (item.amount) {
                return { ...item, amountIndex, remainingIndex, amount: null }
              }
              return { ...item, amount: null }
            }
          )
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
          } else {
            notifications.show({
              title: 'No se pudo actualizar',
              message: 'Ocurrió un error al actualizar los datos',
              intent: 'error',
            })
          }
        })}
      >
        <div className="flex items-center">
          <div className="flex w-full items-center justify-between">
            <div>
              <Heading>Lista de gastos directos</Heading>
              <Text className="mt-1 text-sm text-gray-500">
                Haga clic en cualquier fila para ver detalles y gestionar
                ejecuciones
              </Text>
            </div>
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
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <colgroup>
                <col className={cx(!editable ? 'w-[45%]' : 'w-[50%]')} />
                <col className={cx(!editable ? 'w-[15%]' : 'w-[20%]')} />
                <col className={cx(!editable ? 'w-[15%]' : 'w-[20%]')} />
                <col className={cx(!editable ? 'w-[25%]' : 'w-[10%]')} />
              </colgroup>
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <Subheading>Detalle</Subheading>
                  </th>
                  <th
                    className={cx(
                      'hidden px-3 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100',
                      !editable && 'table-cell'
                    )}
                  >
                    <Subheading>Restante</Subheading>
                  </th>
                  <th
                    className={cx(
                      'hidden px-3 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100',
                      !editable && 'table-cell'
                    )}
                  >
                    <Subheading>Ejecutado</Subheading>
                  </th>
                  <th
                    className={cx(
                      'hidden px-3 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100',
                      !!editable && 'table-cell'
                    )}
                  >
                    <Subheading>A aprobar</Subheading>
                  </th>
                  <th className="px-3 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <Subheading>Total</Subheading>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {budgetItems.map((item, i) => (
                  <tr
                    key={i}
                    onClick={() => !editable && openItemDialog(item)}
                    className={cx(
                      'transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50',
                      !editable && 'cursor-pointer'
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Subheading className="text-gray-900 dark:text-gray-100">
                          {item.detail}
                        </Subheading>
                        <Text className="text-gray-500 dark:text-gray-400">
                          {item.type}
                        </Text>
                      </div>
                    </td>
                    <td
                      className={cx(
                        'hidden px-3 py-4 text-right',
                        !editable && 'table-cell'
                      )}
                    >
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <Currency amountIndex={item.remainingIndex} />
                      </div>
                    </td>
                    <td
                      className={cx(
                        'hidden px-3 py-4 text-right',
                        !editable && 'table-cell'
                      )}
                    >
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <Currency
                          amountIndex={subtractAmountIndex(
                            item.amountIndex,
                            item.remainingIndex
                          )}
                        />
                      </div>
                    </td>
                    <td
                      className={cx(
                        'hidden px-3 py-4 text-right',
                        !!editable && 'table-cell'
                      )}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm text-gray-600">$</span>
                        <FormInput
                          type="number"
                          className="w-32 text-right font-semibold"
                          {...form.getInputProps(`${i}.amount`)}
                          value={form.getInputProps(`${i}.amount`).value ?? ''}
                          onChange={(e) =>
                            form.setFieldValue(
                              `${i}.amount`,
                              e.target.value || null
                            )
                          }
                        />
                      </div>
                    </td>

                    <td className="px-3 py-4 text-right">
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        <Currency amountIndex={item.amountIndex} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="mt-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <Text className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Ejecutado
                </Text>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {!editable ?
                    <Currency amountIndex={ABIe} />
                  : '-'}
                </div>
              </div>
              <div className="text-center">
                <Text className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Restante
                </Text>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  <Currency amountIndex={ABIr} />
                </div>
              </div>
              <div className="text-center">
                <Text className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total
                </Text>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  <Currency amountIndex={sumAmountIndex([ABIe, ABIr])} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Item Details Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onClose={closeItemDialog} size="2xl">
          <DialogTitle>{selectedItem.detail}</DialogTitle>
          <DialogBody>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Tipo
                  </Text>
                  <Text className="font-medium">{selectedItem.type}</Text>
                </div>
                <div>
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Detalle
                  </Text>
                  <Text className="font-medium">{selectedItem.detail}</Text>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Ejecutado
                  </Text>
                  <Subheading className="text-xl">
                    <Currency
                      amountIndex={calculateExecutedAmount(
                        selectedItem.executions
                      )}
                    />
                  </Subheading>
                </div>
                <div className="rounded-lg bg-orange-50 p-4 text-center dark:bg-orange-900/20">
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Restante
                  </Text>
                  <Subheading className="text-xl">
                    <Currency amountIndex={selectedItem.remainingIndex} />
                  </Subheading>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Total Presupuestado
                  </Text>
                  <Subheading className="text-xl text-blue-700 dark:text-blue-300">
                    <Currency amountIndex={selectedItem.amountIndex} />
                  </Subheading>
                </div>
              </div>

              {/* New Execution Section */}
              {!editable &&
                selectedItem.remainingIndex &&
                (selectedItem.remainingIndex.FCA > 0 ||
                  selectedItem.remainingIndex.FMR > 0) && (
                  <div className="border-t pt-4">
                    <Subheading className="mb-3">Nueva Ejecución</Subheading>
                    <BudgetNewExecution
                      academicUnits={academicUnits}
                      maxAmount={selectedItem.remainingIndex.FCA}
                      executionType={ExecutionType.Item}
                      budgetItemPositionIndex={budgetItems.findIndex(
                        (item) => item.id === selectedItem.id
                      )}
                    />
                  </div>
                )}

              {/* Execution History */}
              {selectedItem.executions.length > 0 && (
                <div className="border-t pt-4">
                  <Subheading className="mb-3">
                    Historial de Ejecuciones ({selectedItem.executions.length})
                  </Subheading>
                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {selectedItem.executions
                      .slice()
                      .reverse()
                      .map((execution, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                        >
                          <div>
                            <Text className="font-medium">
                              {execution.date.toLocaleDateString('es-ES')}
                            </Text>
                          </div>
                          <Text className="font-semibold">
                            <Currency
                              amountIndex={
                                execution.amountIndex ?? ZeroAmountIndex
                              }
                            />
                          </Text>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {selectedItem.executions.length === 0 && !editable && (
                <div className="py-6 text-center text-gray-500">
                  <Text>
                    No hay ejecuciones registradas para este elemento.
                  </Text>
                </div>
              )}
            </div>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={closeItemDialog}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  )
}
