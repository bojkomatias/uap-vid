'use client'
import { useProtocolContext } from 'utils/createContext'
import { motion } from 'framer-motion'
import Table from '@protocol/elements/Table'
import Select from '@protocol/elements/Select'
import InfoTooltip from '@protocol/elements/InfoTooltip'

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

export default function Duration() {
    const form = useProtocolContext()
    const path = 'sections.duration.'

    return (
        <motion.div
            animate={{ opacity: 1, x: 6 }}
            transition={{ duration: 0.7 }}
            className="opacity-0"
        >
            <div className="flex grow items-center">
                <span className=" ml-10 text-xl font-bold uppercase text-primary">
                    Duración
                </span>
            </div>
            <Info />
            <div className="mx-auto mt-5 max-w-[1120px]">
                <Select
                    path={path}
                    x="modality"
                    label="modalidad"
                    options={modalities}
                    conditionalCleanup={() =>
                        (form.values.sections.duration.modality = '')
                    }
                />
                <Select
                    path={path}
                    x="duration"
                    label="duración"
                    options={duration(form.values.sections.duration.modality)}
                />
                <Table
                    path={path}
                    x="chronogram"
                    label="cronograma de tareas"
                    toMap={form.values.sections.duration.chronogram}
                    insertedItemFormat={{ semester: '', task: '' }}
                    headers={[
                        {
                            x: 'semester',
                            label: 'Semestre',
                            options: chron(
                                form.values.sections.duration.duration
                            ),
                        },
                        { x: 'task', label: 'Tarea', class: 'flex-grow' },
                    ]}
                />
            </div>
        </motion.div>
    )
}

const Info = () => (
    <InfoTooltip>
        La duración de 60 meses solo será aplicable a proyectos vinculados con
        programas doctorales.
        <br />
        Agregue todas las tareas que correspondan por semestre.
    </InfoTooltip>
)
