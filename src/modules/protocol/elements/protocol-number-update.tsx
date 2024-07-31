'use client'

import { Badge, BadgeButton } from '@components/badge'
import { Button } from '@components/button'
import { Dialog, DialogBody, DialogTitle } from '@components/dialog'
import { Text } from '@components/text'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import type { Role } from '@prisma/client'
import { patchProtocolNumber } from '@repositories/protocol'
import { FormInput } from '@shared/form/form-input'
import { cx } from '@utils/cx'
import { useState } from 'react'
import { Edit, Number } from 'tabler-icons-react'
import { z } from 'zod'

export default function ProtocolNumberUpdate({
  protocolId,
  protocolNumber,
  role,
  context_menu,
}: {
  protocolId: string
  protocolNumber: string | null
  role: Role
  context_menu?: boolean
}) {
  const [pNumber, setPNumber] = useState(protocolNumber)
  const [open, setOpen] = useState(false)

  const form = useForm({
    initialValues: {
      protocolNumber: protocolNumber,
    },

    validate: zodResolver(
      z.object({
        protocolNumber: z.coerce.number(),
      })
    ),
  })

  if (role !== 'ADMIN')
    return (
      <Badge className="mr-1 flex w-fit items-center">
        <Number />
        <Text className="mr-1 mt-0.5 font-medium ">{protocolNumber}</Text>
      </Badge>
    )

  return (
    <>
      {context_menu ?
        <>
          <BadgeButton
            className="flex grow justify-between"
            onClick={() => setOpen(true)}
          >
            Actualizar número <Number size={18} />
          </BadgeButton>{' '}
          <Dialog open={open} onClose={setOpen}>
            <DialogTitle>Editar número de protocolo</DialogTitle>
            <DialogBody>
              {' '}
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const patched = await patchProtocolNumber(
                    protocolId,
                    form.getInputProps('protocolNumber').value
                  )
                  if (patched) {
                    setPNumber(patched.protocolNumber)
                    notifications.show({
                      title: 'Actualizado',
                      message: 'El número del protocolo fue actualizado',
                      intent: 'success',
                    })
                  }
                }}
              >
                <FormInput
                  label="Número del protocolo"
                  type="text"
                  name="protocolNumber"
                  defaultValue={pNumber || undefined}
                  required
                  placeholder="00.00"
                  title="Numero con formato 23.1 | 23.12 | 23.123"
                  pattern="[0-9]{2}\.+[0-9]{1,3}"
                  {...form.getInputProps('protocolNumber')}
                />

                <Button
                  onClick={() => {
                    setOpen(false)
                  }}
                  type="submit"
                  className="float-right mt-2 bg-teal-100 p-0.5 text-teal-600"
                >
                  Guardar
                </Button>
              </form>
            </DialogBody>
          </Dialog>
        </>
      : <Badge className="mr-1 flex w-fit items-center">
          <Number />
          <Text className={cx('mt-0.5  font-medium  ')}>{pNumber}</Text>

          <Button className="ml-2 h-6" outline onClick={() => setOpen(true)}>
            {' '}
            <Edit data-slot="icon" className={cx('ml-2h-[1.1rem]')} />
          </Button>

          <Dialog open={open} onClose={setOpen}>
            <DialogTitle>Editar número de protocolo</DialogTitle>
            <DialogBody>
              {' '}
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const patched = await patchProtocolNumber(
                    protocolId,
                    form.getInputProps('protocolNumber').value
                  )
                  if (patched) {
                    setPNumber(patched.protocolNumber)
                    notifications.show({
                      title: 'Actualizado',
                      message: 'El número del protocolo fue actualizado',
                      intent: 'success',
                    })
                  }
                }}
              >
                <FormInput
                  label="Número del protocolo"
                  type="text"
                  name="protocolNumber"
                  defaultValue={pNumber || undefined}
                  required
                  placeholder="00.00"
                  title="Numero con formato 23.1 | 23.12 | 23.123"
                  pattern="[0-9]{2}\.+[0-9]{1,3}"
                  {...form.getInputProps('protocolNumber')}
                />

                <Button
                  onClick={() => {
                    setOpen(false)
                  }}
                  type="submit"
                  className="float-right mt-2 bg-teal-100 p-0.5 text-teal-600"
                >
                  Guardar
                </Button>
              </form>
            </DialogBody>
          </Dialog>
        </Badge>
      }
    </>
  )
}
