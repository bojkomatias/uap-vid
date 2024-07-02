/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { BadgeButton } from '@components/badge'

export default function EnumFilterOptions({
  filter,
  values,
}: {
  filter: string
  values: string[][] | any[]
}) {
  const update = useUpdateQuery()
  const searchParams = useSearchParams()
  const currentValues = searchParams?.get('values')?.split('-')
  return (
    <div>
      <div className="relative mt-4 flex flex-col items-start text-sm">
        <div className="relative flex flex-wrap gap-2">
          {values[0]?.[0] ?
            values.map(([value, name], i) => {
              return (
                <BadgeButton
                  onClick={() => {
                    update({
                      filter,
                      values:
                        currentValues ?
                          currentValues.includes(value) ?
                            currentValues.filter((e) => e !== value).join('-')
                          : currentValues.join('-').concat('-', value)
                        : value,
                    })
                  }}
                  key={i}
                >
                  {name}
                </BadgeButton>
              )
            })
          : values.map((value, i) => {
              return (
                <BadgeButton
                  onClick={() => {
                    update({
                      filter,
                      values:
                        currentValues ?
                          currentValues.includes(value) ?
                            currentValues.filter((e) => e !== value).join('-')
                          : currentValues.join('-').concat('-', value)
                        : value,
                    })
                  }}
                  key={i}
                >
                  {value}
                </BadgeButton>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
