'use client'
import { Button } from '@elements/button'
import { Combobox } from '@headlessui/react'
import { notifications } from '@elements/notifications'
import type { User } from '@prisma/client'
import { cx } from '@utils/cx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check, Selector } from 'tabler-icons-react'

export const ResearcherReassignation = ({
  protocolId,
  researcherId,
  researchers,
}: {
  protocolId: string
  researcherId: string
  researchers: User[]
}) => {
  const router = useRouter()
  const [showSelector, setShowSelector] = useState(false)

  const reassignResearcher = async (newResearcherId: string) => {
    // Validate if the same value, if it is don't update
    if (researcherId === newResearcherId) return
    const reassigned = await fetch(`/api/protocol/${protocolId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ researcherId: newResearcherId }),
    })
    if (reassigned.ok) {
      notifications.show({
        title: 'Protocolo reasignado',
        message: 'El protocolo ha sido transferido de dueño con éxito',
        intent: 'success',
      })
      setShowSelector(false)
      return router.refresh()
    }
    return notifications.show({
      title: 'Error al reasignar',
      message: 'Lo lamentamos, ha ocurrido un error',
      intent: 'error',
    })
  }

  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? researchers
      : researchers.filter((user) => {
          return user.name.toLowerCase().includes(query.toLowerCase())
        })

  return researchers.length > 0 && showSelector ? (
    <Combobox
      as="div"
      value={researcherId}
      onChange={(e) => {
        if (e !== null) reassignResearcher(e)
      }}
      className="relative z-10 w-80"
    >
      <Combobox.Button className="relative w-full">
        <Combobox.Input
          autoComplete="off"
          className="input form-input px-3 py-1 text-sm"
          placeholder={`Seleccione un usuario`}
          onChange={(e) => setQuery(e.target.value)}
          displayValue={() =>
            researchers.find((user) => user.id === researcherId)?.name ?? ''
          }
        />

        <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md pr-2 focus:outline-none">
          <Selector className="h-4 text-gray-500" aria-hidden="true" />
        </div>
      </Combobox.Button>

      {filteredPeople.length > 0 ? (
        <Combobox.Options className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded border bg-white py-1 text-sm shadow focus:outline-none">
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
                    <span
                      title={value.email}
                      className={cx(
                        'ml-2 truncate text-xs font-light',
                        active ? 'text-gray-700' : 'text-gray-500'
                      )}
                    >
                      {value.email}
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
  ) : (
    <Button
      intent="outline"
      size="xs"
      disabled={researchers.length === 0}
      onClick={() => setShowSelector(true)}
    >
      Reasignar investigador
    </Button>
  )
}
