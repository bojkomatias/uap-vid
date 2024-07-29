import { Badge, BadgeButton } from '@components/badge'
import { PageFilterDictionary } from '@utils/dictionaries/PageFilterDictionary'
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
    <div className="-mb-2 mt-1 flex h-6 gap-1">
      {filters.map(([filter]) =>
        PageFilterDictionary[filter] ?
          <div key={filter} className="flex gap-px">
            <Badge className="rounded-r-none">
              {PageFilterDictionary[filter]}
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
    </div>
  )
}
