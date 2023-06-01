import type { User } from '@prisma/client'
import { RoleUpdater } from './elements/role-updater'
import { DeleteUserButton } from './elements/delete-user-button'

export default function UserTable({ users }: { users: User[] }) {
    return (
        <div className="mx-auto max-w-7xl">
            <table className="-mx-4 mt-8 min-w-full divide-y divide-gray-300 sm:-mx-0">
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
                        <th scope="col" className="relative py-3.5 sm:pr-0">
                            <span className="sr-only">Delete</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {users?.map((user) => (
                        <tr key={user.email}>
                            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                                {user.name}
                                <dl className="font-normal lg:hidden">
                                    <dt className="sr-only sm:hidden">Email</dt>
                                    <dd className="mt-1 truncate text-gray-500 sm:hidden">
                                        {user.email}
                                    </dd>
                                </dl>
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                {user.email}
                            </td>
                            <td className="max-w-[8rem] px-3 py-2 text-sm text-gray-500">
                                <RoleUpdater
                                    user={JSON.parse(JSON.stringify(user))}
                                />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium text-gray-500">
                                {user.role === 'ADMIN' ? null : (
                                    <DeleteUserButton userId={user.id} />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
