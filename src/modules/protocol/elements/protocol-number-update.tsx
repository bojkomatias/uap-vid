'use client'

import { Button } from '@elements/button'
import { notifications } from '@elements/notifications'
import type { Role } from '@prisma/client'
import { patchProtocolNumber } from '@repositories/protocol'
import { cx } from '@utils/cx'
import { useState } from 'react'
import { Check, Edit, Number, X } from 'tabler-icons-react'

export default function ProtocolNumberUpdate({
  protocolId,
  protocolNumber,
  role,
}: {
  protocolId: string
  protocolNumber: string | null
  role: Role
}) {
  const [pNumber, setPNumber] = useState(protocolNumber)
  const [edit, setEdit] = useState(false)
  if (role !== 'ADMIN')
    return (
      <span className="flex">
        <Number className="ml-0.5 mr-2 h-[1.1rem] text-gray-600" />
        <span className="mt-0.5 text-xs font-medium text-gray-600">
          {protocolNumber}
        </span>
      </span>
    )

  return (
    <span className="flex">
      <Number className="ml-0.5 mr-2 h-[1.1rem] text-gray-600" />
      <span
        className={cx(
          'mt-0.5 text-xs font-medium text-gray-600',
          edit && 'hidden'
        )}
      >
        {pNumber}
      </span>
      <form
        className={cx('flex items-center gap-1', edit ? '' : 'hidden')}
        onSubmit={async (e) => {
          e.preventDefault()

          const patched = await patchProtocolNumber(
            protocolId,
            (e.currentTarget.elements[0] as HTMLInputElement).value
          )
          if (patched) {
            setPNumber(patched.protocolNumber)
            setEdit(false)
            notifications.show({
              title: 'Actualizado',
              message: 'El número del protocolo fue actualizado',
              intent: 'success',
            })
          }
        }}
      >
        <input
          type="text"
          name="protocolNumber"
          defaultValue={pNumber || undefined}
          required
          placeholder="00.00"
          className="input h-5 w-12 p-0.5 text-center text-xs"
          title="Numero con formato 23.1 | 23.12 | 23.123"
          pattern="[0-9]{2}\.+[0-9]{1,3}"
        />
        <Button
          type="submit"
          intent="secondary"
          className="bg-success-100 p-0.5 text-success-600"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          type="reset"
          intent="destructive"
          className="p-0.5"
          onClick={() => setEdit(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </form>
      <Edit
        className={cx(
          'ml-2 h-[1.1rem] w-4 text-gray-500 hover:text-gray-900',
          edit && 'hidden'
        )}
        onClick={() => setEdit(true)}
      />
    </span>
  )
}
