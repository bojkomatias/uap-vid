/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { flexRender, type Header } from '@tanstack/react-table'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
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
                    ? 'cursor-pointer select-none flex items-center hover:text-black hover:font-medium'
                    : '',
                onClick: () =>
                    header.column.getCanSort() &&
                    update({
                        sort: header.id,
                        order:
                            searchParams?.get('sort') == null ||
                            searchParams.get('sort') !== header.id
                                ? 'asc'
                                : searchParams?.get('order') == 'asc'
                                ? 'desc'
                                : searchParams?.get('order') == 'desc'
                                ? null
                                : 'asc',
                    }),
            }}
        >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {searchParams?.get('sort') === header.column.id ? (
                searchParams.get('order') === 'asc' ? (
                    <ArrowUp className="ml-1.5 h-4 w-4 text-primary" />
                ) : (
                    <ArrowDown className="ml-1.5 h-4 w-4 text-primary" />
                )
            ) : null}
        </div>
    )
}
