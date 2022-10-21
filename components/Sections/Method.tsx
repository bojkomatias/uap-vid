import { PropsWithChildren } from 'react'
import { useProtocolContext } from '../../config/createContext'
import Select from '../Atomic/Select'
import { motion } from 'framer-motion'
import Input from '../Atomic/Input'
import Textarea from '../Atomic/Textarea'

const types = [
    'Investigaciones cuantitativas, cualitativas, mixtas o experimentales',
    'Investigaciones de tipo teóricas',
]
const conditionalByType = (v: string, path: any) => {
    if (
        v ===
        'Investigaciones cuantitativas, cualitativas, mixtas o experimentales'
    )
        return (
            <>
                <Input
                    path={path}
                    x="design"
                    label="Diseño y tipo de investigación"
                />
                <Input path={path} x="participants" label="Participantes" />
                <Input path={path} x="place" label="Lugar de desarrollo" />
                <Input
                    path={path}
                    x="instruments"
                    label="Instrumentos para recolección de datos"
                />
                <Input
                    path={path}
                    x="procedures"
                    label="Procedimientos para recolección de datos"
                />
                <Input path={path} x="analysis" label="Análisis de datos" />
                <Input path={path} x="considerations" label="Consideraciones" />
            </>
        )
    if (v === 'Investigaciones de tipo teóricas')
        return (
            <>
                <Textarea path={path} x="detail" label="Detalle de metodología" />
            </>
        )
}

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
                {conditionalByType(
                    form.values.sections[Number(id)].data.type,
                    path
                )}
            </div>
        </motion.div>
    )
}
