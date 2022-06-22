import { useRouter } from 'next/router'
import { userInfo } from 'os'
import { useState } from 'react'
import { Button } from '../../../components/Atomic/Button'
import ListBox from '../../../components/Atomic/Listbox'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'

function NewUser() {
    const router = useRouter()
    const [newUser, setNewUser] = useState({ role: 'new-user' })
    const notifications = useNotifications()
    const CreateNewUser = async () => {
        console.log(newUser)
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
        <div>
            <div className="-translate-y-12 text-4xl font-bold text-primary">
                Crear nuevo usuario
            </div>
            <p className="mx-auto mb-3 w-1/2 pt-24 text-xl font-bold text-primary">
                Nuevo usuario
            </p>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    CreateNewUser()
                }}
                className="mx-auto flex w-1/2 flex-col items-center gap-10 "
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
                <ListBox
                    user={newUser}
                    UpdateRoleForUser={(_: any, e: any) => console.log(e)}
                />
                {/* Ignoro el primero param */}
                <button
                    className=" bg-base-100 p-4 font-bold uppercase text-primary transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-white"
                    type="submit"
                >
                    {' '}
                    Crear Nuevo Usuario
                </button>
            </form>
        </div>
    )
}

export default NewUser
