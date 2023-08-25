'use client'
import { useProtocolContext } from 'utils/createContext'
import { motion } from 'framer-motion'
import Select from '@protocol/elements/inputs/select'
import InfoTooltip from '@protocol/elements/tooltip'
import SectionTitle from '@protocol/elements/form-section-title'
import { cache } from 'react'
import { ChronogramList } from '@protocol/elements/inputs/chronogram-list-form'

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
                    conditionalCleanup={(e) => {
                        if (!e) return null
                        form.setFieldValue(
                            path + 'chronogram',
                            structureSemestersFromMonths(e)
                        )
                    }}
                />
                <ChronogramList />
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

const structureSemestersFromMonths = cache((e: string) => {
    const semesters = Number(e.substring(0, 2)) / 6

    const allSemesters = []
    for (let i = 1; i <= semesters; i++) {
        allSemesters.push({ semester: `${i}º semestre`, data: [{ task: '' }] })
    }
    return allSemesters
})

const Info = () => (
    <InfoTooltip>
        La duración de 60 meses solo será aplicable a proyectos vinculados con
        programas doctorales.
        <br />
        Agregue todas las tareas que correspondan por semestre.
    </InfoTooltip>
)
