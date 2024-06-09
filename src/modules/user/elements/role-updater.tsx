'use client'
import { notifications } from '@elements/notifications'
import type { Role, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { RoleSelector } from '../elements/role-selector'
import { updateUserRoleById } from '@repositories/user'

// Wrapper around Role Selector, to trigger save on role change (Used for UserList)
export const RoleUpdater = ({ user }: { user: User }) => {
    const router = useRouter()

    const UpdateRoleForUser = async (newRole: Role) => {
        const res = await updateUserRoleById(user.id, newRole)

        if (res)
            return notifications.show({
                title: 'Rol modificado',
                message: 'Se actualizo el rol del usuario correctamente',
                intent: 'success',
            })

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
            callback={(newRole) => UpdateRoleForUser(newRole)}
        />
    )
}
