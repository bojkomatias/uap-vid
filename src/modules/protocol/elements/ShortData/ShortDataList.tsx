import React from 'react'
import ShortData from './ShortData'

interface ShortDataListProps {
    data: {
        title: string
        value: string
    }[]
}

const ShortDataList = ({ data }: ShortDataListProps) => {
    return (
        <>
            {data.map((item) => (
                <ShortData
                    key={item.title}
                    title={item.title}
                    value={item.value}
                />
            ))}
        </>
    )
}

export default ShortDataList
