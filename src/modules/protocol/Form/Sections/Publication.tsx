'use client'
import { motion } from 'framer-motion'
import Select from '@protocol/elements/Select'
import Textarea from '@protocol/elements/Textarea'
import SectionTitle from '@protocol/elements/SectionTitle'

const results = ['Artículo científico', 'Capítulo de libro', 'Libro']

export default function Publication() {
    const path = 'sections.publication.'

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
        >
            <SectionTitle title="Publicación" />
            <span />
            <>
                <Select
                    path={path}
                    x="result"
                    options={results}
                    label="Resultado de la investigación"
                />
                <Textarea path={path} x="plan" label="Plan" />
            </>
        </motion.div>
    )
}
