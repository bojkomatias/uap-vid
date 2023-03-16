import clsx from 'clsx'
import React from 'react'
interface TableDataRowProps {
    data: {
        up: string
        down: string
        inverted?: boolean
        columnWidth?: string
    }[]
}

const TableDataRow = ({ data }: TableDataRowProps) => {
    return (
        <div
            className={`relative grid grid-cols-${data.length} grid-flow-col place-items-start justify-between py-4 px-4`}
        >
            {data.map((item, index) => (
                <div className="last:place-self-start" key={index}>
                    <p
                        className={clsx(
                            { 'font-medium text-gray-900': !item.inverted },
                            'text-sm text-gray-500'
                        )}
                    >
                        {item.up}
                    </p>
                    <p
                        className={clsx(
                            { 'font-medium text-gray-900': item.inverted },
                            'text-sm text-gray-500'
                        )}
                    >
                        {item.down}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default TableDataRow
