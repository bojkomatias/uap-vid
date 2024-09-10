'use client'

import type { Prisma } from '@prisma/client'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { Subheading } from '@components/heading'
import { Text } from '@components/text'
import { Button } from '@components/button'
import Info from 'modules/info'
import { useCallback, useState, useTransition } from 'react'
import { User } from 'tabler-icons-react'
import { FormCombobox } from '@shared/form/form-combobox'
import { useQuery } from '@tanstack/react-query'
import { getAllOwners } from '@repositories/user'
import { SubmitButton } from '@shared/submit-button'
import { useForm, zodResolver } from '@mantine/form'
import { z } from 'zod'
import { updateProtocolResearcher } from '@repositories/protocol'
import { notifications } from '@elements/notifications'
import { useRouter } from 'next/navigation'
import Clipboard from '@elements/clipboard'

type ResearcherProps = {
  researcher: Prisma.UserGetPayload<{
    select: { name: true; email: true; id: true; role: true }
  }>
}

export const Researcher = ({
  researcher,
  protocolId,
  isAdmin,
}: ResearcherProps & { protocolId: string; isAdmin: boolean }) => {
  // Only show re-assignation options if is admin
  if (isAdmin)
    return (
      <ResearcherReassignation
        researcher={researcher}
        protocolId={protocolId}
      />
    )

  return <ResearcherData researcher={researcher} />
}

const ResearcherData = ({ researcher }: ResearcherProps) => (
  <div className="flex items-center gap-1">
    <User className="size-4 text-gray-600 dark:text-white" />
    <div className="-space-y-2">
      <Subheading>{researcher.name}</Subheading>
      <Text className="!text-xs/6">{researcher.email}</Text>
    </div>
  </div>
)

const ResearcherReassignation = ({
  researcher,
  protocolId,
}: ResearcherProps & { protocolId: string }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { data } = useQuery({
    queryKey: ['owners'],
    queryFn: async () => await getAllOwners(),
  })

  const form = useForm({
    initialValues: { researcherId: researcher.id },
    validate: zodResolver(
      z.object({
        researcherId: z
          .string()
          .min(1, { message: 'Debe seleccionar un usuario' }),
      })
    ),
  })

  const submitReassignation = useCallback(
    async ({ researcherId }: { researcherId: string }) => {
      const updated = await updateProtocolResearcher(protocolId, researcherId)
      if (updated) {
        notifications.show({
          title: 'Investigador reasignado',
          message: 'El investigador del proyecto fue actualizado con éxito',
          intent: 'success',
        })
        return startTransition(() => {
          router.refresh()
          setIsOpen(false)
        })
      }
      notifications.show({
        title: 'Ocurrió un error',
        message: 'Error al asignar un nuevo investigador, intente más tarde',
        intent: 'error',
      })
      return startTransition(() => {
        setIsOpen(false)
      })
    },
    [protocolId, router]
  )

  return (
    <>
      <Button
        plain
        className="!px-1 !py-0 text-start"
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <ResearcherData researcher={researcher} />
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <div className="flex items-center justify-between">
          <DialogTitle>Investigador a cargo del proyecto </DialogTitle>

          <Clipboard
            notification_message={`Se copió el email del investigador: ${researcher.email}`}
            content={researcher.email}
          />
        </div>
        <DialogDescription>
          Aquí puede cambiar el investigador asignado al proyecto, en caso de
          que otro fue el usuario que lo dió de alta.
        </DialogDescription>
        <form onSubmit={form.onSubmit((values) => submitReassignation(values))}>
          <DialogBody>
            <FormCombobox
              label="Reasignar investigador"
              description="Seleccione un nuevo usuario el cual pasara a ser dueño del proyecto"
              options={
                data?.map((e) => ({
                  value: e.id,
                  label: e.name,
                  description: e.email,
                })) ?? []
              }
              {...form.getInputProps('researcherId')}
            />
          </DialogBody>
          <DialogActions>
            <Button
              plain
              onClick={() => {
                setIsOpen(false)
              }}
            >
              Cerrar
            </Button>
            <SubmitButton disabled={form.isDirty()} isLoading={isPending}>
              Cambiar investigador
            </SubmitButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
