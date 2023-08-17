'use client'
import type { Prisma, Protocol, User } from '@prisma/client'
import { State } from '@prisma/client'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { dateFormatter } from '@utils/formatters'
import Link from 'next/link'
import { DeleteButton } from './action-buttons/delete'
import { User as UserIcon } from 'tabler-icons-react'
import TanStackTable from '@elements/tan-stack-table'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'

type ProtocolWithIncludes = Prisma.ProtocolGetPayload<{
    select: {
        id: true
        state: true
        createdAt: true
        convocatory: { select: { id: true; name: true } }
        researcher: {
            select: { id: true; name: true; role: true; email: true }
        }
        reviews: {
            select: {
                id: true
                updatedAt: true
                type: true
                verdict: true
                reviewer: {
                    select: { id: true; name: true; role: true; email: true }
                }
            }
        }
        sections: {
            select: {
                identification: true
                duration: { select: { modality: true; duration: true } }
            }
        }
    }
}>

export default function ProtocolTable({
    user,
    protocols,
    totalRecords,
}: {
    user: User
    protocols: ProtocolWithIncludes[]
    totalRecords: number
}) {
    const columns = useMemo<ColumnDef<ProtocolWithIncludes>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                cell: ({ row }) => (
                    <span className="text-xs text-gray-600">
                        {row.original.id}
                    </span>
                ),
            },
            {
                accessorKey: 'createdAt',
                header: 'Creado',
                cell: ({ row }) => (
                    <span className="text-xs text-gray-600">
                        {dateFormatter.format(row.original.createdAt)}
                    </span>
                ),
            },
            {
                accessorKey: 'sections.identification.title',
                header: 'Titulo',
                enableHiding: false,
            },
            {
                accessorKey: 'sections.identification.sponsor',
                header: 'Unidad Académica',
            },
            {
                accessorKey: 'sections.duration.modality',
                header: 'Modalidad',
            },
            {
                accessorKey: 'sections.duration.duration',
                header: 'Duración',
            },
            {
                accessorKey: 'state',
                header: 'Estado',
                cell: ({ row }) => (
                    <>{ProtocolStatesDictionary[row.original.state]}</>
                ),
            },
            {
                id: 'reviews_0.reviewer.name',
                accessorFn: (row) => row.reviews[0]?.reviewer.name,
                header: 'Evaluador Metodólogo',
                enableSorting: false,
            },
            {
                id: 'reviews_0.verdict',
                accessorFn: (row) => row.reviews[0]?.verdict,
                header: 'Veredicto Metodológico',
                enableSorting: false,
            },

            {
                id: 'reviews_1.reviewer.name',
                accessorFn: (row) => row.reviews[1]?.reviewer.name,
                header: 'Evaluador Interno',
                enableSorting: false,
            },
            {
                id: 'reviews_1.verdict',
                accessorFn: (row) => row.reviews[1]?.verdict,
                header: 'Veredicto Interno',
                enableSorting: false,
            },

            {
                id: 'reviews_2.reviewer.name',
                accessorFn: (row) => row.reviews[2]?.reviewer.name,
                header: 'Evaluador Externo',
                enableSorting: false,
            },
            {
                id: 'reviews_2.verdict',
                accessorFn: (row) => row.reviews[2]?.verdict,
                header: 'Veredicto Externo',
                enableSorting: false,
            },

            {
                accessorKey: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <Link
                        href={`/protocols/${row.original.id}`}
                        passHref
                        className="transition-all duration-150 hover:text-black/60"
                    >
                        Ver
                    </Link>
                ),
                enableHiding: false,
                enableSorting: false,
            },
        ],
        []
    )

    const initialVisible = {
        id: false,
        'reviews_0.verdict': false,
        'reviews_0.reviewer.name': false,
        'reviews_1.verdict': false,
        'reviews_1.reviewer.name': false,
        'reviews_2.verdict': false,
        'reviews_2.reviewer.name': false,
    }
    return (
        // <div className="mx-auto max-w-7xl">
        //     <table className="-mx-4 mt-8 min-w-full divide-y divide-gray-300 sm:-mx-0">
        //         <thead>
        //             <tr>
        //                 <th scope="col" className="py-3.5">
        //                     <span className="sr-only">Self indicator</span>
        //                 </th>
        //                 <th
        //                     scope="col"
        //                     className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-1"
        //                 >
        //                     Título
        //                 </th>
        //                 <th
        //                     scope="col"
        //                     className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
        //                 >
        //                     Facultad / Carrera
        //                 </th>
        //                 <th
        //                     scope="col"
        //                     className="table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
        //                 >
        //                     Estado
        //                 </th>
        //                 <th
        //                     scope="col"
        //                     className="relative py-3.5 pl-3 pr-4 sm:pr-1"
        //                 >
        //                     <span className="sr-only">Ver</span>
        //                 </th>
        //                 {user.role === 'ADMIN' ? (
        //                     <th
        //                         scope="col"
        //                         className="relative py-3.5 pl-3 pr-4 sm:pr-1"
        //                     >
        //                         <span className="sr-only">Ver</span>
        //                     </th>
        //                 ) : null}
        //             </tr>
        //         </thead>
        //         <tbody className="divide-y divide-gray-200 bg-white">
        //             {protocols.map((protocol) => (
        //                 <tr
        //                     key={protocol.id}
        //                     className={
        //                         protocol.state === State.DELETED
        //                             ? 'opacity-50'
        //                             : ''
        //                     }
        //                 >
        //                     <td className={'pb-4'}>
        //                         {user.id === protocol.researcherId ? (
        //                             <UserIcon className="h-4 w-4 text-gray-600" />
        //                         ) : null}
        //                     </td>
        //                     <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-1">
        //                         {protocol.sections.identification.title}
        //                         <dl>
        //                             <dd className=" text-xs font-light text-gray-500 lg:text-sm">
        //                                 {dateFormatter.format(
        //                                     protocol.createdAt
        //                                 )}
        //                             </dd>
        //                             <dd className=" text-gray-600 lg:hidden">
        //                                 {protocol.sections.identification
        //                                     .sponsor.length < 2
        //                                     ? protocol.sections.identification
        //                                           .sponsor
        //                                     : protocol.sections.identification.sponsor
        //                                           .map(
        //                                               (e: string) =>
        //                                                   e.split('-')[1]
        //                                           )
        //                                           .join(' - ')}
        //                             </dd>
        //                         </dl>
        //                     </td>
        //                     <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
        //                         <dl>
        //                             <dd className=" text-gray-700">
        //                                 {protocol.sections.identification
        //                                     .sponsor.length < 2
        //                                     ? protocol.sections.identification
        //                                           .sponsor
        //                                     : protocol.sections.identification.sponsor
        //                                           .map(
        //                                               (e: string) =>
        //                                                   e.split('-')[1]
        //                                           )
        //                                           .join(' - ')}
        //                             </dd>
        //                             <dd className=" font-light text-gray-500">
        //                                 {
        //                                     protocol.sections.identification
        //                                         .career
        //                                 }
        //                             </dd>
        //                         </dl>
        //                     </td>
        //                     <td className="table-cell px-3 py-4 text-sm font-medium text-gray-600">
        //                         {ProtocolStatesDictionary[protocol.state]}
        //                     </td>
        //                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
        //                     <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
        //                         <Link
        //                             href={`/protocols/${protocol.id}`}
        //                             passHref
        //                             className="transition-all duration-150 hover:text-black/60"
        //                         >
        //                             Ver
        //                         </Link>
        //                     </td>
        //                     {user.role === 'ADMIN' &&
        //                     protocol.state !== State.DELETED ? (
        //                         <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
        //                             <DeleteButton
        //                                 protocolId={protocol.id}
        //                                 protocolState={protocol.state}
        //                             />
        //                         </td>
        //                     ) : null}
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>
        // </div>
        <TanStackTable
            data={protocols}
            columns={columns}
            totalRecords={totalRecords}
            initialVisibility={initialVisible}
        />
    )
}
