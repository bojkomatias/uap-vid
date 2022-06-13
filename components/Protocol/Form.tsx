import {
    PropsWithChildren,
    useState,
    useEffect
} from 'react'
import { Section, Input as InputT, Protocol } from '../../config/types'
import Input from '../Atomic/Input'
import Select from '../Atomic/Select'
import Table from '../Atomic/Table'
import { motion } from 'framer-motion'
import TextEditor from '../Atomic/TextEditor'
import { QuestionMarkCircleIcon } from '@heroicons/react/outline'
import gsap from 'gsap'

export const Form = ({
    section,
    updateSection
}: PropsWithChildren<{
    section: Section,
    updateSection: Function
}>) => {
    const [sectionData, setsectionData] = useState<InputT[]>(section.data)
    const [sectionEdited, setSectionEdited] = useState<Section>(section)

    const idempotentUpdateValue = (e: any) => {
        let newData = sectionData
        if (sectionData.findIndex((x) => x.title === e.title) !== -1) {
            newData.splice(
                sectionData.findIndex((x) => x.title === e.title),
                1,
                e
            )
        }

        setSectionEdited({...sectionEdited, data: newData })
        updateSection(sectionEdited)
        return setsectionData(newData)
    }

    useEffect(() => {
        gsap.fromTo(
            '#container',
            { opacity: 0, scale: 0.97 },
            { opacity: 1, scale: 1, duration: 0.5 }
        )

     
    }, [section])
    
    return (
        <div id="container" className="opacity-0">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    console.log(sectionData)
                }}
                className="rounded-md bg-white"
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
                <div className="mx-6 mt-5  max-w-[1120px]">
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
        </div>
    )
}
