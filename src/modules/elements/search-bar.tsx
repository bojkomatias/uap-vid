'use client'
import { Button } from './button'
import { useState } from 'react'
import { useUpdateQuery } from '@utils/updateQuery'

export default function SearchBar({
    placeholderMessage,
}: {
    placeholderMessage: string
}) {
    const update = useUpdateQuery()

    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="flex max-w-4xl flex-grow items-center gap-2 rounded-md">
            <input
                onKeyUpCapture={(e) => {
                    if (e.key === 'Enter') update({ search: searchQuery })
                }}
                onChange={(e) => {
                    setSearchQuery(e.target.value)
                    //If searchQuery is empty, goes back to the normal paginated page
                    if (e.target.value === '') update({ search: '' })
                }}
                className="input"
                placeholder={placeholderMessage}
            />
            <Button
                onClick={() => {
                    if (searchQuery == '') update({ search: '' })
                    else update({ search: searchQuery })
                }}
                intent="secondary"
            >
                Buscar
            </Button>
        </div>
    )
}
