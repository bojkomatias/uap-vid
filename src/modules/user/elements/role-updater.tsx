'use client'
import { notifications } from '@elements/notifications'
import type { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { RoleSelector } from '../elements/role-selector'

// Wrapper around Role Selector, to trigger save on role change (Used for UserList)
export const RoleUpdater = ({ user }: { user: User }) => {
  const router = useRouter()

  const UpdateRoleForUser = async (newRole: string) => {
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.status === 200)
      notifications.show({
        title: 'Rol modificado',
        message: 'Se actualizo el rol del usuario correctamente',
        intent: 'success',
      })
    else if (res.status === 400 || res.status === 500)
      notifications.show({
        title: 'Error',
        message: 'Ocurrio un error al actualizar el rol del usuario',
        intent: 'error',
      })
    router.refresh()
  }

  return (
    <RoleSelector
      user={user}
      callback={(newRole: string) => UpdateRoleForUser(newRole)}
    />
  )
}
