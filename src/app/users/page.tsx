import Link from 'next/link'
import { Button } from '@elements/Button'
import { getAllUsers } from 'repositories/users'
import { Heading } from '@layout/Heading'
import { UserPlus } from 'tabler-icons-react'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { canAccess } from '@utils/scopes'
import { redirect } from 'next/navigation'
import { UpdateRole } from '@user/UpdateRole'

export default async function UserList() {
    const session = await getServerSession(authOptions)
    if (!session) return redirect('/login')
    if (!canAccess('USERS', session?.user?.role!)) redirect('/protocols')
    const users = await getAllUsers()

    return (
        <>
            <Heading title="Lista de usuarios" />
            <div className="flex flex-row-reverse">
                <Link href={'/users/new'} passHref>
                    <Button intent="secondary">
                        <UserPlus className="h-5" />
                        <span className="ml-3"> Nuevo usuario</span>
                    </Button>
                </Link>
            </div>

            <div className="mx-auto max-w-7xl">
                <table className="min-w-full divide-y divide-gray-300 -mx-4 mt-8 sm:-mx-0">
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm text-gray-900 sm:pl-0"
                            >
                                Nombre
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-sm text-gray-900 sm:table-cell"
                            >
                                Email
                            </th>
                            <th
                                scope="col"
                                className="max-w-md px-3 py-3.5 text-center text-sm text-gray-900"
                            >
                                Rol
                            </th>
                            <th
                                scope="col"
                                className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                            >
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {users?.map((user) => (
                            <tr key={user.email}>
                                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                                    {user.name}
                                    <dl className="font-normal lg:hidden">
                                        <dt className="sr-only sm:hidden">
                                            Email
                                        </dt>
                                        <dd className="mt-1 truncate text-gray-500 sm:hidden">
                                            {user.email}
                                        </dd>
                                    </dl>
                                </td>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                    {user.email}
                                </td>
                                <td className="max-w-[8rem] px-3 py-2 text-sm text-gray-500">
                                    <UpdateRole
                                        user={JSON.parse(JSON.stringify(user))}
                                    />
                                </td>
                                <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                    <a
                                        href="#"
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                        <span className="sr-only">
                                            , {user.name}
                                        </span>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
