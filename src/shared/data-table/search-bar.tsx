'use client'
import { Button } from './button'
import { useState } from 'react'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { cx } from '@utils/cx'
import { Input } from '@components/input'

export default function SearchBar({
  placeholderMessage,
}: {
  placeholderMessage: string
}) {
  const update = useUpdateQuery()

  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Input
      onKeyUpCapture={(e) => {
        if (e.key === 'Enter') update({ search: searchQuery })
      }}
      onChange={(e) => {
        setSearchQuery(e.target.value)
        //If searchQuery is empty, goes back to the normal paginated page
        if (e.target.value === '') update({ search: '' })
      }}
      placeholder={placeholderMessage}
      className="max-w-sm"
    />
  )
}
