import { Badge, BadgeButton } from '@components/badge'
import { TableFilterDictionary } from '@utils/dictionaries/TableFilterDictionary'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { X } from 'tabler-icons-react'

export function TableFilterRemover() {
  const searchParams = useSearchParams()
  const filters = useMemo(
    () => Array.from(searchParams.entries()),
    [searchParams]
  )
  const update = useUpdateQuery()

  return (
    <div className="mt-1 flex gap-1">
      {filters.map(([filter]) =>
        TableFilterDictionary[filter] ?
          <div key={filter} className="flex gap-px">
            <Badge className="rounded-r-none">
              {TableFilterDictionary[filter]}
            </Badge>
            <BadgeButton
              className="h-full rounded-l-none"
              onClick={() => {
                update({ [filter]: '' })
              }}
            >
              <X data-slot="icon" className="size-3.5" />
            </BadgeButton>
          </div>
        : null
      )}
      <Badge className="invisible">0</Badge>
    </div>
  )
}
