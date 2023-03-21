'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { Button } from '@elements/Button'

import { ROLE } from '@utils/zod'
import { RoleSelector } from './RoleSelector'

export default function UserForm() {
    const router = useRouter()
    const [newUser, setNewUser] = useState({ role: ROLE.RESEARCHER })
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
                router.push('/users')
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
            className="lg:grid lg:grid-cols-2 place-items-stretch"
        >
            <div className="m-3 p-1">
                <label className="label">Nombre</label>
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
                />
            </div>
            <div className="m-3 p-1">
                <label className="label">Email</label>
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
            </div>
            <div className="m-3 p-1">
                <label className="label">Contraseña</label>
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
            </div>
            <div className="m-3 p-1">
                <label className="label">Rol</label>
                <RoleSelector user={newUser} />
            </div>
            {/* Ignoro el primero param */}

            <Button
                type="submit"
                className="lg:place-self-end lg:col-start-2 lg:col-end-3 m-4 float-right"
            >
                {' '}
                Crear Nuevo Usuario
            </Button>
        </form>
    )
}
