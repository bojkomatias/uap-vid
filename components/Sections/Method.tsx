import { PropsWithChildren } from 'react'
import { useProtocolContext } from '../../config/createContext'
import Select from '../Atomic/Select'
import { motion } from 'framer-motion'


const types = [
    'Investigaciones cuantitativas, cualitativas, mixtas o experimentales',
    'Investigaciones de tipo teóricas',
]

export default function Method({ id }: PropsWithChildren<{ id: string }>) {
    const form = useProtocolContext()
    const path = 'sections.' + id + '.data.'

    return (
        <motion.div
            animate={{ opacity: 1, x: 6 }}
            transition={{ duration: 0.7 }}
            className="opacity-0"
        >
            <div className="flex grow items-center">
                <span className=" ml-10 text-xl font-bold uppercase text-primary">
                    {form.values.sections[Number(id)].name}
                </span>
            </div>
            <div className="mx-6 mt-5 max-w-[1120px]">
                <Select
                    path={path}
                    x="type"
                    options={types}
                    label="tipo de investigación"
                />
                {}
                Conditionals
            </div>
        </motion.div>
    )
}
