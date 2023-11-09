import React from 'react'
import { Button } from './button'
import { useSearchParams } from 'next/navigation'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { Badge } from './badge'
import { cx } from '@utils/cx'

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
                    {values[0]?.[0]
                        ? values.map(([value, name], i) => {
                              return (
                                  <Button
                                      onClick={() => {
                                          update({
                                              filter,
                                              values: currentValues
                                                  ? currentValues.includes(
                                                        value
                                                    )
                                                      ? currentValues
                                                            .filter(
                                                                (e) =>
                                                                    e !== value
                                                            )
                                                            .join('-')
                                                      : currentValues
                                                            .join('-')
                                                            .concat('-', value)
                                                  : value,
                                          })
                                      }}
                                      intent="unset"
                                      key={i}
                                  >
                                      <Badge
                                          className={cx(
                                              'cursor-pointer transition hover:bg-primary-100',
                                              currentValues?.includes(value) &&
                                                  'bg-primary-50 ring-primary/50'
                                          )}
                                      >
                                          {name}
                                      </Badge>
                                  </Button>
                              )
                          })
                        : values.map((value, i) => {
                              return (
                                  <Button
                                      onClick={() => {
                                          update({
                                              filter,
                                              values: currentValues
                                                  ? currentValues.includes(
                                                        value
                                                    )
                                                      ? currentValues
                                                            .filter(
                                                                (e) =>
                                                                    e !== value
                                                            )
                                                            .join('-')
                                                      : currentValues
                                                            .join('-')
                                                            .concat('-', value)
                                                  : value,
                                          })
                                      }}
                                      intent="unset"
                                      key={i}
                                  >
                                      <Badge
                                          className={cx(
                                              'cursor-pointer transition hover:bg-gray-200',
                                              currentValues?.includes(value) &&
                                                  'bg-gray-300'
                                          )}
                                      >
                                          {value}
                                      </Badge>
                                  </Button>
                              )
                          })}
                </div>
            </div>
        </div>
    )
}
