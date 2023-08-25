'use client'
import { useProtocolContext } from '@utils/createContext'
import React, { useCallback, useEffect, useState } from 'react'
import Select from './inputs/select'
import NumberInput from './inputs/number-input'
import { Check, Plus, Selector, Trash, X } from 'tabler-icons-react'
import { Button } from '@elements/button'
import { cx } from '@utils/cx'
import { Combobox } from '@headlessui/react'
import type { TeamMember } from '@prisma/client'

export default function TeamMemberListForm() {
    const form = useProtocolContext()
    const path = 'sections.identification.team'

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

    const fetchData = useCallback(async () => {
        const res = await fetch(`/api/team-members`, {
            next: { revalidate: 120 },
        })
        setTeamMembers(await res.json())
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div>
            <div className="label text-center">miembros de equipo</div>
            <div className="space-y-3 rounded-xl border px-4 pb-2 pt-6">
                {form.values.sections.identification.team.map((_, index) => (
                    <div
                        key={index}
                        id={`row-${index}`}
                        className="flex w-full items-start justify-around gap-2"
                    >
                        <div className="w-60">
                            <Select
                                options={[
                                    'Director',
                                    'Codirector',
                                    'Investigador UAP',
                                    'Investigador Externo UAP',
                                    'Técnico Asistente',
                                    'Técnico Asociado',
                                    'Técnico Principal',
                                    'Profesional Adjunto',
                                    'Profesional Principal',
                                    'Becario CONICET',
                                    'A definir',
                                ]}
                                path={`${path}.${index}.role`}
                                label={'rol'}
                            />
                        </div>
                        <TeamMemberSelector
                            teamMembers={teamMembers}
                            index={index}
                        />
                        <div className="w-20">
                            <NumberInput
                                path={`${path}.${index}.hours`}
                                label={'Horas'}
                            />
                        </div>
                        <Trash
                            onClick={() => form.removeListItem(path, index)}
                            className={`mt-[2.2rem] h-5 flex-shrink cursor-pointer self-start text-primary hover:text-gray-400 active:scale-[0.90] ${
                                index == 0
                                    ? 'pointer-events-none invisible'
                                    : ''
                            }`}
                        />
                    </div>
                ))}

                <Button
                    onClick={() => {
                        form.insertListItem(path, {})

                        setTimeout(() => {
                            document
                                .getElementById(
                                    `row-${form.values.sections.identification.team.length}`
                                )
                                ?.getElementsByTagName('input')[0]
                                .focus()
                        }, 10)
                    }}
                    intent="outline"
                    className="mx-auto w-full max-w-xs"
                >
                    <p> Añadir otra fila </p>
                    <Plus className="h-4 text-gray-500" />
                </Button>
            </div>
        </div>
    )
}

function TeamMemberSelector({
    teamMembers,
    index,
}: {
    teamMembers: TeamMember[]
    index: number
}) {
    const form = useProtocolContext()
    const path = 'sections.identification.team'

    const [query, setQuery] = useState('')

    const filteredPeople =
        query === ''
            ? teamMembers
            : teamMembers.filter((member) => {
                  return member.name.toLowerCase().includes(query.toLowerCase())
              })

    return (
        <div className="flex-grow">
            <label htmlFor="select-user" className="label">
                Miembro del equipo de investigación
            </label>
            <Combobox
                as="div"
                value={
                    form.getInputProps(`${path}.${index}.teamMemberId`).value
                }
                onChange={(e: string) => {
                    form.setFieldValue(`${path}.${index}.teamMemberId`, e)
                    form.setFieldValue(`${path}.${index}.name`, null)
                    form.setFieldValue(`${path}.${index}.last_name`, null)
                }}
                className="relative"
            >
                <Combobox.Button className="relative w-full">
                    <Combobox.Input
                        autoComplete="off"
                        className="input disabled:bg-gray-100"
                        placeholder={`Seleccione un docente`}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            form.setFieldValue(
                                `${path}.${index}.name`,
                                e.target.value
                            )
                        }}
                        displayValue={() =>
                            teamMembers.find(
                                (e) =>
                                    e.id ===
                                    form.getInputProps(
                                        `${path}.${index}.teamMemberId`
                                    ).value
                            )?.name ??
                            form.getInputProps(`${path}.${index}.name`).value ??
                            '' +
                                form.getInputProps(`${path}.${index}.last_name`)
                                    .value ??
                            ''
                        }
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md pr-2 focus:outline-none">
                        <X
                            className={cx(
                                'h-6 w-6 rounded-full p-1 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:stroke-2 hover:text-gray-700 active:scale-95'
                            )}
                            onClick={(e) => {
                                form.setFieldValue(
                                    `${path}.${index}.teamMemberId`,
                                    null
                                )
                                form.setFieldValue(`${path}.${index}.name`, '')
                                form.setFieldValue(
                                    `${path}.${index}.last_name`,
                                    ''
                                )
                                e.stopPropagation()
                            }}
                            aria-hidden="true"
                        />
                        <Selector
                            className="h-5 text-gray-600 hover:text-gray-400"
                            aria-hidden="true"
                        />
                    </div>
                </Combobox.Button>

                {filteredPeople.length > 0 ? (
                    <Combobox.Options className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded border bg-white py-1 text-sm shadow focus:outline-none">
                        {filteredPeople.map((value) => (
                            <Combobox.Option
                                key={value.id}
                                value={value.id}
                                className={({ active }) =>
                                    cx(
                                        'relative cursor-default select-none py-2 pl-8 pr-2',
                                        active ? 'bg-gray-100' : 'text-gray-600'
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <span className="block truncate font-medium">
                                            <span
                                                className={cx(
                                                    active && 'text-gray-800',
                                                    selected && 'text-primary'
                                                )}
                                            >
                                                {value.name}
                                            </span>
                                        </span>

                                        {selected && (
                                            <span
                                                className={cx(
                                                    'absolute inset-y-0 left-0 flex items-center pl-2 text-primary',
                                                    active ? 'text-white' : ''
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
                        ))}
                    </Combobox.Options>
                ) : null}
            </Combobox>
        </div>
    )
}
