'use client'
import { PropsWithChildren } from 'react'
import { QuestionMark } from 'tabler-icons-react'
import { useProtocolContext } from 'config/createContext'
import { motion } from 'framer-motion'
import Table from '@protocol/elements/Table'
import Select from '@protocol/elements/Select'

const modalities = [
    'Proyecto regular de investigación (PRI)',
    'Proyecto de investigación con becados (PIB)',
    'Proyecto de investigación desde las cátedras (PIC)',
    'Proyecto de investigación institucional (PII)',
    'Proyecto de investigación interfacultades (PIIF)',
    'Proyecto I + D + i (PIDi)',
    'Proyecto Tesis Posgrado (PTP)',
]

const duration = (v: any) => {
    if (v === 'Proyecto de investigación desde las cátedras (PIC)')
        return ['6 meses', '12 meses', '24 meses']
    else return ['12 meses', '24 meses', '36 meses', '48 meses', '60 meses']
}
const chron = (v: string) => {
    if (v === '6 meses') return ['1° semestre']
    if (v === '12 meses') return ['1° semestre', '2° semestre']
    if (v === '24 meses')
        return ['1° semestre', '2° semestre', '3° semestre', '4° semestre']
    if (v === '36 meses')
        return [
            '1° semestre',
            '2° semestre',
            '3° semestre',
            '4° semestre',
            '5° semestre',
            '6° semestre',
        ]
    if (v === '48 meses')
        return [
            '1° semestre',
            '2° semestre',
            '3° semestre',
            '4° semestre',
            '5° semestre',
            '6° semestre',
            '7° semestre',
            '8° semestre',
        ]
    if (v === '60 meses')
        return [
            '1° semestre',
            '2° semestre',
            '3° semestre',
            '4° semestre',
            '5° semestre',
            '6° semestre',
            '7° semestre',
            '8° semestre',
            '9° semestre',
            '10° semestre',
        ]
}

export default function Duration({ id }: PropsWithChildren<{ id: string }>) {
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
                <div className="group relative hover:w-2/3">
                    <QuestionMark className="pointer-events-none ml-2 h-4 w-4 cursor-pointer text-primary transition-all duration-300 group-hover:scale-[1.4]" />

                    <div className="prose prose-sm prose-zinc absolute top-5 left-5 z-10 hidden bg-base-200 p-3 shadow-lg transition-all duration-200 group-hover:block prose-p:pl-6">
                        {' '}
                        La duración de 60 meses solo será aplicable a proyectos
                        vinculados con programas doctorales.
                        <br />
                        Agregue todas las tareas que correspondan por semestre.
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-5 max-w-[1120px]">
                <Select
                    path={path}
                    x="modality"
                    label="modalidad"
                    options={modalities}
                    conditionalCleanup={() =>
                        (form.values.sections[Number(id)].data.modality = '')
                    }
                />
                <Select
                    path={path}
                    x="duration"
                    label="duración"
                    options={duration(
                        form.values.sections[Number(id)].data.modality
                    )}
                />
                <Table
                    path={path}
                    x="chronogram"
                    label="cronograma de tareas"
                    toMap={form.values.sections[Number(id)].data.chronogram}
                    insertedItemFormat={{ semester: '', task: '' }}
                    headers={[
                        {
                            x: 'semester',
                            label: 'Semestre',
                            options: chron(
                                form.values.sections[Number(id)].data.duration
                            ),
                        },
                        { x: 'task', label: 'Tarea', class: 'flex-grow' },
                    ]}
                />
            </div>
        </motion.div>
    )
}
