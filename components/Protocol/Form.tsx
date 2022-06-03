import { PropsWithChildren, useEffect, useReducer, useState } from 'react'
import { Section, Input as InputT, Protocol } from '../../config/types'
import Input from '../Atomic/Input'
import Select from '../Atomic/Select'
import Table from '../Atomic/Table'
import { motion } from 'framer-motion'
import TextEditor from '../Atomic/TextEditor'
import { QuestionMarkCircleIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { useDebouncedValue } from '@mantine/hooks'

export const Form = ({
    section,
    protocol,
    updateProtocol,
}: PropsWithChildren<{
    section: Section
    protocol: Protocol
    updateProtocol: Function
}>) => {
    const [sectionData, setsectionData] = useState<InputT[]>(section.data)

    // * Este metodo esta andando como corresponde, mantiene el orden y actualiza los datos.
    const idempotentUpdateValue = (e: any) => {
        let oldData = sectionData
        if (sectionData.findIndex((x) => x.title === e.title) !== -1) {
            oldData.splice(
                sectionData.findIndex((x) => x.title === e.title),
                1,
                e
            )
        }
        return setsectionData(oldData)
    }
    useEffect(() => {
        // find section updated
        const newProtocol = {
            ...protocol,
            data: protocol.data.splice(
                protocol.data.findIndex(
                    (x) => x.sectionId !== section.sectionId
                ),
                0,
                { ...section, data: sectionData }
            ),
        }
        console.log(sectionData)
        updateProtocol(newProtocol)
    }, [sectionData])

    return (
        <motion.div animate={{ opacity: 1 }} className="opacity-0">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    console.log(sectionData)
                }}
                className="mx-auto my-5 w-5/6 rounded-md bg-white p-6"
            >
                <div className="flex items-center gap-4 ">
                    <span className="text-2xl font-light uppercase text-primary">
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
                                    updateData={(e: any) =>
                                        idempotentUpdateValue(e)
                                    }
                                />
                            ) : i.type === 'select' ? (
                                <Select
                                    data={i}
                                    updateData={(e: any) =>
                                        idempotentUpdateValue(e)
                                    }
                                />
                            ) : i.type === 'textarea' ? (
                                <TextEditor
                                    data={i}
                                    updateData={(e: any) =>
                                        idempotentUpdateValue(e)
                                    }
                                />
                            ) : (
                                <Input
                                    input={i}
                                    updateData={(e: any) =>
                                        idempotentUpdateValue(e)
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            </form>
        </motion.div>
    )
}
