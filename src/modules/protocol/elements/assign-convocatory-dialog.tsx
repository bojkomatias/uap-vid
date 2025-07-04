'use client'

import { BadgeButton } from '@components/badge'
import { Button } from '@components/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { getConvocatoriesForFilter } from '@repositories/convocatory'
import { updateProtocolConvocatory } from '@repositories/protocol'
import { SubmitButton } from '@shared/submit-button'
import { FormListbox } from '@shared/form/form-listbox'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { AlertCircle, CalendarEvent, Click } from 'tabler-icons-react'
import { z } from 'zod'

export function AssingConvocatoryDialog({
  protocolId,
  convocatory,
}: {
  protocolId: string
  convocatory: { id: string; name: string } | null
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { data } = useQuery({
    queryKey: ['convocatories'],
    queryFn: async () => await getConvocatoriesForFilter(),
  })

  const form = useForm({
    initialValues: { convocatory: convocatory?.id },
    validate: zodResolver(
      z.object({
        convocatory: z
          .string()
          .min(1, { message: 'Debe seleccionar una convocatoria' }),
      })
    ),
  })

  const submitConvocatoryAssign = async (convocatory: string) => {
    const updated = await updateProtocolConvocatory(protocolId, convocatory)
    if (updated) {
      notifications.show({
        title: 'Convocatoria asignada',
        message: 'La convocatoria ha sido asignada al proyecto correctamente',
        intent: 'success',
      })
      return startTransition(() => {
        setOpen(false)
        router.refresh()
      })
    }
    notifications.show({
      title: 'Error al asignar convocatoria',
      message:
        'El proyecto no fue actualizado con la convocatoria correspondiente, intente nuevamente',
      intent: 'error',
    })
  }

  return (
    <>
      <BadgeButton
        color={convocatory ? 'light' : 'orange'}
        onClick={() => setOpen(true)}
        className="w-fit !text-sm/6 font-semibold"
        title={
          convocatory ?
            'Cambiar convocatoria'
          : 'El protocolo no se puede publicar sin una convocatoria asignada'
        }
      >
        {convocatory?.name ?? (
          <div className="flex animate-pulse items-center gap-2">
            Sin convocatoria <AlertCircle size={16} />
          </div>
        )}
      </BadgeButton>
      <Dialog open={open} onClose={() => setOpen(false)} size="xl">
        <DialogTitle>Asignar convocatoria</DialogTitle>
        <DialogDescription>
          Puede asignar una convocatoria o cambiarlo de convocatoria a gusto.
        </DialogDescription>
        <form
          onSubmit={form.onSubmit((values) =>
            submitConvocatoryAssign(values.convocatory!)
          )}
        >
          <DialogBody>
            <FormListbox
              label="Convocatoria"
              description="Asigne este proyecto a alguna convocatoria"
              placeholder="Convocatoria ..."
              options={data?.map((e) => ({ value: e.id, label: e.name })) ?? []}
              {...form.getInputProps('convocatory')}
            />
          </DialogBody>
          <DialogActions>
            <Button plain type="button" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <SubmitButton isLoading={isPending}>
              Asignar convocatoria
            </SubmitButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
