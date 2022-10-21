import { PropsWithChildren } from 'react'
import { useProtocolContext } from '../../config/createContext'
import Input from '../Atomic/Input'
import { motion } from 'framer-motion'


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
            <div className="mx-6 mt-5 max-w-[1120px]">
                <Input
                    path={path}
                    x="state"
                    label="estado actual del tema y principales antecedentes en la literatura"
                />
                <Input
                    path={path}
                    x="justification"
                    label="Justificación científica, académico-institucional y social"
                />
                <Input
                    path={path}
                    x="problem"
                    label="Definición del problema"
                />
                <Input path={path} x="objectives" label="objetivos" />
            </div>
        </motion.div>
    )
}
