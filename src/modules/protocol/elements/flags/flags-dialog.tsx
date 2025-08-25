'use client'

import React from 'react'
import type { ProtocolFlag } from '@prisma/client'
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { Divider } from '@components/divider'
import { atom, useAtom } from 'jotai'
import { useForm } from '@mantine/form'
import { upsertProtocolFlags } from '@repositories/protocol'
import { FormSwitch } from '@shared/form/form-switch'
import { FormTextarea } from '@shared/form/form-textarea'
import { notifications } from '@elements/notifications'
import { FieldGroup, FormActions } from '@components/fieldset'
import { SubmitButton } from '@shared/submit-button'
import { useRouter } from 'next/navigation'

export const FlagsDialogAtom = atom<boolean>(false)

export default function FlagsDialog({
  protocolId,
  protocolFlags,
}: {
  protocolId: string
  protocolFlags: ProtocolFlag[]
}) {
  const [open, setOpen] = useAtom(FlagsDialogAtom)
  const router = useRouter()

  const cucytFlag = protocolFlags.find((f) => f.flagName === 'CUCYT')
  const ciFlag = protocolFlags.find((f) => f.flagName === 'CI')

  const form = useForm({
    initialValues: {
      cucyt: {
        state: cucytFlag?.state ?? false,
        comment: cucytFlag?.comment ?? '',
      },
      ci: {
        state: ciFlag?.state ?? false,
        comment: ciFlag?.comment ?? '',
      },
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // Save both flags in a single operation
      await upsertProtocolFlags(protocolId, [
        {
          flagName: 'CUCYT',
          state: values.cucyt.state,
          comment: values.cucyt.comment,
        },
        {
          flagName: 'CI',
          state: values.ci.state,
          comment: values.ci.comment,
        },
      ])

      router.refresh()
      notifications.show({
        title: 'Guardado',
        message: 'Se guardaron ambos votos con éxito',
        intent: 'success',
      })
      setOpen(false)
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Hubo un error al guardar los votos',
        intent: 'error',
      })
    }
  }

  return (
    <Dialog open={open} onClose={setOpen} size="xl">
      <DialogTitle>Votos de las comisiones</DialogTitle>
      <DialogDescription>
        Votos emitidos por las comisiones encargadas de aprobar los presupuestos
        para el proyecto.
      </DialogDescription>
      <DialogBody>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <FieldGroup>
            <FormSwitch
              label="Votación del CUCYT"
              description={form.values.cucyt.state ? 'Aprobado' : 'No aprobado'}
              checked={form.values.cucyt.state}
              {...form.getInputProps('cucyt.state')}
            />
            <FormTextarea
              label="Comentario CUCYT"
              description="Información extra sobre el voto del CUCYT"
              {...form.getInputProps('cucyt.comment')}
            />
          </FieldGroup>

          <Divider className="my-4" />

          <FieldGroup>
            <FormSwitch
              label="Votación de la Comisión Interna"
              description={form.values.ci.state ? 'Aprobado' : 'No aprobado'}
              checked={form.values.ci.state}
              {...form.getInputProps('ci.state')}
            />
            <FormTextarea
              label="Comentario Comisión Interna"
              description="Información extra sobre el voto de la Comisión Interna"
              {...form.getInputProps('ci.comment')}
            />
          </FieldGroup>

          <FormActions>
            <SubmitButton>Guardar ambos votos</SubmitButton>
          </FormActions>
        </form>
      </DialogBody>
    </Dialog>
  )
}
