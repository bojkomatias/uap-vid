'use client'
import { flexRender, type Header } from '@tanstack/react-table'
import { useUpdateQuery } from '@utils/updateQuery'
import React from 'react'

export default function HeaderSorter({
    header,
}: {
    header: Header<any, unknown>
}) {
    const update = useUpdateQuery()
    return header.isPlaceholder ? null : (
        <div
            {...{
                className: header.column.getCanSort()
                    ? 'cursor-pointer select-none'
                    : '',
                onClick: () => update({ order: header.id }),
            }}
        >
            {flexRender(header.column.columnDef.header, header.getContext())}
        </div>
    )
}
