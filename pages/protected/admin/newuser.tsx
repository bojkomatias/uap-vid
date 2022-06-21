import { useRouter } from 'next/router'
import { userInfo } from 'os'
import { useState } from 'react'
import { Button } from '../../../components/Atomic/Button'
import ListBox from '../../../components/Atomic/Listbox'
import { useNotifications } from '@mantine/notifications'
import { Check } from 'tabler-icons-react'

function NewUser() {
    const router = useRouter()
    const [newUser, setNewUser] = useState({ role: 'new-user' })

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
        if (res.status === 201) router.push('/protected/admin/userlist')
    }

    const notifications = useNotifications()
    const showNotification = () => (
        <div className="text-5xl">
            {notifications.showNotification({
                title: 'Usuario creado',
                message: 'Nuevo usuario creado correctamente',
                color: 'teal',
                icon: <Check />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })}
        </div>
    )

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    CreateNewUser()
                }}
                className="mx-auto flex w-1/2 flex-col items-center gap-10 pt-24"
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
                <Button type="submit"> Crear Nuevo Usuario</Button>
                <Button onClick={showNotification}>Toast</Button>
            </form>
        </div>
    )
}

export default NewUser
