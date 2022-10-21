import { PropsWithChildren } from 'react'
import { useProtocolContext } from '../../config/createContext'

import Select from '../Atomic/Select'
import { motion } from 'framer-motion'

import Textarea from '../Atomic/Textarea'

const results = ['Artículo científico', 'Capítulo de libro', 'Libro']

export default function Publication({ id }: PropsWithChildren<{ id: string }>) {
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
                    x="result"
                    options={results}
                    label="Resultado de la investigación"
                />
                <Textarea path={path} x="plan" label="Plan" />
            </div>
        </motion.div>
    )
}
