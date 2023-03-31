'use client'
import { Button } from './button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    return (
        <div className="mx-auto mt-3 flex max-w-4xl flex-grow items-center gap-2 rounded-md">
            <input
                onKeyUpCapture={(e) => {
                    if (e.key === 'Enter')
                        router.push(`/protocols?search=${searchQuery}`)
                }}
                onChange={(e) => {
                    setSearchQuery(e.target.value)
                    //If searchQuery is empty, goes back to the normal paginated page
                    if (e.target.value === '') {
                        router.push('/protocols')
                    }
                }}
                className="input"
                placeholder="Buscar protocolo por título o carrera"
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