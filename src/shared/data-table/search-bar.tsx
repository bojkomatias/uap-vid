'use client'

import { useState } from 'react'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { Input, InputGroup } from '@components/input'
import { Search } from 'tabler-icons-react'

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const update = useUpdateQuery()

  const [searchQuery, setSearchQuery] = useState('')

  return (
    <InputGroup>
      <Search data-slot="icon" />
      <Input
        onKeyUpCapture={(e) => {
          if (e.key === 'Enter') update({ search: searchQuery })
        }}
        onChange={(e) => {
          setSearchQuery(e.target.value)
          //If searchQuery is empty, goes back to the normal paginated page
          if (e.target.value === '') update({ search: '' })
        }}
        placeholder={placeholder}
        className="min-w-80"
      />
    </InputGroup>
  )
}
