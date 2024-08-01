'use client'

import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { Input, InputGroup } from '@components/input'
import { Search } from 'tabler-icons-react'
import { useSearchParams } from 'next/navigation'

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const update = useUpdateQuery()
  const searchParams = useSearchParams()

  let timeout: NodeJS.Timeout
  const setSearch = (search: string) => {
    timeout = setTimeout(() => {
      update({ search })
    }, 250)
  }

  return (
    <InputGroup>
      <Search data-slot="icon" />
      <Input
        defaultValue={searchParams.get('search') ?? ''}
        onChange={(e) => {
          clearTimeout(timeout)
          setSearch(e.target.value)
        }}
        placeholder={placeholder}
        className="min-w-80"
      />
    </InputGroup>
  )
}
