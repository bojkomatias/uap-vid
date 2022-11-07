import { useNotifications } from '@mantine/notifications'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { Check, X } from 'tabler-icons-react'
import ListBox from '../../../components/Atomic/Listbox'
import { Button } from '../../../components/Atomic/Button'
import Link from 'next/link'

function UserList({ users }: any) {
    const router = useRouter()
    const notifications = useNotifications()

    const refreshData = () => {
        router.replace(router.asPath)
    }

    const UpdateRoleForUser = async (id: any, newRole: string) => {
        console.log(id, newRole)
        const res = await fetch(`/api/users/${id}`, {
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
        else if (res.status === 400)
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
        refreshData()
    }
    return (
        <>
            <div className="-translate-y-12 text-4xl font-bold text-primary">
                Lista de usuarios
            </div>
            <div className="flex grow flex-col py-10 px-28 ">
                <div className="flex h-2/3 grow  -translate-y-8 flex-col  text-primary">
                    <div className="grid grid-cols-3 items-center gap-6  text-2xl font-bold text-primary">
                        <p>Email</p>
                        <p>Último inicio de sesión</p>
                        <p className="translate-x-28">Rol</p>
                    </div>
                    {users.map((user: any) => (
                        <div key={user.email} className=" py-2 text-primary">
                            <div className="grid grid-cols-3 items-center gap-6">
                                <p>{user.email}</p>
                                <div className="flex gap-3">
                                    {' '}
                                    <p>
                                        {user.lastLogin
                                            ? new Date(
                                                  user.lastLogin
                                              ).toLocaleDateString('es-ar')
                                            : '--'}
                                    </p>
                                    <p>
                                        {user.lastLogin
                                            ? new Date(
                                                  user.lastLogin
                                              ).toLocaleTimeString('es-ar')
                                            : '--'}
                                    </p>
                                </div>

                                <div className="w-full">
                                    <ListBox
                                        user={user}
                                        UpdateRoleForUser={UpdateRoleForUser}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex self-end">
                    <Link
                        className="flex items-center"
                        href="/protected/admin/newuser"
                    >
                        <Button>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                            <span className="ml-3"> Nuevo usuario</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default UserList

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async () => {
    const string = `${process.env.NEXTURL}/api/users/`
    const data = await fetch(string).then((res) => res.json())

    return {
        props: {
            users: data,
        },
    }
}
