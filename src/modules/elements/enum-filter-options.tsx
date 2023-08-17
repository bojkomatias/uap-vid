import React from 'react'
import { Button } from './button'
import { useUpdateQuery } from '@utils/updateQuery'
import { useSearchParams } from 'next/navigation'
import { cx } from '@utils/cx'

export default function EnumFilterOptions({
    filter,
    values,
}: {
    filter: string
    values: string[][]
}) {
    const update = useUpdateQuery()
    const searchParams = useSearchParams()
    const currentValues = searchParams.get('values')?.split('-')
    return (
        <div>
            <div className="relative mt-2 flex flex-col items-start text-sm">
                <div className="relative flex gap-2">
                    <div className="flex gap-2">
                        {values.map(([value, name], i) => {
                            return (
                                <Button
                                    onClick={() => {
                                        update({
                                            filter,
                                            values: currentValues
                                                ? currentValues.includes(value)
                                                    ? currentValues
                                                          .filter(
                                                              (e) => e !== value
                                                          )
                                                          .join('-')
                                                    : currentValues
                                                          .join('-')
                                                          .concat('-', value)
                                                : value,
                                        })
                                    }}
                                    className={cx({
                                        'bg-gray-300 hover:bg-gray-200':
                                            currentValues?.includes(value),
                                    })}
                                    intent="badge"
                                    key={i}
                                >
                                    {name}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
