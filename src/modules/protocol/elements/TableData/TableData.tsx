import React from 'react'
import TableDataRow from './TableDataRow'
interface TableDataProps {
    data: {
        title: string
        values: {
            left: {
                up: string
                down: string
            }
            right: {
                up: string
                down: string
            }
        }[]
    }
}
const TableData = ({ data }: TableDataProps) => {
    return <div className="sm:col-span-2">
    <dt className="text-sm font-medium text-gray-500">
        {data.title}
    </dt>
    <dd className="mt-1 text-sm text-gray-900">
        <div className="grid grid-cols-1 border mt-2 rounded-lg divide-y">
            {data.values.map((row, index) => (
               <TableDataRow data={row} key={index} />
            ))}
        </div>
    </dd>
</div>
}

export default TableData
