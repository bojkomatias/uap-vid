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
  updateCurrentYearBudget,
  getAcademicUnitWithBudgetsById,
} from '@repositories/academic-unit'

type BudgetForDialog = {
  id: string
  year: number
  amountIndex: {
    FCA: number
    FMR: number
  }
  from: Date
  to: Date | null
  createdAt: Date
  updatedAt: Date
}
import { SubmitButton } from '@shared/submit-button'
import { FormInput } from '@shared/form/form-input'
import { dateFormatter } from '@utils/formatters'

// Number formatter for index values (without currency symbols)
const indexFormatter = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { z } from 'zod'

export function UpdateAcademicUnitBudgetDialog({
  onClose,
  academicUnitId,
  academicUnitBudgets: _,
}: {
  onClose: () => void
  academicUnitId?: string
  academicUnitBudgets?: AcademicUnitBudget[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [budgets, setBudgets] = useState<BudgetForDialog[]>([])
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(false)

  useEffect(() => {
    if (academicUnitId) {
      setOpen(true)
      // Fetch budgets when dialog opens
      setIsLoadingBudgets(true)
      getAcademicUnitWithBudgetsById(academicUnitId)
        .then((data) => {
          if (data?.budgets) {
            setBudgets([...data.budgets].reverse())
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingBudgets(false))
    }
  }, [academicUnitId])

  const closeModal = () => {
    setOpen(false)
    setBudgets([])
    setIsLoadingBudgets(false)
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
      const updated = await updateCurrentYearBudget(academicUnitId!, value)

      if (updated) {
        notifications.show({
          title: 'Unidad académica guardada',
          message: 'La unidad académica ha sido guardado con éxito',
          intent: 'success',
        })

        // Refresh the budgets in the dialog
        setIsLoadingBudgets(true)
        getAcademicUnitWithBudgetsById(academicUnitId!)
          .then((data) => {
            if (data?.budgets) {
              setBudgets([...data.budgets].reverse())
            }
          })
          .catch(console.error)
          .finally(() => setIsLoadingBudgets(false))
      }

      startTransition(() => {
        router.refresh()
        form.reset()
      })
    },
    [router, academicUnitId, form]
  )

  return (
    <Dialog open={open} onClose={closeModal} size="2xl">
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

          <SubmitButton isLoading={isPending}>
            Actualizar presupuesto
          </SubmitButton>
        </form>

        {isLoadingBudgets ?
          <div className="mt-8 text-center">Cargando presupuestos...</div>
        : budgets.length > 0 ?
          <Table bleed dense className="mt-8">
            <TableHead>
              <TableRow>
                <TableHeader>Monto (FCA)</TableHeader>
                <TableHeader>Activo</TableHeader>
                <TableHeader>Periodo</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets.map((value) => (
                <TableRow key={value.id}>
                  <TableCell className="font-medium">
                    {indexFormatter.format(value.amountIndex.FCA)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {value.year === new Date().getFullYear() ?
                      <Badge color="teal">Actual</Badge>
                    : null}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">Año {value.year}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        : <div className="mt-8 text-center">No se encontraron presupuestos</div>
        }
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
