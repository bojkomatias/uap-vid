'use client'
import { Button } from './Button'
import { KeyboardEvent, SyntheticEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    function handleKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            if (searchQuery == '') {
                router.push('/protocols')
            } else {
                router.push(`/protocols?search=${searchQuery}`)
            }
        }
    }

    console.log(searchQuery)

    return (
        <div className="mr-2 flex flex-grow items-center gap-2 rounded-md">
            <input
                onKeyPress={(e) => {
                    handleKeyPress(e as KeyboardEvent)
                }}
                onChange={(e) => {
                    setSearchQuery(e.target.value)
                    //If searchQuery is empty, goes back to the normal paginated page
                    if (searchQuery.trim().length > 0) {
                        router.push('/protocols')
                    }
                }}
                className="input"
                placeholder="Buscar protocolo por título, facultad, carrera, estado, etc."
            />
            <Button
                onClick={() => {
                    if (searchQuery == '') {
                        router.push('/protocols')
                    } else {
                        router.push(`/protocols?search=${searchQuery}`)
                    }
                }}
                intent="secondary"
            >
                Buscar
            </Button>
        </div>
    )
}
