'use client'
import { useForm } from '@mantine/form'
import type { ProtocolFlag } from '@prisma/client'
import { upsertProtocolFlag } from '@repositories/protocol'
import React from 'react'
import { FormSwitch } from '../../../../shared/form/form-switch'
import { Button } from '@headlessui/react'
import { FormTextarea } from '@shared/form/form-textarea'
import { notifications } from '@elements/notifications'
import { Fieldset } from '@components/fieldset'

export default function CiFlag({
  protocolId,
  protocolFlag,
}: {
  protocolId: string
  protocolFlag?: ProtocolFlag
}) {
  const form = useForm({
    initialValues: {
      flagName: 'CI',
      state: protocolFlag ? protocolFlag.state : false,
      comment: protocolFlag ? protocolFlag.comment : '',
    },
  })

  const submitCiFlag = async (flag: Omit<ProtocolFlag, 'createdAt'>) => {
    const updated = await upsertProtocolFlag(protocolId, flag)
    if (updated) {
      notifications.show({
        title: 'Guardado',
        message: 'Se guardó el voto de la Comisión Interna con éxito',
        intent: 'success',
      })
    }
  }

  return (
    <form
      className="flex flex-col gap-1"
      id="ci-flag-form"
      onSubmit={form.onSubmit((values) => {
        submitCiFlag(values)
      })}
    >
      <Fieldset>
        <FormSwitch
          label="Votación de la Comisión Interna"
          description={form.getValues().state ? 'Aprobado' : 'No aprobado'}
          checked={form.getInputProps('state').value}
          {...form.getInputProps('state')}
        />
        <FormTextarea
          label="Comentario"
          description="Información extra sobre el voto"
          {...form.getInputProps('comment')}
        />
      </Fieldset>
      <Button
        type="submit"
        className="mt-2 w-fit self-end rounded-lg bg-primary-950 p-2 px-4 py-2 text-xs font-semibold text-white"
      >
        Guardar voto Comisión Interna
      </Button>
    </form>
  )
}
