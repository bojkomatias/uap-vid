'use client'
import { PropsWithChildren } from 'react'
import { useProtocolContext } from 'utils/createContext'
import { motion } from 'framer-motion'
import Select from '@protocol/elements/Select'
import Textarea from '@protocol/elements/Textarea'

const results = ['Artículo científico', 'Capítulo de libro', 'Libro']

export default function Publication() {
    const form = useProtocolContext()
    const path = 'sections.publication.'

    return (
        <motion.div
            animate={{ opacity: 1, x: 6 }}
            transition={{ duration: 0.7 }}
            className="opacity-0"
        >
            <div className="flex grow items-center">
                <span className=" ml-10 text-xl font-bold uppercase text-primary">
                    Publicación
                </span>
            </div>
            <div className="mx-auto mt-5 max-w-[1120px]">
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
