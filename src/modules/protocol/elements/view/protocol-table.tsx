'use client'
import type { Prisma, User } from '@prisma/client'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { dateFormatter } from '@utils/formatters'
import Link from 'next/link'
import { Number, User as UserIcon } from 'tabler-icons-react'
import TanStackTable from '@elements/tan-stack-table'
import { type ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import ReviewVerdictBadge from '@review/elements/review-verdict-badge'
import { Badge } from '@elements/badge'
import { buttonStyle } from '@elements/button/styles'
import { cx } from '@utils/cx'
import Observation from '../action-buttons/observation'
import { Button } from '@elements/button'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { useSearchParams } from 'next/navigation'

type ProtocolWithIncludes = Prisma.ProtocolGetPayload<{
    select: {
        id: true
        protocolNumber: true
        state: true
        createdAt: true
        observations: true
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
                accessorKey: 'observations',
                header: '',
                cell: ({ row }) => (
                    <Observation
                        id={row.original.id}
                        observations={row.original.observations}
                    />
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'id',
                header: '#',
                cell: ({ row }) => (
                    <span className="text-xs text-gray-600">
                        {row.original.id}
                    </span>
                ),
            },
            {
                accessorKey: 'createdAt',
                header: 'Creación',
                cell: ({ row }) => (
                    <span className="text-xs text-gray-600">
                        {dateFormatter.format(row.original.createdAt!)}
                    </span>
                ),
            },
            {
                accessorKey: 'protocolNumber',
                header: () => <Number className="h-4 w-6" />,
            },
            {
                accessorKey: 'convocatory.year',
                header: 'Año',
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
                    <div className="min-w-[24rem] whitespace-normal font-medium">
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
                enableSorting: false,
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
                    <Badge>
                        {ProtocolStatesDictionary[row.original.state]}
                    </Badge>
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
                    <Link
                        href={`/protocols/${row.original.id}`}
                        passHref
                        className={cx(
                            buttonStyle('secondary'),
                            'px-2.5 py-1 text-xs'
                        )}
                    >
                        Ver
                    </Link>
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
        convocatory_year: false,
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
            customFilterSlot={
                user.role === 'ADMIN' || user.role === 'SECRETARY' ? (
                    <AcademicUnitFilter />
                ) : null
            }
            searchBarPlaceholder="Buscar por: Titulo, Investigador, Modalidad, etc"
        />
    )
}
/**
 * Academic unit filter, specific to business in protocol table
 * @returns
 */
const AcademicUnitFilter = () => {
    const update = useUpdateQuery()
    const searchParams = useSearchParams()
    const currentValues = searchParams?.get('units')?.split('-')

    const values = ['FACEA', 'FCS', 'FHECIS', 'FT', 'CONICET', 'CIICSAC', 'EG']

    return (
        <div className="relative mt-4 flex flex-col items-start text-sm">
            <div className="relative flex flex-wrap gap-2">
                {values.map((value, i) => {
                    return (
                        <Button
                            onClick={() => {
                                update({
                                    units: currentValues
                                        ? currentValues.includes(value)
                                            ? currentValues
                                                  .filter((e) => e !== value)
                                                  .join('-')
                                            : currentValues
                                                  .join('-')
                                                  .concat('-', value)
                                        : value,
                                })
                            }}
                            intent="unset"
                            key={i}
                        >
                            <Badge
                                className={cx(
                                    'cursor-pointer transition hover:bg-gray-200',
                                    currentValues?.includes(value) &&
                                        'bg-gray-300'
                                )}
                            >
                                {value}
                            </Badge>
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
