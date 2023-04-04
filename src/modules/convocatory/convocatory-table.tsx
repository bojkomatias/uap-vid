import { getAllConvocatories } from '@repositories/convocatory'
import Link from 'next/link'

export async function ConvocatoryTable() {
    const convocatories = await getAllConvocatories()
    if (!convocatories || convocatories.length === 0)
        return <div className="mt-auto">No existen convocatorias</div>
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
                            Desde
                        </th>
                        <th
                            scope="col"
                            className="max-w-md px-3 py-3.5 text-center text-sm text-gray-900"
                        >
                            Hasta
                        </th>
                        <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                            <span className="sr-only">Edit</span>
                        </th>
                        <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-1"
                        >
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {convocatories.map((convocatory) => (
                        <tr key={convocatory.id}>
                            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                                {convocatory.name}
                                <dl className="font-normal lg:hidden">
                                    <dt className="sr-only sm:hidden">Email</dt>
                                    <dd className="mt-1 truncate text-gray-500 sm:hidden">
                                        {new Date(
                                            convocatory.from
                                        ).toISOString()}
                                    </dd>
                                </dl>
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                {new Date(convocatory.from).toISOString()}
                            </td>
                            <td className="max-w-[8rem] px-3 py-2 text-sm text-gray-500">
                                {new Date(convocatory.to).toISOString()}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-1">
                                <Link
                                    href={`/convocatories/${convocatory.id}`}
                                    passHref
                                    className="transition-all duration-150 hover:text-black/60"
                                >
                                    Editar
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
