'use client'
import { Button } from './button'
import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar({
    placeholderMessage,
}: {
    placeholderMessage: string
}) {
    const router = useRouter()
    const path = usePathname()
    const searchParams = useSearchParams()

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search'))

    return (
        <div className="mx-auto mt-3 flex max-w-4xl flex-grow items-center gap-2 rounded-md">
            <input
                onKeyUpCapture={(e) => {
                    if (e.key === 'Enter')
                        router.push(`${path}?search=${searchQuery}&page=1`)
                }}
                onChange={(e) => {
                    setSearchQuery(e.target.value)
                    //If searchQuery is empty, goes back to the normal paginated page
                    if (e.target.value === '') {
                        router.push(`${path}?page=${searchParams.get('page')}`)
                    }
                }}
                className="input"
                placeholder={placeholderMessage}
            />
            <Button
                onClick={() => {
                    if (searchQuery == '') {
                        router.push(path)
                    } else {
                        router.push(`${path}?search=${searchQuery}`)
                    }
                }}
                intent="secondary"
            >
                Buscar
            </Button>
        </div>
    )
}
