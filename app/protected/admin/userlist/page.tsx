import Link from 'next/link'
import { Button } from '@elements/Button'
import { getAllUsers } from 'repositories/users'
import Heading from '@layout/Heading'
import { RoleSelector } from '@admin/RoleSelector'
import { UpdateRole } from '@admin/UpdateRole'

export default async function UserList() {
    const users = await getAllUsers()

    return (
        <>
            <Heading title="Lista de usuarios" />
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
                                    <UpdateRole user={user} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex self-end">
                    <Link
                        className="flex items-center"
                        href="/protected/admin/newuser"
                        passHref
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
