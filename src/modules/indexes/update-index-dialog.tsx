'use client'

import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'

import { useCallback, useState, useTransition } from 'react'
import { Refresh } from 'tabler-icons-react'
import { Button } from '@components/button'
import { HistoricIndexSchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import type { TransformedValues } from '@mantine/form'
import { useForm, zodResolver } from '@mantine/form'
import { FormButton } from '@shared/form/form-button'
import { FormInput } from '@shared/form/form-input'
import { updateIndexByUnit } from '@repositories/finance-index'
import { notifications } from '@elements/notifications'
import { Strong } from '@components/text'

export function UpdateIndexDialog({ index }: { index: 'FCA' | 'FMR' }) {
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const form = useForm({
    initialValues: { from: new Date(), to: null, price: '0' },
    transformValues: (values) => HistoricIndexSchema.parse(values),
    validate: zodResolver(HistoricIndexSchema),
  })

  const updateIndex = useCallback(
    async (newIndexValue: TransformedValues<typeof form>) => {
      const updated = await updateIndexByUnit(index, newIndexValue)

      if (updated) {
        notifications.show({
          title: 'Indice actualizado',
          message: `El indice ${index} fue actualizado con exito`,
          intent: 'success',
        })
        return startTransition(() => {
          router.refresh()
          setOpen(false)
        })
      }
    },
    []
  )

  return (
    <>
      <Button onClick={() => setOpen(true)} outline>
        <Refresh data-slot="icon" /> Actualizar
      </Button>

      <Dialog open={open} onClose={setOpen} size="xl">
        <DialogTitle>Actualizar indice de {index}</DialogTitle>
        <DialogDescription>
          La mayoría de la applicación responde en base a los indices cargados,
          recuerde mantenerlos al día.
          <br />
          <Strong>
            Al actualizar un indice, este entra en vigencia de inmediato
          </Strong>
        </DialogDescription>
        <form onSubmit={form.onSubmit((values) => updateIndex(values))}>
          <DialogBody>
            <FormInput
              type="number"
              label="Monto"
              description="Monto al cual el indice se actualiza"
              placeholder="450,00"
              {...form.getInputProps('price')}
            />
          </DialogBody>
          <DialogActions>
            <FormButton isLoading={isPending}>Actualizar</FormButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
