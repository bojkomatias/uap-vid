'use client'

import { Button } from '@components/button'
import { FormActions } from '@components/fieldset'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/table'
import { useForm } from '@mantine/form'
import type { Prisma } from '@prisma/client'
import { FormButton } from '@shared/form/form-button'
import { FormCombobox } from '@shared/form/form-combobox'
import { cx } from '@utils/cx'
import { useCallback, useTransition } from 'react'
import { CircleX, CirclePlus, CircleMinus } from 'tabler-icons-react'

export type AcademicUnitWithSecretaries = Prisma.AcademicUnitGetPayload<{
  select: {
    id: true
    name: true
    shortname: true
    secretaries: {
      select: { id: true; name: true; email: true }
    }
  }
}>

export type Secretary = Prisma.UserGetPayload<{
  select: { id: true; name: true; email: true }
}>

export function EditSecretariesForm({
  academicUnit,
  secretaries,
  onSubmitCallback,
}: {
  academicUnit: AcademicUnitWithSecretaries
  secretaries: Secretary[]
  onSubmitCallback?: () => void
}) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<{
    secretaries: (Secretary & {
      added?: boolean
      removed?: boolean
    })[]
  }>({
    initialValues: {
      secretaries: academicUnit.secretaries,
    },
  })

  const submitSecretaries = useCallback(
    (
      secretaries: (Secretary & {
        added?: boolean
        removed?: boolean
      })[]
    ) => {
      // Diff the values, keep the ones not removed
      const diffedSecretaries = secretaries.filter((s) => !s.removed)
      console.log(diffedSecretaries)
    },
    []
  )
  return (
    <form
      onSubmit={form.onSubmit((values) =>
        submitSecretaries(values.secretaries)
      )}
      className="mt-8"
    >
      <Table
        bleed
        dense
        className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
      >
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
              className={cx(
                value.added && 'bg-success-500/20',
                value.removed && 'bg-error-500/20'
              )}
            >
              <TableCell className="font-medium">{value.name}</TableCell>
              <TableCell className="text-gray-700 dark:text-gray-400">
                {value.email}
              </TableCell>
              <TableCell>
                <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                  {value.added ?
                    <Button
                      plain
                      onClick={() => {
                        form.removeListItem(`secretaries`, i)
                      }}
                    >
                      <CircleX data-slot="icon" />
                    </Button>
                  : <Button
                      plain
                      onClick={() => {
                        form.setFieldValue(
                          `secretaries.${i}.removed`,
                          value.removed ? false : true
                        )
                      }}
                    >
                      {value.removed ?
                        <CirclePlus data-slot="icon" />
                      : <CircleMinus data-slot="icon" />}
                    </Button>
                  }
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FormCombobox
        className="mt-8"
        label="Nuevo secretario"
        description="Asigne un nuevo secretario al a unidad academica"
        options={secretaries
          .filter(
            (x) => !form.values.secretaries.map((e) => e.id).includes(x.id)
          )
          .map((e) => ({
            value: e.id,
            label: e.name,
            description: e.email,
          }))}
        onChange={(e: any) => {
          if (!e) return
          const secretary = secretaries.find((s) => s.id === e)
          form.insertListItem('secretaries', {
            id: secretary?.id,
            name: secretary?.name,
            email: secretary?.email,
            added: true,
          })
        }}
        placeholder="Seleccione un nuevo secretario para agregarlo a la tabla"
        value={null}
      />

      <FormActions>
        {onSubmitCallback && (
          <Button plain onClick={onSubmitCallback}>
            Cancelar
          </Button>
        )}
        <FormButton isLoading={isPending}>Actualizar secretarios</FormButton>
      </FormActions>
    </form>
  )
}
