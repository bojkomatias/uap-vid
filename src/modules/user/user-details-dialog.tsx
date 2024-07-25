'use client'

import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@components/description-list'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import type { Role, User } from '@prisma/client'
import { dateFormatter } from '@utils/formatters'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { FormListbox } from '@shared/form/form-listbox'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import { updateUserRoleById } from '@repositories/user'
import { notifications } from '@elements/notifications'
import { FormButton } from '@shared/form/form-button'
import { useForm } from '@mantine/form'
import { Divider } from '@components/divider'
import { DeleteUserButton } from './delete-user-button'
import { Subheading } from '@components/heading'
import { Text } from '@components/text'
import { Clipboard } from 'tabler-icons-react'
import { Button } from '@components/button'

export function UserDetailsDialog({ user }: { user: Omit<User, 'password'> }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }

  const form = useForm({ initialValues: { role: user.role } })

  const submitRoleUpdate = async (newRole: Role) => {
    const res = await updateUserRoleById(user.id, newRole)

    if (res) {
      notifications.show({
        title: 'Rol modificado',
        message: 'Se actualizo el rol del usuario correctamente',
        intent: 'success',
      })
      return startTransition(() => {
        router.refresh()
        closeDialog()
      })
    }

    return notifications.show({
      title: 'Error',
      message: 'Ocurrio un error al actualizar el rol del usuario',
      intent: 'error',
    })
  }

  return (
    <Dialog open={open} onClose={closeDialog} size="2xl">
      <DialogTitle>Detalles de usuario</DialogTitle>
      <DialogDescription>
        Los detalles de usuario y la opción de modificar el rol del mismo.
      </DialogDescription>
      <DialogBody>
        <DescriptionList>
          <DescriptionTerm>UUID</DescriptionTerm>
          <DescriptionDetails>
            <span className="font-mono text-xs">{user.id}</span>
            <Button>
              <Clipboard />
            </Button>
          </DescriptionDetails>
          <DescriptionTerm>Nombre</DescriptionTerm>
          <DescriptionDetails>{user.name}</DescriptionDetails>
          <DescriptionTerm>Email</DescriptionTerm>
          <DescriptionDetails>{user.email}</DescriptionDetails>
          <DescriptionTerm>DNI</DescriptionTerm>
          <DescriptionDetails>{user.dni}</DescriptionDetails>
          <DescriptionTerm>Ultima vez visto</DescriptionTerm>
          <DescriptionDetails>
            {dateFormatter.format(user.lastLogin!)}
          </DescriptionDetails>
        </DescriptionList>
      </DialogBody>
      <Divider className="my-4" />
      <form
        onSubmit={form.onSubmit((values) => submitRoleUpdate(values.role))}
        className="flex items-end gap-1"
      >
        <FormListbox
          className="grow"
          label="Rol"
          description="Actualizar el rol del usuario"
          options={Object.entries(RolesDictionary).map(([value, label]) => ({
            value,
            label,
          }))}
          {...form.getInputProps('role')}
        />
        <FormButton isLoading={isPending}>Actualizar rol</FormButton>
      </form>
      <Divider className="my-4" />
      <div className="flex items-end gap-1">
        <div>
          <Subheading>Eliminar usuario</Subheading>
          <Text className="!text-xs">
            Solo va a poder eliminar usuario si no tiene protocolos o
            evaluaciones relacionadas al mismo.
          </Text>
        </div>
        <DeleteUserButton userId={user.id} />
      </div>
      <DialogActions></DialogActions>
    </Dialog>
  )
}
