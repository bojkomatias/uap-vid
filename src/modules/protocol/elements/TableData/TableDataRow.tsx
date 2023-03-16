import React from 'react'
interface TableDataRowProps {
    data: {
        left: {
            up: string
            down: string
        }
        right: {
            up: string
            down: string
        }
    }
}
const TableDataRow = ({ data }: TableDataRowProps) => {
    return (
        <div className="relative flex items-center py-4 px-4">
            <div className="min-w-0 flex-1">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                    {data.left.up}
                </p>
                <p className="truncate text-sm text-gray-500">
                    {data.left.down}
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-600">{data.right.up}</p>
                <p className="truncate font-medium text-gray-800 text-right">
                    {data.right.down}
                </p>
            </div>
        </div>
    )
}

export default TableDataRow
