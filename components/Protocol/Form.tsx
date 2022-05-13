import { PropsWithChildren, useEffect, useReducer, useState } from 'react'
import { Section, Input as InputT } from '../../config/types'
import Input from '../Atomic/Input'
import Select from '../Atomic/Select'
import Table from '../Atomic/Table'
import { motion } from 'framer-motion'
import TextEditor from '../Atomic/TextEditor'

export const Form = ({
    section,
}: PropsWithChildren<{
    section: Section
}>) => {
    const [sectionData, setsectionData] = useState<InputT[]>([])

    // ! We could save it here, maybe for autosaves as the user updates
    const idempotentUpdate = (e: any) => {
        let oldData = sectionData
        if (sectionData.find((x) => x.title === e.title)) {
            oldData = sectionData.filter((x) => x.title !== e.title)
        }
        return setsectionData([...oldData, e])
    }

    useEffect(() => {
        return () => {
            console.log('SAVING TO DATABASE CAUSE OF STEP CHANGE', {
                id: section.id,
                name: section.name,
                data: sectionData,
            })
        }
    }, [section])

    return (
        <motion.div animate={{ opacity: 1 }} className="opacity-0">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    console.log(sectionData)
                }}
                className="mx-auto my-5 w-5/6 rounded-md bg-white p-6"
            >
                <div className="text-2xl font-light uppercase text-primary">
                    {section.name}
                </div>
                <div className="mt-5 min-h-[40vh]">
                    {section.data.map((i: InputT) => (
                        <div key={i.title} className="m-3 p-1 ">
                            {i.type === 'table' ? (
                                <Table
                                    data={i}
                                    updateData={(e: any) => idempotentUpdate(e)}
                                />
                            ) : i.type === 'select' ? (
                                <Select
                                    data={i}
                                    updateData={(e: any) => idempotentUpdate(e)}
                                />
                            ) : i.type === 'textarea' ? (
                                <TextEditor
                                    data={i}
                                    updateData={(e: any) => idempotentUpdate(e)}
                                />
                            ) : (
                                <Input
                                    input={i}
                                    updateData={(e: any) => idempotentUpdate(e)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </form>
        </motion.div>
    )
}
