'use client'
import { useProtocolContext } from 'utils/createContext'
import { motion } from 'framer-motion'
import Select from '@protocol/elements/inputs/select'
import InfoTooltip from '@protocol/elements/tooltip'
import SectionTitle from '@protocol/elements/form-section-title'
import { InputList } from '@protocol/elements/inputs/input-list'

export function DurationForm() {
    const form = useProtocolContext()
    const path = 'sections.duration.'

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
        >
            <SectionTitle title="Duración" />
            <Info />
            <>
                <Select
                    path={path + 'modality'}
                    label="modalidad"
                    options={modalities}
                    conditionalCleanup={() =>
                        (form.values.sections.duration.duration = '')
                    }
                />
                <Select
                    path={path + 'duration'}
                    label="duración"
                    options={duration(form.values.sections.duration.modality)}
                    conditionalCleanup={() =>
                        form.setFieldValue(path + 'chronogram', [
                            { semester: '1er semestre', task: '' },
                            { semester: '2do semestre', task: '' },
                        ])
                    }
                />
                <InputList
                    path={path + 'chronogram'}
                    label="cronograma de tareas"
                    insertedItemFormat={{ semester: '2do', task: '' }}
                    preprocessKey={'semester'}
                    headers={[
                        {
                            x: 'semester',
                            label: 'Semestre',
                            hidden: true,
                        },
                        { x: 'task', label: 'Tarea', class: 'flex-grow' },
                    ]}
                />
            </>
        </motion.div>
    )
}

const modalities = [
    'Proyecto regular de investigación (PRI)',
    'Proyecto de investigación con becados (PIB)',
    'Proyecto de investigación desde las cátedras (PIC)',
    'Proyecto de investigación institucional (PII)',
    'Proyecto de investigación interfacultades (PIIF)',
    'Proyecto I + D + i (PIDi)',
    'Proyecto Tesis Posgrado (PTP)',
]

const duration = (v: string) => {
    if (v === 'Proyecto de investigación desde las cátedras (PIC)')
        return ['6 meses', '12 meses', '24 meses']
    else return ['12 meses', '24 meses', '36 meses', '48 meses', '60 meses']
}

const Info = () => (
    <InfoTooltip>
        La duración de 60 meses solo será aplicable a proyectos vinculados con
        programas doctorales.
        <br />
        Agregue todas las tareas que correspondan por semestre.
    </InfoTooltip>
)
