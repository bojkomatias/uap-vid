import type { Protocol } from '@prisma/client'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { dateFormatter } from '@utils/formatters'
import Link from 'next/link'

export default function ProtocolTable({ items }: { items: Protocol[] | null }) {
    if (!items || items.length === 0) return <EmptyState />
    return (
        <div className="mx-auto max-w-7xl">
            <table className="-mx-4 mt-8 min-w-full divide-y divide-gray-300 sm:-mx-0">
                <thead>
                    <tr>
                        <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-1"
                        >
                            Título
                        </th>
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                            Facultad / Carrera
                        </th>

                        <th
                            scope="col"
                            className="table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            Estado
                        </th>
                        <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-1"
                        >
                            <span className="sr-only">Ver</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td className="  py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-1">
                                {item.sections.identification.title}
                                <dl>
                                    <dd className=" text-xs font-light text-gray-500 lg:text-sm">
                                        {dateFormatter.format(item.createdAt)}
                                    </dd>
                                    <dd className=" text-gray-600 lg:hidden">
                                        {item.sections.identification.sponsor
                                            .length < 2
                                            ? item.sections.identification
                                                  .sponsor
                                            : item.sections.identification.sponsor
                                                  .map(
                                                      (e: string) =>
                                                          e.split('-')[1]
                                                  )
                                                  .join(' - ')}
                                    </dd>
                                </dl>
                            </td>
                            <td className="hidden  px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                <dl>
                                    <dd className=" text-gray-700">
                                        {item.sections.identification.sponsor
                                            .length < 2
                                            ? item.sections.identification
                                                  .sponsor
                                            : item.sections.identification.sponsor
                                                  .map(
                                                      (e: string) =>
                                                          e.split('-')[1]
                                                  )
                                                  .join(' - ')}
                                    </dd>
                                    <dd className=" font-light text-gray-500">
                                        {item.sections.identification.career}
                                    </dd>
                                </dl>
                            </td>

                            <td className="table-cell px-3 py-4 text-sm font-medium text-gray-600">
                                {ProtocolStatesDictionary[item.state]}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-1">
                                <Link
                                    href={`/protocols/${item.id}`}
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
        <div className="mt-40 text-center">
            <h3 className="mt-2 text-lg font-semibold text-gray-900">
                No se encontraron protocolos.
            </h3>
            <p className="mt-5 text-sm font-light text-gray-600">
                Modifique los parámetros de búsqueda. <br /> Si es evaluador,
                consulte si algún protocolo le fue asignado.
                <br /> Si es investigador fíjese si la convocatoria esta
                abierta.
            </p>
        </div>
    )
}
