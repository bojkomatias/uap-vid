'use client'

import type { Prisma, ProtocolState, User } from '@prisma/client'
import ProtocolStatesDictionary from '@utils/dictionaries/ProtocolStatesDictionary'
import { dateFormatter } from '@utils/formatters'
import { User as UserIcon } from 'tabler-icons-react'
import TanStackTable from '@shared/data-table/tan-stack-table'
import { type ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import ReviewVerdictBadge from '@review/elements/review-verdict-badge'
import { Badge } from '@components/badge'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import ProtocolLogsDrawer from '../logs/log-drawer'
import { Strong, Text } from '@components/text'
import SearchBar from '@shared/data-table/search-bar'
import { Listbox, ListboxLabel, ListboxOption } from '@components/listbox'

type ProtocolWithIncludes = Prisma.ProtocolGetPayload<{
  select: {
    id: true
    protocolNumber: true
    state: true
    createdAt: true
    logs: {
      include: { user: { select: { name: true } } }
    }
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
  academicUnits,
  careers,
}: {
  user: User
  protocols: ProtocolWithIncludes[]
  totalRecords: number
  academicUnits: { id: string; name: string; shortname: string }[]
  careers: { id: string; name: string }[]
}) {
  const columns = useMemo<ColumnDef<ProtocolWithIncludes>[]>(
    () => [
      {
        accessorKey: 'self-indicator',
        header: '',
        cell: ({ row }) =>
          user.id === row.original.researcher.id && (
            <div className="group relative">
              <div className="pointer-events-none invisible absolute -top-2.5 left-5 z-40 truncate rounded-md bg-gray-50 px-3 py-2 text-sm text-black/70 shadow-sm ring-1 transition-all delay-0 group-hover:visible group-hover:delay-500">
                Este protocolo pertenece al usuario
              </div>
              <UserIcon className="pointer-event-auto h-4 w-4 text-gray-500" />
            </div>
          ),
        enableHiding: false,
        enableSorting: false,
      },
      {
        accessorKey: 'logs',
        header: '',
        cell: ({ row }) => (
          <ProtocolLogsDrawer
            logs={row.original.logs}
            userId={user.id}
            protocolId={row.original.id}
          />
        ),
        enableHiding: false,
        enableSorting: false,
      },
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <span className="text-xs text-gray-600">{row.original.id}</span>
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
        header: 'Nº',
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
          <Strong
            title={row.original.sections.identification.title}
            className="line-clamp-2 max-w-96 whitespace-normal text-sm/5"
          >
            {row.original.sections.identification.title}
          </Strong>
        ),
        enableHiding: false,
      },
      {
        accessorKey: 'sections.identification.academicUnitIds',
        header: 'Unidades Académicas',
        cell: ({ row }) => (
          <Text>
            {row.original.sections.identification.academicUnitIds
              .map((s) => academicUnits?.find((x) => x.id === s)?.shortname)
              .join(' - ')}
          </Text>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'sections.identification.careerId',
        header: 'Carrera',
        cell: ({ row }) => (
          <Text>
            {careers?.find(
              (c) => c.id === row.original.sections.identification.careerId
            )?.name ?? ''}
          </Text>
        ),
        enableSorting: false,
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
          <Badge>{ProtocolStatesDictionary[row.original.state]}</Badge>
        ),
      },
      {
        id: 'reviews_0.reviewer.name',
        accessorFn: (row) => row.reviews[0]?.reviewer.name,
        header: 'Evaluador Metodólogo',
        enableSorting: false,
        enableHiding: user.role === 'ADMIN' || user.role === 'SECRETARY',
      },
      {
        id: 'reviews_0.verdict',
        accessorFn: (row) => row.reviews[0]?.verdict,
        header: 'Veredicto Metodológico',
        cell: ({ row }) => (
          <ReviewVerdictBadge verdict={row.original.reviews[0]?.verdict} />
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
        enableHiding: user.role === 'ADMIN' || user.role === 'SECRETARY',
      },
      {
        id: 'reviews_1.verdict',
        accessorFn: (row) => row.reviews[1]?.verdict,
        header: 'Veredicto Interno',
        cell: ({ row }) => (
          <ReviewVerdictBadge verdict={row.original.reviews[1]?.verdict} />
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
        enableHiding: user.role === 'ADMIN' || user.role === 'SECRETARY',
      },
      {
        id: 'reviews_2.verdict',
        accessorFn: (row) => row.reviews[2]?.verdict,
        header: 'Veredicto Externo',
        cell: ({ row }) => (
          <ReviewVerdictBadge verdict={row.original.reviews[2]?.verdict} />
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
        enableHiding: user.role === 'ADMIN' || user.role === 'SECRETARY',
      },
      {
        id: 'reviews_3.verdict',
        accessorFn: (row) => row.reviews[3]?.verdict,
        header: 'Veredicto Tercero',
        cell: ({ row }) => (
          <ReviewVerdictBadge verdict={row.original.reviews[3]?.verdict} />
        ),
        enableSorting: false,
        enableHiding:
          user.role === 'ADMIN' ||
          user.role === 'SECRETARY' ||
          user.role === 'RESEARCHER',
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
      rowAsLinkPath="/protocols/"
    >
      <SearchBar placeholder="Titulo, Investigador, Modalidad, etc" />
      <AcademicUnitFilter academicUnits={academicUnits} />
      <StateFilter />
    </TanStackTable>
  )
}

const AcademicUnitFilter = ({
  academicUnits,
}: {
  academicUnits: { id: string; name: string; shortname: string }[]
}) => {
  const update = useUpdateQuery()

  return (
    <Listbox
      multiple
      placeholder="Unidad académica"
      onChange={(value: string[]) => {
        console.log(value.join('-'))
        update({
          units: value.join('-'),
        })
      }}
      className="max-w-xs"
    >
      {academicUnits.map((e) => (
        <ListboxOption key={e.id} value={e.id}>
          <ListboxLabel>{e.shortname}</ListboxLabel>
        </ListboxOption>
      ))}
    </Listbox>
  )
}

const StateFilter = () => {
  const update = useUpdateQuery()

  const states = Object.keys(ProtocolStatesDictionary) as ProtocolState[]
  return (
    <Listbox
      multiple
      placeholder="Estado"
      onChange={(value: string[]) => {
        update({
          states: value.join('-'),
        })
      }}
      className="max-w-xs"
    >
      {states.map((e) => (
        <ListboxOption key={e} value={e}>
          <ListboxLabel>{ProtocolStatesDictionary[e]}</ListboxLabel>
        </ListboxOption>
      ))}
    </Listbox>
  )
}
