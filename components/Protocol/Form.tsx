import { PropsWithChildren, useEffect, useReducer, useState } from 'react'
import { Section, Input as InputT } from '../../config/types'
import Input from '../Atomic/Input'
import Select from '../Atomic/Select'
import Table from '../Atomic/Table'
import { motion } from 'framer-motion'
import TextEditor from '../Atomic/TextEditor'
import { QuestionMarkCircleIcon } from '@heroicons/react/outline'

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
                className="mx-auto my-5 w-[100%] rounded-md bg-white p-6"
            >
                <div className="flex items-center gap-4 ">
                    <span className="text-xl font-bold uppercase text-primary">
                        {section.name}
                    </span>
                    {section.description ? (
                        <div className="group relative w-2/3">
                            <QuestionMarkCircleIcon className="h-5 w-5 cursor-pointer transition duration-300 group-hover:scale-110" />
                            <section.description className="prose prose-sm prose-zinc absolute top-5 left-5 z-10 hidden bg-base-200 p-3 shadow-lg group-hover:block prose-p:pl-6" />
                        </div>
                    ) : null}
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
