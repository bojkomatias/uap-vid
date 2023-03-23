import React from 'react'
interface ShortDataProps {
    title: string
    value: string
}
const ShortData = ({ title, value }: ShortDataProps) => {
    return (
        <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">{title}</dt>
            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
        </div>
    )
}

export default ShortData
