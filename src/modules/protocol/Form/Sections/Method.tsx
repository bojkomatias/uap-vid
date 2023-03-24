'use client'
import SectionTitle from '@protocol/elements/form/SectionTitle'
import Select from '@protocol/elements/form/Select'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useProtocolContext } from 'utils/createContext'
const Textarea = dynamic(() => import('@protocol/elements/form/Textarea'))

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
                <Textarea
                    path={path + 'design'}
                    label="Diseño y tipo de investigación"
                />
                <Textarea path={path + 'participants'} label="Participantes" />
                <Textarea path={path + 'place'} label="Lugar de desarrollo" />
                <Textarea path={path + 'analysis'} label="Análisis de datos" />
                <ConditionalIfRecollection path={path} />
            </>
        )
    if (v === 'Investigaciones de tipo teóricas')
        return (
            <>
                <Textarea
                    path={path + 'detail'}
                    label="Detalle de metodología"
                />
            </>
        )
}

export default function Method() {
    const form = useProtocolContext()
    const path = 'sections.methodology.'

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
        >
            <SectionTitle title="Metodología" />
            <span />
            <>
                <Select
                    path={path + 'type'}
                    options={types}
                    label="tipo de investigación"
                />
                {conditionalByType(
                    form.values.sections.methodology.type!,
                    path
                )}
            </>
        </motion.div>
    )
}

const ConditionalIfRecollection = ({ path }: { path: string }) => {
    const [checked, setChecked] = useState(false)

    return (
        <>
            <div className="flex h-6 mt-6 items-center ml-2">
                <input
                    id="recollection"
                    name="recollection"
                    type="checkbox"
                    className="h-4 w-4 rounded-md border-gray-300 text-primary focus:ring-primary"
                    onChange={() => setChecked((prev) => !prev)}
                />
                <div className="ml-3 mt-0.5 text-sm leading-6">
                    <label
                        htmlFor="recollection"
                        className="label pointer-events-auto"
                    >
                        Proyecto con procedimientos en humanos, animales o en
                        base de datos.
                    </label>
                </div>
            </div>
            {checked ? (
                <>
                    <Textarea
                        path={path + 'procedures'}
                        label="Procedimientos para recolección de datos"
                    />
                    <Textarea
                        path={path + 'instruments'}
                        label="Instrumentos para recolección de datos"
                    />
                    <Textarea
                        path={path + 'considerations'}
                        label="Consideraciones éticas"
                    />
                </>
            ) : null}
        </>
    )
}
