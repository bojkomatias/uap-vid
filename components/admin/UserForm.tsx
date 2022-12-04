'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'

import { Button } from '@elements/Button'
import { RoleSelector } from '@admin/RoleSelector'

export default function UserForm() {
    const router = useRouter()
    const [newUser, setNewUser] = useState({ role: 'Investigador' })
    const notifications = useNotifications()
    const CreateNewUser = async () => {
        const res = await fetch(`/api/auth/signup`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
        if (res.status === 201) {
            notifications.showNotification({
                title: 'Usuario creado',
                message: 'El usuario fue creado correctamente',
                color: 'success',
                icon: <Check />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
            setTimeout(() => {
                router.push('/protected/admin/userlist')
            }, 2000)
        } else if (res.status === 422) {
            notifications.showNotification({
                title: 'Usuario existente',
                message: 'El usuario ya existe',
                color: 'red',
                icon: <X />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
        }
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                CreateNewUser()
            }}
            className="mx-auto flex w-1/2 flex-col items-center gap-10 pb-12"
        >
            <input
                required
                className="input"
                type="text"
                name="name"
                placeholder="John Doe"
                onChange={(e) =>
                    setNewUser({
                        ...newUser,
                        [e.target.name]: e.target.value,
                    })
                }
            />{' '}
            <input
                required
                className="input"
                type="email"
                name="email"
                placeholder="ejemplo@uap.edu.ar"
                onChange={(e) =>
                    setNewUser({
                        ...newUser,
                        [e.target.name]: e.target.value,
                    })
                }
            />
            <input
                required
                className="input"
                type="password"
                name="password"
                placeholder="****"
                onChange={(e) =>
                    setNewUser({
                        ...newUser,
                        [e.target.name]: e.target.value,
                    })
                }
            />
            <RoleSelector user={newUser} />
            {/* Ignoro el primero param */}
            <Button type="submit"> Crear Nuevo Usuario</Button>
        </form>
    )
}
