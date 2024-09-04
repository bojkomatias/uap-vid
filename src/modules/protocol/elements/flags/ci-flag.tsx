'use client'

import { useForm } from '@mantine/form'
import type { ProtocolFlag } from '@prisma/client'
import { upsertProtocolFlag } from '@repositories/protocol'
import React from 'react'
import { FormSwitch } from '../../../../shared/form/form-switch'
import { FormTextarea } from '@shared/form/form-textarea'
import { notifications } from '@elements/notifications'
import { FieldGroup, FormActions } from '@components/fieldset'
import { SubmitButton } from '@shared/submit-button'

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
      onSubmit={form.onSubmit((values) => {
        submitCiFlag(values)
      })}
    >
      <FieldGroup>
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
      </FieldGroup>
      <FormActions>
        <SubmitButton>Guardar voto Comisión Interna</SubmitButton>
      </FormActions>
    </form>
  )
}
