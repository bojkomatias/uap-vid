import { PropsWithChildren, useEffect, useState } from 'react'
import { Section, Input as InputT } from '../../config/types'
import Input from '../Atomic/Input'
import Select from '../Atomic/Select'
import Table from '../Atomic/Table'

export const Form = ({ section }: PropsWithChildren<{ section: Section }>) => {
    const [sectionData, setsectionData] = useState<object[]>([])

    return (
        <div className="mx-auto my-5 w-3/4 rounded-md bg-base-100 p-6">
            <div className="text-xl font-bold capitalize">{section.name}</div>
            <div className="mt-2 rounded-md border p-6">
                {section.data.map((i: InputT) => (
                    <div key={i.title} className=" p-1">
                        {i.type === 'table' ? (
                            <Table data={i} />
                        ) : i.type === 'select' ? (
                            <Select data={i} />
                        ) : (
                            <Input
                                input={i}
                                updateData={(e: any) =>
                                    setsectionData((prev: any) => [...prev, e])
                                }
                            />
                        )}
                    </div>
                ))}
            </div>
            <pre>{JSON.stringify(sectionData, null, 2)}</pre>
            <pre>{JSON.stringify(section, null, 2)}</pre>
        </div>
    )
}
