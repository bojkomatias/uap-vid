'use client'

import type { AcademicUnit, Execution } from '@prisma/client'
import { Button } from '@elements/button'

import Currency from '@elements/currency'
import BudgetNewExecution from './budget-new-execution'
import { ExecutionType } from '@utils/anual-budget'
import { useEffect, useState } from 'react'
import CustomDrawer from '@elements/custom-drawer'
import { Combobox } from '@headlessui/react'
import { Check, Selector, X } from 'tabler-icons-react'
import { cx } from '@utils/cx'

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
}: {
    title: string
    itemName: string
    remaining: number
    executions: Execution[]
    positionIndex: number
    executionType: ExecutionType
    obrero?: { pointsObrero: number; pointPrice: number }
    anualBudgetTeamMemberId?: string
    academicUnits?: AcademicUnit[]
}) {
    const [opened, setOpened] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedAcademicUnit, setSelectedAcademicUnit] =
        useState<AcademicUnit>()
    useEffect(() => {
        if (!academicUnits) return
        setSelectedAcademicUnit(academicUnits[0])
    }, [academicUnits])
    const filteredAcademicUnits =
        query === '' || !academicUnits
            ? academicUnits
            : academicUnits.filter((ac) => {
                  return (
                      ac.name.toLowerCase().includes(query.toLowerCase()) ||
                      ac.shortname
                          .toLowerCase()
                          .includes(query.toLocaleLowerCase())
                  )
              })
    return (
        <>
            <CustomDrawer title="Ejecuciones" open={opened} onClose={setOpened}>
                <section
                    className="flex flex-col gap-4"
                    onClick={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 px-4 py-3">
                        <h1 className="text-xl font-semibold">
                            {executionType === ExecutionType.TeamMember
                                ? 'Honorario de equipo'
                                : 'Gasto Directo'}
                        </h1>
                        <div className="flex  items-center gap-1">
                            <p className="text-sm font-semibold text-gray-600">
                                {executionType === ExecutionType.TeamMember
                                    ? 'Nombre y Apellido:'
                                    : 'Detalle:'}
                            </p>
                            <p className="text-sm">{title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-600">
                                Categoría:
                            </p>
                            <p className="text-sm">
                                {obrero ? 'Obrero' : itemName}
                            </p>
                        </div>
                        {obrero && (
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-sm font-semibold text-gray-600">
                                    Puntos: {obrero.pointsObrero}
                                </p>
                                <p className="text-sm font-semibold text-gray-600">
                                    Precio Punto: ${obrero.pointPrice}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 px-4 py-3">
                        {remaining > 0 ? (
                            <>
                                <p className="text-md font-semibold text-gray-600">
                                    Nueva Ejecución:
                                </p>
                                {academicUnits ? (
                                    <Combobox
                                        as="div"
                                        value={selectedAcademicUnit?.id}
                                        onChange={(value) => {
                                            if (value) {
                                                setSelectedAcademicUnit(
                                                    academicUnits?.find(
                                                        (ac) => ac.id === value
                                                    )
                                                )
                                            }
                                        }}
                                        className="relative z-10"
                                    >
                                        <Combobox.Button className="relative w-2/3">
                                            <Combobox.Input
                                                autoComplete="off"
                                                onChange={(event) =>
                                                    setQuery(event.target.value)
                                                }
                                                className="input disabled:bg-gray-100"
                                                placeholder={`Seleccione una unidad academica`}
                                                displayValue={() =>
                                                    academicUnits?.find(
                                                        (ac) =>
                                                            ac.id ===
                                                            selectedAcademicUnit?.id
                                                    )?.shortname ?? ''
                                                }
                                            />

                                            <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md pr-2 focus:outline-none">
                                                <Selector
                                                    className="h-4 text-gray-600 hover:text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </Combobox.Button>

                                        {filteredAcademicUnits &&
                                        filteredAcademicUnits.length > 0 ? (
                                            <Combobox.Options className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded border bg-white py-1 text-sm shadow focus:outline-none">
                                                {filteredAcademicUnits.map(
                                                    (value) => (
                                                        <Combobox.Option
                                                            key={value.id}
                                                            value={value.id}
                                                            className={({
                                                                active,
                                                            }) =>
                                                                cx(
                                                                    'relative cursor-default select-none py-2 pl-8 pr-2',
                                                                    active
                                                                        ? 'bg-gray-100'
                                                                        : 'text-gray-600'
                                                                )
                                                            }
                                                        >
                                                            {({
                                                                active,
                                                                selected,
                                                            }) => (
                                                                <>
                                                                    <span className="block truncate font-medium">
                                                                        <span
                                                                            title={
                                                                                value.shortname
                                                                            }
                                                                            className={cx(
                                                                                'ml-3 truncate text-xs font-light',
                                                                                active
                                                                                    ? 'text-gray-700'
                                                                                    : 'text-gray-500'
                                                                            )}
                                                                        >
                                                                            {
                                                                                value.name
                                                                            }
                                                                        </span>
                                                                    </span>

                                                                    {selected && (
                                                                        <span
                                                                            className={cx(
                                                                                'absolute inset-y-0 left-0 flex items-center pl-2 text-primary',
                                                                                active
                                                                                    ? 'text-white'
                                                                                    : ''
                                                                            )}
                                                                        >
                                                                            <Check
                                                                                className="h-4 w-4 text-gray-500"
                                                                                aria-hidden="true"
                                                                            />
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </Combobox.Option>
                                                    )
                                                )}
                                            </Combobox.Options>
                                        ) : null}
                                    </Combobox>
                                ) : null}
                                <BudgetNewExecution
                                    academicUnit={selectedAcademicUnit}
                                    maxAmount={remaining}
                                    anualBudgetTeamMemberId={
                                        anualBudgetTeamMemberId
                                    }
                                    executionType={executionType}
                                    budgetItemPositionIndex={positionIndex}
                                />
                            </>
                        ) : null}
                        {executions.length > 0 ? (
                            <>
                                <p className="text-sm text-gray-600">
                                    Ejecuciones históricas:
                                </p>
                                <table className="table-auto text-sm text-gray-600">
                                    <thead>
                                        <tr className="text-left ">
                                            <th className="font-semibold">
                                                Monto
                                            </th>
                                            <th className="font-semibold">
                                                Fecha
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {executions
                                            .reverse()
                                            .map((execution, idx) => {
                                                return (
                                                    <>
                                                        <tr
                                                            key={`${execution.date.getTime()}${idx}`}
                                                        >
                                                            <td className="pt-2">
                                                                <Currency
                                                                    amount={
                                                                        execution.amount
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                {execution.date.toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <p className="mt-6 text-center text-sm text-gray-600">
                                <b>No hay ejecuciones históricas</b>
                            </p>
                        )}
                    </div>
                </section>
            </CustomDrawer>

            <Button
                className="float-right px-2 py-0.5 text-xs"
                onClick={() => {
                    setOpened(true)
                }}
                intent="secondary"
            >
                Ver
            </Button>
        </>
    )
}
