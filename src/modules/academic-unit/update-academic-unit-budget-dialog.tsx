'use client'

import { Badge } from '@components/badge'
import { Button } from '@components/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { Fieldset, FormActions } from '@components/fieldset'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/table'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import type { AcademicUnitBudget } from '@prisma/client'
import {
  updateAcademicUnit,
  updateAcademicUnitBudget,
} from '@repositories/academic-unit'
import { FormButton } from '@shared/form/form-button'
import { FormInput } from '@shared/form/form-input'
import { currencyFormatter, dateFormatter } from '@utils/formatters'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { z } from 'zod'

export function UpdateAcademicUnitBudgetDialog({
  onClose,
  academicUnitId,
  academicUnitBudgets,
}: {
  onClose: () => void
  academicUnitId?: string
  academicUnitBudgets?: AcademicUnitBudget[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (academicUnitId) setOpen(true)
  }, [academicUnitId])

  const closeModal = () => {
    setOpen(false)
    setTimeout(() => onClose(), 200)
  }

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { value: 0 },
    transformValues: (values) => schema.parse(values),
    validate: zodResolver(schema),
  })

  const submitNewBudget = useCallback(
    async ({ value }: { value: number }) => {
      const updated = await updateAcademicUnitBudget(academicUnitId!, value)

      console.log(updated)
      if (updated)
        notifications.show({
          title: 'Unidad académica guardada',
          message: 'La unidad académica ha sido guardado con éxito',
          intent: 'success',
        })

      startTransition(() => {
        router.refresh()
        closeModal()
      })
    },
    [router, academicUnitId]
  )

  return (
    <Dialog open={open} onClose={closeModal} size="xl">
      <DialogTitle>Presupuesto de unidad académica</DialogTitle>
      <DialogDescription>
        Lista de presupuesto historicos de unidades académicas y la opción de
        actualizar el mismo
      </DialogDescription>
      <DialogBody>
        <form
          onSubmit={form.onSubmit((values) => submitNewBudget(values))}
          className="flex w-full items-end justify-around"
        >
          <FormInput
            label="Nuevo monto"
            description="Actualice el presupuesto de la unidad académica"
            type="number"
            {...form.getInputProps('value')}
          />

          <FormButton isLoading={isPending}>Actualizar presupuesto</FormButton>
        </form>

        {academicUnitBudgets ?
          <Table bleed dense className="mt-8">
            <TableHead>
              <TableRow>
                <TableHeader>Monto (FCA)</TableHeader>
                <TableHeader>Activo</TableHeader>
                <TableHeader>Periodo</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {academicUnitBudgets.map((value) => (
                // To address once we have a convertor
                <TableRow key={value.amountIndex.FCA}>
                  <TableCell className="font-medium">
                    {currencyFormatter.format(value.amountIndex.FCA)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {value.to ? null : <Badge color="green">Actual</Badge>}
                  </TableCell>
                  <TableCell>
                    Desde:{' '}
                    <span className="font-medium">
                      {dateFormatter.format(value.from)}
                    </span>
                    {value.to && ' hasta: '}
                    {value.to && (
                      <span className="font-medium">
                        {dateFormatter.format(value.to)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        : 'No se encontraron'}
      </DialogBody>
      <DialogActions>
        <Button onMouseDown={closeModal} plain>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const schema = z.object({ value: z.coerce.number() })
