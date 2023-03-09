'use client'
import { PropsWithChildren } from 'react'
import { useProtocolContext } from 'config/createContext'

import { motion } from 'framer-motion'
import Textarea from '@protocol/elements/Textarea'

export default function Introduction({
    id,
}: PropsWithChildren<{ id: string }>) {
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
            <div className="mx-auto mt-5 max-w-[1120px]">
                <Textarea
                    path={path}
                    x="state"
                    label="estado actual del tema y principales antecedentes en la literatura"
                />
                <Textarea
                    path={path}
                    x="justification"
                    label="Justificación científica, académico-institucional y social"
                />
                <Textarea
                    path={path}
                    x="problem"
                    label="Definición del problema"
                />
                <Textarea path={path} x="objectives" label="objetivos" />
            </div>
        </motion.div>
    )
}
