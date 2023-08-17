import React from 'react'
import { Button } from './button'
import { useSearchParams } from 'next/navigation'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { Trash } from 'tabler-icons-react'
import { getValueByKey } from '@utils/dictionaries/RolesDictionary'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import { scroll } from '@utils/helpers'

export default function EnumFilterOptions({
    options,
    dictionary,
}: {
    options: string[]
    dictionary: any
}) {
    const searchParams = useSearchParams()
    const update = useUpdateQuery()
    return (
        <div>
            <div className="relative mt-2 flex flex-col items-start text-sm">
                <div className="relative flex gap-2">
                    <div
                        id="scrollableDiv"
                        onMouseOver={() => {
                            scroll('scrollableDiv')
                        }}
                        className="flex  gap-2 "
                    >
                        {options.map((o, i) => {
                            return (
                                <Button
                                    className={
                                        getValueByKey(dictionary, o) ==
                                        getValueByKey(
                                            RolesDictionary,
                                            searchParams?.get(
                                                'search'
                                            ) as string
                                        )
                                            ? 'h-5 flex-shrink-0 bg-primary text-white'
                                            : 'h-5 flex-shrink-0'
                                    }
                                    onClick={() => {
                                        update({ search: o })
                                    }}
                                    intent="special"
                                    key={i}
                                >
                                    {getValueByKey(dictionary, o)}
                                </Button>
                            )
                        })}
                        <Button
                            className="h-5"
                            onClick={() => {
                                update({ search: '' })
                            }}
                            intent="primary"
                            key={999}
                        >
                            <Trash height={20} className=" stroke-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
