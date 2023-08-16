/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { flexRender, type Header } from '@tanstack/react-table'
import { useUpdateQuery } from '@utils/updateQuery'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { ArrowDown, ArrowUp } from 'tabler-icons-react'

export default function HeaderSorter({
    header,
}: {
    header: Header<any, unknown>
}) {
    const searchParams = useSearchParams()
    const update = useUpdateQuery()
    return header.isPlaceholder ? null : (
        <div
            {...{
                className: header.column.getCanSort()
                    ? 'cursor-pointer select-none flex items-center'
                    : '',
                onClick: () =>
                    header.column.getCanSort() &&
                    update({
                        order: header.id,
                        sort:
                            searchParams?.get('sort') == null ||
                            searchParams.get('order') !== header.id
                                ? 'asc'
                                : searchParams?.get('sort') == 'asc'
                                ? 'desc'
                                : searchParams?.get('sort') == 'desc'
                                ? null
                                : 'asc',
                    }),
            }}
        >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {searchParams?.get('order') === header.column.id ? (
                searchParams.get('sort') === 'asc' ? (
                    <ArrowUp className="ml-1.5 h-4 w-4 text-primary" />
                ) : (
                    <ArrowDown className="ml-1.5 h-4 w-4 text-primary" />
                )
            ) : null}
        </div>
    )
}
