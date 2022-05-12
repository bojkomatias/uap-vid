import { PropsWithChildren } from 'react'
import { Section, Input as InputT } from '../../config/types'
import Input from '../Atomic/Input'
import Select from '../Atomic/Select'
import Table from '../Atomic/Table'
import { motion } from 'framer-motion'

export const Form = ({ section }: PropsWithChildren<{ section: Section }>) => {
    return (
        <motion.div animate={{ opacity: 1 }} className="opacity-0">
            <div className="bg-white mx-auto my-5 w-3/4 rounded-md p-6">
                <div className="text-primary text-3xl font-bold capitalize">
                    {section.name}
                </div>
                <div className="mt-5 ">
                    {section.content.map((i: InputT) => (
                        <div key={i.title} className="m-3 p-1 ">
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
        </motion.div>
    )
}
