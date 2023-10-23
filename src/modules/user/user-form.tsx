'use client'
import { Button } from '@elements/button'
import { notifications } from '@elements/notifications'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROLE } from '@utils/zod'
import { RoleSelector } from './elements/role-selector'

export default function UserForm() {
    const router = useRouter()
    const [newUser, setNewUser] = useState({ role: ROLE.RESEARCHER })
    const [loading, setLoading] = useState(false)

    const createNewUser = async () => {
        setLoading(true)
        const res = await fetch(`/api/auth/signup`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
        if (res.status === 201) {
            notifications.show({
                title: 'Usuario creado',
                message: 'El usuario fue creado correctamente',
                intent: 'success',
            })
            setLoading(false)
            router.refresh()
            router.push('/users')
        } else if (res.status === 422) {
            notifications.show({
                title: 'Usuario existente',
                message: 'El usuario ya existe',
                intent: 'error',
            })
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                createNewUser()
            }}
            className="mx-auto mt-28 max-w-5xl place-items-stretch lg:grid lg:grid-cols-2"
        >
            <div className="m-3 p-1">
                <label className="label">Nombre Completo</label>
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
            <Button
                intent="secondary"
                type="submit"
                className="float-right m-4 lg:col-start-2 lg:col-end-3 lg:place-self-end"
            >
                {loading ? (
                    <span className="loader-primary h-5 w-5"></span>
                ) : (
                    'Crear Nuevo Usuario'
                )}
            </Button>
        </form>
    )
}
