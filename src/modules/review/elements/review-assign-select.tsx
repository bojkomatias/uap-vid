'use client'
import { Combobox } from '@headlessui/react'
import { notifications } from '@elements/notifications'
import type { Review, User, ReviewType } from '@prisma/client'
import type { ProtocolState } from '@prisma/client'
import { EvaluatorsByReviewType } from '@utils/dictionaries/EvaluatorsDictionary'
import { cx } from '@utils/cx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Selector, Check } from 'tabler-icons-react'
import { Button } from '@elements/button'

interface ReviewAssignSelectProps {
  type: ReviewType
  users: User[]
  review: Review | null
  protocolId: string
  protocolState: ProtocolState
}

const ReviewAssignSelect = ({
  type,
  users,
  review,
  protocolId,
  protocolState,
}: ReviewAssignSelectProps) => {
  const router = useRouter()

  const changeState = async (reviewerId: string) => {
    // Validate if the same value, if it is don't update
    if (review?.reviewerId === reviewerId) return
    const assigned = await fetch(`/api/protocol/${protocolId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        protocolState,
        review: review ?? null,
        reviewerId,
        type,
      }),
    })
    if (assigned.ok) {
      notifications.show({
        title: 'Evaluador asignado',
        message: 'El evaluador ha sido asignado con éxito',
        intent: 'success',
      })

      setShow(false)
      return router.refresh()
    }
    return notifications.show({
      title: 'No hemos podido asignar el evaluador',
      message: 'Lo lamentamos, ha ocurrido un error',
      intent: 'error',
    })
  }

  const [query, setQuery] = useState('')

  const filteredPeople =
    query === '' ? users : (
      users.filter((person) => {
        return person.name.toLowerCase().includes(query.toLowerCase())
      })
    )
  const [show, setShow] = useState(false)

  if (!show && !review?.reviewerId)
    return (
      <Button
        intent="outline"
        size="xs"
        className="relative"
        onClick={() => setShow(true)}
      >
        <div className="invisible absolute left-36 top-0 z-40 ml-1.5 origin-top-left rounded-md shadow-sm after:absolute after:-left-1 after:top-3.5 after:h-2 after:w-2 after:rotate-45 after:rounded-[1px] after:bg-gray-100 group-hover:visible">
          <div className="w-64 whitespace-normal rounded-md bg-gray-100 px-3 py-2 text-left text-xs font-light text-gray-600">
            Al asignar el evaluador el protocolo cambiará de estado.
          </div>
        </div>
        Asignar evaluador
      </Button>
    )
  if (!show && review?.reviewerId)
    return (
      <Button
        intent="outline"
        size="xs"
        className="relative"
        onClick={() => setShow(true)}
      >
        <div className="invisible absolute left-36 top-0 z-40 ml-1.5 origin-top-left rounded-md shadow-sm after:absolute after:-left-1 after:top-3.5 after:h-2 after:w-2 after:rotate-45 after:rounded-[1px] after:bg-gray-100 group-hover:visible">
          <div className="whitespace-normal rounded-md bg-gray-100 px-3 py-2 text-left text-xs font-light text-gray-600">
            Al reasignar se perderá la evaluación ya realizada por el evaluador.
          </div>
        </div>
        Reasignar evaluador
      </Button>
    )
  return (
    <Combobox
      as="div"
      value={review?.reviewerId ?? null}
      onChange={(e) => {
        if (e !== null) changeState(e)
      }}
      className="relative w-80"
    >
      <Combobox.Button className="relative w-full">
        <Combobox.Input
          autoComplete="off"
          className="input form-input px-3 py-1 text-sm"
          placeholder={`Seleccione un  ${EvaluatorsByReviewType[
            type
          ].toLocaleLowerCase()}`}
          onChange={(e) => setQuery(e.target.value)}
          displayValue={() =>
            users.find((user) => user.id === review?.reviewerId)?.name ?? ''
          }
        />

        <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md pr-2 focus:outline-none">
          <Selector
            className="h-4 text-primary transition-all duration-200 hover:text-gray-400"
            aria-hidden="true"
          />
        </div>
      </Combobox.Button>

      {filteredPeople.length > 0 && (
        <Combobox.Options className="absolute z-40 mt-1.5 max-h-60 w-full overflow-auto rounded border bg-white py-1 text-sm shadow focus:outline-none">
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
      )}
    </Combobox>
  )
}

export default ReviewAssignSelect
