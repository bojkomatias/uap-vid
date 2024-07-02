'use client'

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
import { Text, TextLink } from '@components/text'
import { useForm } from '@mantine/form'
import type { Prisma } from '@prisma/client'
import { FormButton } from '@shared/form/form-button'
import { FormInput } from '@shared/form/form-input'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Trash } from 'tabler-icons-react'

type AcademicUnitWithSecretaries = Prisma.AcademicUnitGetPayload<{
  select: {
    id: true
    name: true
    shortname: true
    secretaries: {
      select: { id: true; name: true; email: true }
    }
  }
}>

type Secretaries = Prisma.UserGetPayload<{
  select: { id: true; name: true; email: true }
}>

export function EditSecretariesInAcademicUnitDialog({
  academicUnit,
  secretaries,
}: {
  academicUnit: AcademicUnitWithSecretaries
  secretaries: Secretaries[] | null
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }

  const form = useForm({
    initialValues: {
      secretaries: academicUnit.secretaries.map((e) => ({
        ...e,
        toBeRemoved: false,
        toBeAdded: false,
      })),
    },
  })

  return (
    <Dialog open={open} onClose={closeDialog} size="xl">
      <div className="flex items-center gap-2">
        <DialogTitle>{academicUnit.name}</DialogTitle>
      </div>
      <DialogDescription>
        Asigne secretarios a la unidad academica
      </DialogDescription>
      {!secretaries ?
        <Text>
          No hay secretarios en el sistema, visite el panel de{' '}
          <TextLink href="/users">usuarios</TextLink>{' '}
        </Text>
      : <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <DialogBody>
            <Table bleed dense>
              <TableHead>
                <TableRow>
                  <TableHeader>Nombre</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {form.values.secretaries.map((value, i) => (
                  <TableRow
                    key={value.id}
                    className={value.toBeRemoved ? 'bg-red-500' : ''}
                  >
                    <TableCell className="font-medium">{value.name}</TableCell>
                    <TableCell className="text-gray-700">
                      {value.email}
                    </TableCell>
                    <TableCell>
                      <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                        <Button
                          plain
                          onClick={() => {
                            form.setFieldValue(
                              `secretaries.${i}.toBeRemoved`,
                              true
                            )
                          }}
                        >
                          <Trash data-slot="icon" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <FormInput
              label="Nuevo secretario"
              description="Agregue un nuevo secretario al a unidad academica"
              onChange={() => console.log('xd')}
            />
          </DialogBody>
          <DialogActions>
            <Button plain onClick={closeDialog}>
              Cancelar
            </Button>
            <FormButton isLoading={isPending}>
              Actualizar secretarios
            </FormButton>
          </DialogActions>
        </form>
      }
    </Dialog>
  )
}
