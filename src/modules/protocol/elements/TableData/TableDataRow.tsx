import clsx from 'clsx'
import React from 'react'
interface TableDataRowProps {
    data: {
        up: string
        down: string
        inverted?: boolean
    }[]
}

const TableDataRow = ({ data }: TableDataRowProps) => {
    return (
        <div
            className={clsx(
                'relative space-y-2 sm:space-y-0 sm:grid place-items-center py-4 px-4',
                {
                    'grid-cols-2': data.length == 2,
                    'grid-cols-3': data.length == 3,
                    'grid-cols-4': data.length == 4,
                }
            )}
        >
            {data.map((item, index) => (
                <div
                    key={index}
                    className="first:place-self-start last:place-self-end last:text-right"
                >
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
