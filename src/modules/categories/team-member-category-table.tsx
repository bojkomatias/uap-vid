'use client'
import type { TeamMemberCategory } from '@prisma/client'
import TanStackTable from '@elements/tan-stack-table'
import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import PriceUpdate from './price-update'
import TeamMemberCategoryView from './team-member-category-view'
import Currency from '@elements/currency'
import { Button } from '@elements/button'
import { useCustomNotification } from '@utils/notifications-hook'

export default function CategoriesTable({
    categories,
    totalRecords,
}: {
    categories: TeamMemberCategory[]
    totalRecords: number
}) {
    const notificationHook = useCustomNotification()
    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                cell: ({ row }) => (
                    <span className="text-xs text-gray-600">
                        {row.original.id}
                    </span>
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'name',
                header: 'Categoría',
                enableHiding: false,
            },

            {
                accessorKey: 'price',
                header: 'Valor hora',
                enableHiding: false,
                enableSorting: false,
                cell: ({ row }) => (
                    <Currency
                        amount={
                            row.original.price[row.original.price.length - 1]
                                ?.price
                        }
                        currency={
                            row.original.price[row.original.price.length - 1]
                                ?.currency
                        }
                    />
                ),
            },

            {
                accessorKey: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="relative flex items-center justify-end gap-1">
                        {row.original.price.length > 1 && (
                            <TeamMemberCategoryView
                                teamMemberCategory={row.original}
                            />
                        )}
                        <PriceUpdate category={row.original} />
                    </div>
                ),
                enableHiding: false,
                enableSorting: false,
            },
        ],
        []
    )
    const initialVisible = { id: false }

    return (
        <>
            <Button
                onClick={() => {
                    //Acá est donde estoy testeando el hook. Usando render() me había funcionado, pero como está deprecado y afecta a la performance, no quise ir por ese lado. Probé con createPortal, que funciona de manera similar a render() y no renderiza la notificación.
                    notificationHook({
                        title: 'Hola',
                        message: 'Testeando hook de notificaciones',
                        intent: 'success',
                        ms_duration: 5000,
                    })
                }}
                intent="primary"
            >
                Hola
            </Button>

            <TanStackTable
                data={categories}
                columns={columns}
                totalRecords={totalRecords}
                initialVisibility={initialVisible}
                searchBarPlaceholder="Buscar por nombre de categoría"
            />
        </>
    )
}
