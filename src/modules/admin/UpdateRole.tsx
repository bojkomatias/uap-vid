'use client'
import { Check, X } from 'tabler-icons-react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@mantine/notifications'
import { RoleSelector } from './RoleSelector'
import { useEffect, useState } from 'react'

// Wrapper around Role Selector, to trigger save on role change (Used for UserList)
export const UpdateRole = ({ user }: { user: any }) => {
    const router = useRouter()
    const notifications = useNotifications()

    const UpdateRoleForUser = async (newRole: string) => {
        console.log(user.id, newRole)
        const res = await fetch(`/api/users/${user.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: newRole }),
        })
        if (res.status === 200)
            notifications.showNotification({
                title: 'Rol modificado',
                message: 'Se actualizo el rol del usuario correctamente',
                color: 'teal',
                icon: <Check />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
        else if (res.status === 400 || res.status === 500)
            notifications.showNotification({
                title: 'Error',
                message: 'Ocurrio un error al actualizar el rol del usuario',
                color: 'red',
                icon: <X />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
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
