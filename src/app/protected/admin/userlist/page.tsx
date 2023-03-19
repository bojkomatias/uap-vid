import Link from 'next/link'
import { Button } from '@elements/Button'
import { getAllUsers } from 'repositories/users'
import { Heading } from '@layout/Heading'
import { UpdateRole } from '@admin/UpdateRole'
import Navigation from '@auth/Navigation'
import { UserPlus } from 'tabler-icons-react'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { canAccess } from '@utils/scopes'
import { redirect } from 'next/navigation'

export default async function UserList() {
    const session = await getServerSession(authOptions)
    if (!canAccess('USERS', session?.user?.role!)) redirect('/')
    const users = await getAllUsers()

    return (
        // @ts-expect-error async ServerComponent
        <Navigation>
            <Heading title="Lista de usuarios" />

            <Link
                href={'/protected/admin/newuser'}
                passHref
                className="flex flex-row-reverse"
            >
                <Button>
                    <UserPlus className="h-5" />
                    <span className="ml-3"> Nuevo usuario</span>
                </Button>
            </Link>

            <div className="-mx-4 mt-8 sm:-mx-0">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-sm text-left text-gray-900 sm:pl-0"
                            >
                                Nombre
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-sm text-left text-gray-900 sm:table-cell"
                            >
                                Email
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-sm text-center text-gray-900 max-w-md"
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
                                <td className="px-3 py-4 text-sm text-gray-500 max-w-[8rem]">
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
        </Navigation>
    )
}
