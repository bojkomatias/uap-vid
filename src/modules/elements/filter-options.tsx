import React from 'react'
import { Button } from './button'
import { useSearchParams } from 'next/navigation'
import { useUpdateQuery } from '@utils/updateQuery'
import { Trash } from 'tabler-icons-react'
import { getValueByKey } from '@utils/dictionaries/RolesDictionary'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import { scroll } from '@utils/helpers'

export default function FilterOptions({ options }: { options: string[] }) {
    const searchParams = useSearchParams()
    const update = useUpdateQuery()
    return (
        <div>
            <div className="relative flex flex-col items-start text-sm">
                <div className="relative flex gap-2">
                    <div className="absolute -right-2 h-full w-4 bg-white blur-sm"></div>
                    <div className="absolute -left-2 h-full w-4 bg-white blur-sm"></div>
                    <div
                        id="scrollableDiv"
                        onMouseOver={() => {
                            scroll('scrollableDiv')
                        }}
                        className="flex max-w-[30vw] gap-2 overflow-x-auto overflow-y-hidden scroll-smooth px-4 py-2 "
                    >
                        {options.map((o, i) => {
                            return (
                                <Button
                                    className="h-8 flex-shrink-0"
                                    onClick={() => {
                                        update({ search: o })
                                    }}
                                    intent={
                                        searchParams?.get('search') ===
                                        getValueByKey(RolesDictionary, o)
                                            ? 'special'
                                            : 'secondary'
                                    }
                                    key={i}
                                >
                                    {getValueByKey(RolesDictionary, o)}
                                </Button>
                            )
                        })}
                        <Button
                            className="h-8"
                            onClick={() => {
                                update({ search: '' })
                            }}
                            intent="primary"
                            key={999}
                        >
                            <Trash />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
