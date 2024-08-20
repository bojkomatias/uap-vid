'use client'

import { Divider } from '@components/divider'
import { Fieldset, FormActions, Label } from '@components/fieldset'
import { Heading, Subheading } from '@components/heading'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import type { Prisma, ProtocolSectionsIdentificationTeam } from '@prisma/client'
import { updateProtocolTeamMembers } from '@repositories/protocol'
import { getAllTeamMembers } from '@repositories/team-member'
import { getCategoriesForForm } from '@repositories/team-member-category'
import { FormButton } from '@shared/form/form-button'
import { FormCombobox } from '@shared/form/form-combobox'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ConfirmTeamSchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Loader } from 'tabler-icons-react'

type ProtocolMetadataAndTeamMembers = Prisma.ProtocolGetPayload<{
  select: {
    id: true
    protocolNumber: true
    createdAt: true
    state: true
    flags: true
    convocatory: { select: { id: true; name: true } }
    researcher: {
      select: { name: true; email: true; id: true; role: true }
    }
    sections: {
      select: { identification: { select: { title: true; team: true } } }
    }
  }
}>

export function ConfirmTeamMembersForm({
  protocol,
}: {
  protocol: ProtocolMetadataAndTeamMembers
}) {
  const router = useRouter()

  const form = useForm({
    initialValues: { team: protocol.sections.identification.team },
    validate: zodResolver(ConfirmTeamSchema),
    validateInputOnChange: true,
    validateInputOnBlur: true,
  })

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => await getAllTeamMembers(),
  })

  const { data: categories, isLoading: tmsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await getCategoriesForForm(),
  })

  const { mutate } = useMutation({
    mutationKey: [protocol.id],
    mutationFn: async (values: ProtocolSectionsIdentificationTeam[]) => {
      const result = await updateProtocolTeamMembers(protocol.id, values)
      if (result) {
        notifications.show({
          title: 'Protocolo actualizado',
          message: 'Se guardaron los miembros de equipo correctamente',
          intent: 'success',
        })
        router.refresh()
      } else {
        notifications.show({
          title: 'Error',
          message: 'Ocurrió un error al actualizar los miembros de equipo',
          intent: 'error',
        })
      }
    },
  })

  return (
    <>
      {tmsLoading ?
        <Loader className="mx-auto animate-spin text-primary dark:text-white" />
      : <form
          onSubmit={form.onSubmit((values) => mutate(values.team))}
          className="mx-auto mt-10 w-fit max-w-xl rounded-lg border border-gray-700 bg-gray-800 p-6"
        >
          {' '}
          <Heading>Confirmar miembros de equipo</Heading>
          <Subheading className="whitespace-pre-wrap">
            Para poder visualizar los detalles de este protocolo de
            investigación, debe confirmar los miembros de equipo de
            investigación que aun no están definidos.
          </Subheading>
          <Divider className="mt-4" />
          <Fieldset>
            <Label className="mb-1.5 !text-xs">
              Seleccione el miembro de equipo que corresponda
            </Label>

            {protocol.sections.identification.team.map((tm, idx) => {
              return (
                <div
                  key={idx}
                  className={
                    tm.toBeConfirmed == true ?
                      'grid max-w-xl grid-cols-6 items-center gap-3'
                    : 'hidden'
                  }
                >
                  <Subheading className="col-span-2">
                    {
                      categories?.find((c) => c.id == tm.categoryToBeConfirmed)
                        ?.name
                    }
                  </Subheading>
                  <FormCombobox
                    error={form.getInputProps(`team.${idx}.teamMemberId`).error}
                    className="col-span-4 my-1"
                    label=""
                    options={
                      teamMembers?.map((e) => ({
                        value: e.id,
                        label: e.name,
                      })) ?? []
                    }
                    disabled={isLoading}
                    onChange={(e: any) => {
                      form.setFieldValue(`team.${idx}.teamMemberId`, e)
                      form.setFieldValue(
                        `team.${idx}.role`,
                        categories?.find(
                          (c) => c.id == tm.categoryToBeConfirmed
                        )?.name
                      )
                      form.setFieldValue(`team.${idx}.toBeConfirmed`, false)
                    }}
                  />
                </div>
              )
            })}
          </Fieldset>
          <FormActions>
            <FormButton disabled={!form.isValid()}>Guardar</FormButton>
          </FormActions>
        </form>
      }
    </>
  )
}
