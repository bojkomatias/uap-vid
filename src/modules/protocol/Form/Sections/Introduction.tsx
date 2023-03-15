'use client'
import { motion } from 'framer-motion'
import Textarea from '@protocol/elements/Textarea'
import SectionTitle from '@protocol/elements/SectionTitle'

export default function Introduction() {
    const path = 'sections.introduction.'

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
        >
            <SectionTitle title="Introducción al proyecto" />
            <span />
            <>
                <Textarea
                    path={path + 'state'}
                    label="estado actual del tema y principales antecedentes en la literatura"
                />
                <Textarea
                    path={path + 'justification'}
                    label="Justificación científica, académico-institucional y social"
                />
                <Textarea
                    path={path + 'problem'}
                    label="Definición del problema"
                />
                <Textarea path={path + 'objectives'} label="objetivos" />
            </>
        </motion.div>
    )
}
