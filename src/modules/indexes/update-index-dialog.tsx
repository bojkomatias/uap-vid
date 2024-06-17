'use client'

import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'

import { useCallback, useState, useTransition } from 'react'
import { RefreshDot } from 'tabler-icons-react'
import { Button } from '@components/button'
import { HistoricIndexSchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useForm, zodResolver } from '@mantine/form'
import { z } from 'zod'
import { FormButton } from '@shared/form/form-button'
import { FormInput } from '@shared/form/form-input'

export function UpdateIndexDialog() {
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof HistoricIndexSchema>>({
    initialValues: { from: new Date(), to: null, price: 0 },
    validate: zodResolver(HistoricIndexSchema),
  })

  const updateIndex = useCallback(
    (newIndexValue: z.infer<typeof HistoricIndexSchema>) => {
      console.log(newIndexValue)
    },
    []
  )

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <RefreshDot data-slot="icon" /> Actualizar FCA
      </Button>

      <Dialog open={open} onClose={setOpen} size="xl">
        <DialogTitle>Actualizar indice de FCA</DialogTitle>
        <DialogDescription>
          La mayoría de la applicación responde en base a los indices cargados,
          recuerde mantenerlos al día.
        </DialogDescription>
        <form onSubmit={form.onSubmit((values) => updateIndex(values))}>
          <DialogBody>
            <FormInput
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
