'use client'
import type { Prisma, User } from '@prisma/client'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { dateFormatter } from '@utils/formatters'
import Link from 'next/link'
import { DeleteButton } from './action-buttons/delete'
import { User as UserIcon } from 'tabler-icons-react'
import TanStackTable from '@elements/tan-stack-table'
import { type ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { Button } from '@elements/button'
import ReviewVerdictBadge from '@review/elements/review-verdict-badge'

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
                accessorKey: 'self-indicator',
                header: '',
                cell: ({ row }) =>
                    user.id === row.original.researcher.id && (
                        <UserIcon className="h-4 w-4 text-gray-600" />
                    ),
                enableHiding: false,
                enableSorting: false,
            },
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
                accessorKey: 'convocatory.name',
                header: 'Convocatoria',
            },
            {
                accessorKey: 'researcher.name',
                header: 'Investigador',
            },
            {
                accessorKey: 'sections.identification.title',
                header: 'Titulo',
                cell: ({ row }) => (
                    <div className="min-w-[24rem] whitespace-normal font-semibold">
                        {row.original.sections.identification.title}
                    </div>
                ),
                enableHiding: false,
            },
            {
                accessorKey: 'sections.identification.sponsor',
                header: 'Unidades Académicas',
                cell: ({ row }) => (
                    <ul className="text-xs">
                        {row.original.sections.identification.sponsor.map(
                            (s) => (
                                <li key={s}>{s}</li>
                            )
                        )}
                    </ul>
                ),
            },
            {
                accessorKey: 'sections.identification.career',
                header: 'Carrera',
            },
            {
                accessorKey: 'sections.identification.assignment',
                header: 'Asignatura',
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
                    <Button
                        intent="badge"
                        className="pointer-events-none whitespace-nowrap text-xs"
                    >
                        {ProtocolStatesDictionary[row.original.state]}
                    </Button>
                ),
            },
            {
                id: 'reviews_0.reviewer.name',
                accessorFn: (row) => row.reviews[0]?.reviewer.name,
                header: 'Evaluador Metodólogo',
                enableSorting: false,
                enableHiding:
                    user.role === 'ADMIN' || user.role === 'SECRETARY',
            },
            {
                id: 'reviews_0.verdict',
                accessorFn: (row) => row.reviews[0]?.verdict,
                header: 'Veredicto Metodológico',
                cell: ({ row }) => (
                    <ReviewVerdictBadge
                        verdict={row.original.reviews[0]?.verdict}
                    />
                ),
                enableSorting: false,
                enableHiding:
                    user.role === 'ADMIN' ||
                    user.role === 'SECRETARY' ||
                    user.role === 'RESEARCHER',
            },

            {
                id: 'reviews_1.reviewer.name',
                accessorFn: (row) => row.reviews[1]?.reviewer.name,
                header: 'Evaluador Interno',
                enableSorting: false,
                enableHiding:
                    user.role === 'ADMIN' || user.role === 'SECRETARY',
            },
            {
                id: 'reviews_1.verdict',
                accessorFn: (row) => row.reviews[1]?.verdict,
                header: 'Veredicto Interno',
                cell: ({ row }) => (
                    <ReviewVerdictBadge
                        verdict={row.original.reviews[1]?.verdict}
                    />
                ),
                enableSorting: false,
                enableHiding:
                    user.role === 'ADMIN' ||
                    user.role === 'SECRETARY' ||
                    user.role === 'RESEARCHER',
            },
            {
                id: 'reviews_2.reviewer.name',
                accessorFn: (row) => row.reviews[2]?.reviewer.name,
                header: 'Evaluador Externo',
                enableSorting: false,
                enableHiding:
                    user.role === 'ADMIN' || user.role === 'SECRETARY',
            },
            {
                id: 'reviews_2.verdict',
                accessorFn: (row) => row.reviews[2]?.verdict,
                header: 'Veredicto Externo',
                cell: ({ row }) => (
                    <ReviewVerdictBadge
                        verdict={row.original.reviews[2]?.verdict}
                    />
                ),
                enableSorting: false,
                enableHiding:
                    user.role === 'ADMIN' ||
                    user.role === 'SECRETARY' ||
                    user.role === 'RESEARCHER',
            },
            {
                id: 'reviews_3.reviewer.name',
                accessorFn: (row) => row.reviews[3]?.reviewer.name,
                header: 'Evaluador Tercero',
                enableSorting: false,
                enableHiding:
                    user.role === 'ADMIN' || user.role === 'SECRETARY',
            },
            {
                id: 'reviews_3.verdict',
                accessorFn: (row) => row.reviews[3]?.verdict,
                header: 'Veredicto Tercero',
                cell: ({ row }) => (
                    <ReviewVerdictBadge
                        verdict={row.original.reviews[3]?.verdict}
                    />
                ),
                enableSorting: false,
                enableHiding:
                    user.role === 'ADMIN' ||
                    user.role === 'SECRETARY' ||
                    user.role === 'RESEARCHER',
            },
            {
                accessorKey: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="mx-1 flex gap-3 font-semibold">
                        <Link
                            href={`/protocols/${row.original.id}`}
                            passHref
                            className="transition-all duration-150 hover:text-black/60"
                        >
                            Ver
                        </Link>
                        {user.role === 'ADMIN' && (
                            <DeleteButton
                                protocolId={row.original.id}
                                protocolState={row.original.state}
                            />
                        )}
                    </div>
                ),
                enableHiding: false,
                enableSorting: false,
            },
        ],
        [user.id, user.role]
    )

    const initialVisible = {
        id: false,
        createdAt: false,
        convocatory_name: false,
        researcher_name: false,
        'sections_identification.career': false,
        'sections_identification.assignment': false,
        'sections_duration.modality': false,
        'sections_duration.duration': false,
        'reviews_0.verdict': false,
        'reviews_0.reviewer.name': false,
        'reviews_1.verdict': false,
        'reviews_1.reviewer.name': false,
        'reviews_2.verdict': false,
        'reviews_2.reviewer.name': false,
        'reviews_3.verdict': false,
        'reviews_3.reviewer.name': false,
    }
    return (
        <TanStackTable
            data={protocols}
            columns={columns}
            totalRecords={totalRecords}
            initialVisibility={initialVisible}
            filterableByKey={{
                filter: 'state',
                // Slice to avoid NOT_CREATED
                values: Object.entries(ProtocolStatesDictionary).slice(
                    1,
                    user.role === 'ADMIN' ? undefined : -1
                ),
            }}
            searchBarPlaceholder="Buscar por: Titulo, Investigador, Modalidad, etc"
        />
    )
}
