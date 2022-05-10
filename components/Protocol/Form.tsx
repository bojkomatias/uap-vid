import { PropsWithChildren } from 'react'
import { Section, Input as InputT } from '../../config/types'
import Input from '../Atomic/Input'
import Select from '../Atomic/Select'
import Table from '../Atomic/Table'

export const Form = ({ section }: PropsWithChildren<{ section: Section }>) => {
    return (
        <div className="mx-auto mt-16 w-3/4 rounded-md bg-base-100 p-6">
            <div className="text-xl font-bold capitalize">{section.name}</div>
            <div className="mt-2 rounded-md border p-6">
                {section.content.map((i: InputT) => (
                    <div key={i.title} className=" p-1">
                        {i.type === 'table' ? (
                            <Table data={i} />
                        ) : i.type === 'select' ? (
                            <Select data={i} />
                        ) : (
                            <Input input={i} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
