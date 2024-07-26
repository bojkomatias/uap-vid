'use client'
import { useForm } from '@mantine/form'
import type { ProtocolFlag } from '@prisma/client'
import { upsertProtocolFlag } from '@repositories/protocol'
import React from 'react'
import { FormSwitch } from '../../../../shared/form/form-switch'
import { Button } from '@headlessui/react'
import { FormTextarea } from '@shared/form/form-textarea'
import { notifications } from '@elements/notifications'

export default function CucytFlag({
  protocolId,
  protocolFlag,
}: {
  protocolId: string
  protocolFlag?: ProtocolFlag
}) {
  const form = useForm({
    initialValues: {
      flagName: 'CUCYT',
      state: protocolFlag ? protocolFlag.state : false,
      comment: protocolFlag ? protocolFlag.comment : '',
    },
  })

  const submitCucytFlag = async (flag: Omit<ProtocolFlag, 'createdAt'>) => {
    const updated = await upsertProtocolFlag(protocolId, flag)
    if (updated) {
      notifications.show({
        title: 'Guardado',
        message: 'Se guardó el voto del CUCYT con éxito',
        intent: 'success',
      })
    }
  }

  return (
    <form
      className="flex flex-col gap-1"
      id="cucyt-flag-form"
      onSubmit={form.onSubmit((values) => {
        submitCucytFlag(values)
      })}
    >
      <FormSwitch
        label="Votación del CUCYT"
        type="submit"
        description={
          form.getInputProps('state').value ? 'Aprobado' : 'No aprobado'
        }
        checked={form.getInputProps('state').value}
        {...form.getInputProps('state')}
      />
      <FormTextarea
        label="Comentario"
        description="Información extra sobre el voto"
        {...form.getInputProps('comment')}
      />
      <Button
        type="submit"
        className="mt-2 w-fit  self-end rounded-lg bg-primary-950 px-4 py-2 text-xs font-semibold text-white"
      >
        Guardar voto CUCYT
      </Button>
    </form>
  )
}
