'use client'
import type { AcademicUnit, User } from '@prisma/client'
import { SecretaryMultipleSelect } from './secretary-multiple-select'
import type { ColumnDef } from '@tanstack/react-table'
import TanStackTable from '@elements/tan-stack-table'
import Link from 'next/link'
import { buttonStyle } from '@elements/button/styles'
import { cx } from '@utils/cx'

export default async function AcademicUnitsTable({
    academicUnits,
    secretaries,
}: {
    academicUnits: AcademicUnit[]
    secretaries: User[]
}) {
    const columns: ColumnDef<AcademicUnit>[] = [
        {
            accessorKey: 'name',
            header: 'Unidad Academica',
            enableHiding: false,
            enableSorting: true,
        },
        {
            accessorKey: 'secretariesIds',
            header: 'Secretarios/as',
            enableHiding: false,
            enableSorting: false,
            cell: ({ row }) => (
                <SecretaryMultipleSelect
                    className="w-96 max-w-lg text-gray-500"
                    currentSecretaries={row.original.secretariesIds}
                    secretaries={secretaries}
                    unitId={row.id}
                />
            ),
        },
        // {
        //     accessorKey: 'actions',
        //     header: 'Acciones',
        //     cell: ({ row }) => (
        //         <div className="flex items-center justify-between gap-1">
        //             <Link
        //                 href={`/protocols/${row.original.id}`}
        //                 passHref
        //                 className={cx(
        //                     buttonStyle('secondary'),
        //                     'px-2.5 py-1 text-xs'
        //                 )}
        //             >
        //                 Ver
        //             </Link>
        //         </div>
        //     ),
        //     enableHiding: true,
        //     enableSorting: false,
        // },
    ]

    return (
        <TanStackTable
            data={academicUnits}
            columns={columns}
            totalRecords={academicUnits.length}
            initialVisibility={{
                name: true,
                secretariesIds: true,
            }}
            searchBarPlaceholder="Buscar por nombre de categoría"
        />
    )
}
