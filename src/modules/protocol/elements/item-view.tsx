import React from 'react'
import { EmptyStateItem } from './empty-state-item'
interface ShortDataProps {
    title: string
    value: string
}
const ItemView = ({ title, value }: ShortDataProps) => {
    return (
        <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">{title}</dt>
            {value ? (
                <dd className="mt-1 text-sm text-gray-900">{value}</dd>
            ) : (
                <EmptyStateItem />
            )}
        </div>
    )
}

export default ItemView
