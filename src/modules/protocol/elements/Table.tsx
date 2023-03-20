import { protocol } from '@prisma/client'

import { stateTranslate } from '@utils/zod'
import Link from 'next/link'

export default function Table({ items }: { items: protocol[] | null }) {
    if (!items) return <EmptyState />
    return (
        <div className="-mx-4 mt-8 sm:-mx-0">
            <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr>
                        <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                            Título
                        </th>
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                            Facultad
                        </th>
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                            Carrera
                        </th>
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                            Estado
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            Fecha de creación
                        </th>
                        <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                            <span className="sr-only">Ver</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                {item.sections.identification.title}
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                {item.sections.identification.sponsor.length < 2
                                    ? item.sections.identification.sponsor
                                    : item.sections.identification.sponsor
                                          .map((e: string) => e.split('-')[1])
                                          .join(' - ')}
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                {item.sections.identification.career}
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                {stateTranslate[item.state]}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(item.createdAt).toLocaleString()}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <Link
                                    href={`/protected/view/${item.id}`}
                                    passHref
                                    className="transition-all duration-150 hover:text-black/60"
                                >
                                    Ver
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="text-center">
            <h3 className="mt-2 font-semibold text-gray-900">
                No se encontraron protocolos
            </h3>
            <p className="mt-5 text-sm text-gray-500">
                Get started by creating a new project.
            </p>
        </div>
    )
}
