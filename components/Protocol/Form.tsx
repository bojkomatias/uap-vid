import { PropsWithChildren, useEffect, useState } from 'react'
import { Section, Input as InputT } from '../../config/types'
import Input from '../Atomic/Input'
import Select from '../Atomic/Select'
import Table from '../Atomic/Table'
import { motion } from 'framer-motion'

export const Form = ({ section }: PropsWithChildren<{ section: Section }>) => {
    const [sectionData, setsectionData] = useState<object[]>([])

    return (
        <motion.div animate={{ opacity: 1 }} className="opacity-0">
            <div className="mx-auto my-5 w-3/4 rounded-md bg-white p-6">
                <div className="text-3xl font-bold capitalize text-primary">
                    {section.name}
                </div>
                <div className="mt-5 ">
                    {section.data.map((i: InputT) => (
                        <div key={i.title} className="m-3 p-1 ">
                            {i.type === 'table' ? (
                                <Table data={i} />
                            ) : i.type === 'select' ? (
                                <Select data={i} />
                            ) : (
                                <Input
                                    input={i}
                                    updateData={(e: any) =>
                                        setsectionData((prev: any) => [
                                            ...prev,
                                            e,
                                        ])
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <pre>{JSON.stringify(sectionData, null, 2)}</pre>
            <pre>{JSON.stringify(section, null, 2)}</pre>
        </motion.div>
    )
}
