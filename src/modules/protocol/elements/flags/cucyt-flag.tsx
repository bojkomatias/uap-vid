'use client'

import { useForm } from '@mantine/form'
import type { ProtocolFlag } from '@prisma/client'
import { upsertProtocolFlag } from '@repositories/protocol'
import React from 'react'
import { FormSwitch } from '../../../../shared/form/form-switch'
import { FormTextarea } from '@shared/form/form-textarea'
import { notifications } from '@elements/notifications'
import { FormButton } from '@shared/form/form-button'
import { FieldGroup, FormActions } from '@components/fieldset'

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
      onSubmit={form.onSubmit((values) => {
        submitCucytFlag(values)
      })}
    >
      <FieldGroup>
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
      </FieldGroup>
      <FormActions>
        <FormButton>Guardar voto CUCYT</FormButton>
      </FormActions>
    </form>
  )
}
