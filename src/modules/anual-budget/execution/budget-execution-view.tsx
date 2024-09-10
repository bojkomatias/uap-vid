'use client'

import type { AcademicUnit, AmountIndex, Execution } from '@prisma/client'

import { Currency } from '@shared/currency'
import BudgetNewExecution from './budget-new-execution'
import { ExecutionType } from '@utils/anual-budget'
import { useEffect, useMemo, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { Check, Selector } from 'tabler-icons-react'
import { cx } from '@utils/cx'
import { currencyFormatter } from '@utils/formatters'
import { Strong, Text } from '@components/text'
import {
  subtractAmountIndex,
  sumAmountIndex,
  ZeroAmountIndex,
} from '@utils/amountIndex'
import { useQuery } from '@tanstack/react-query'
import { getCurrentIndexes } from '@repositories/finance-index'
import { Dialog, DialogBody, DialogTitle } from '@components/dialog'
import { Heading, Subheading } from '@components/heading'
import { Badge, BadgeButton } from '@components/badge'
import { Divider } from '@components/divider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/table'

export default function BudgetExecutionView({
  title,
  itemName,
  remaining,
  executions,
  obrero,
  positionIndex,
  anualBudgetTeamMemberId,
  executionType,
  academicUnits,
  maxAmountPerAcademicUnit,
  allExecutions,
}: {
  title: string
  itemName: string
  remaining: AmountIndex
  executions: Execution[]
  positionIndex: number
  executionType: ExecutionType
  obrero?: {
    pointsObrero: number
    pointPrice: AmountIndex
    hourlyRate: AmountIndex
  }
  anualBudgetTeamMemberId?: string
  academicUnits?: AcademicUnit[]
  maxAmountPerAcademicUnit?: AmountIndex
  allExecutions?: Execution[]
}) {
  const [opened, setOpened] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedAcademicUnit, setSelectedAcademicUnit] =
    useState<AcademicUnit>()

  const { data: priceData } = useQuery({
    queryKey: ['indexes'],
    queryFn: async () => await getCurrentIndexes(),
  })

  useEffect(() => {
    if (!academicUnits) return
    setSelectedAcademicUnit(academicUnits[0])
  }, [academicUnits])
  const filteredAcademicUnits =
    query === '' || !academicUnits ?
      academicUnits
    : academicUnits.filter((ac) => {
        return (
          ac.name.toLowerCase().includes(query.toLowerCase()) ||
          ac.shortname.toLowerCase().includes(query.toLocaleLowerCase())
        )
      })
  const executionAmountByAcademicUnit = useMemo(() => {
    if (!allExecutions) return ZeroAmountIndex
    return allExecutions
      .filter(
        (execution) => execution.academicUnitId === selectedAcademicUnit?.id
      )
      .reduce(
        (acc, curr) => {
          acc = sumAmountIndex([acc, curr.amountIndex ?? ZeroAmountIndex])
          return acc
        },
        { FCA: 0, FMR: 0 } as AmountIndex
      )
  }, [allExecutions, selectedAcademicUnit])

  const maxExecutionAmount = useMemo(() => {
    if (!maxAmountPerAcademicUnit) return remaining
    return subtractAmountIndex(
      maxAmountPerAcademicUnit,
      executionAmountByAcademicUnit
    )
  }, [maxAmountPerAcademicUnit, remaining, executionAmountByAcademicUnit])

  return (
    <>
      <Dialog
        open={opened}
        onClose={setOpened}
        size="2xl"
        className="space-y-4"
      >
        <DialogTitle>
          {executionType === ExecutionType.TeamMember ?
            'Honorarios'
          : 'Gastos directos'}
        </DialogTitle>

        <div className="flex items-center gap-2">
          {executionType === ExecutionType.TeamMember ?
            <Heading>{title}</Heading>
          : <>
              <Subheading>Detalle</Subheading>
              <Text>{title}</Text>
            </>
          }
        </div>

        <Strong>Categoría:</Strong>
        <Badge className="text-sm">{obrero ? 'Obrero' : itemName}</Badge>

        {obrero && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Text>Puntos:</Text>
              <Strong>{obrero.pointsObrero}</Strong>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Text>Precio punto: </Text>
              <Currency amountIndex={obrero.pointPrice} />
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Text>Precio hora:</Text>
              <Currency amountIndex={obrero.hourlyRate} />
            </div>
          </div>
        )}

        <Divider />
        <div>
          <Subheading>
            <Strong>Nueva ejecución</Strong>
          </Subheading>

          {remaining !== ZeroAmountIndex ?
            <BudgetNewExecution
              academicUnits={academicUnits}
              maxAmount={
                priceData ? maxExecutionAmount.FCA * priceData.currentFCA : 0
              }
              anualBudgetTeamMemberId={anualBudgetTeamMemberId}
              executionType={executionType}
              budgetItemPositionIndex={positionIndex}
            />
          : null}
        </div>
        <Divider />
        <div>
          <Subheading>
            <Strong>Ejecuciones históricas</Strong>
          </Subheading>

          {executions.reverse().length > 0 ?
            <Table bleed>
              <TableHead>
                <TableRow>
                  <TableHeader>Fecha</TableHeader>
                  <TableHeader className="text-right">Monto</TableHeader>
                </TableRow>
              </TableHead>

              <TableBody>
                {executions.reverse().map((execution, idx) => (
                  <TableRow key={`${execution.date.getTime()}${idx}`}>
                    <TableCell>
                      <Subheading>
                        {execution.date.toLocaleDateString()}
                      </Subheading>
                    </TableCell>
                    <TableCell className="text-right">
                      {execution.amountIndex ?
                        <Currency
                          amountIndex={execution.amountIndex ?? ZeroAmountIndex}
                        />
                      : currencyFormatter.format(execution.amount ?? 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          : <Text className="mt-6 text-center text-sm text-gray-600">
              <b>No hay ejecuciones históricas</b>
            </Text>
          }
        </div>
      </Dialog>

      <BadgeButton
        className="!font-bold"
        onClick={() => {
          setOpened(true)
        }}
      >
        Ver
      </BadgeButton>
    </>
  )
}
