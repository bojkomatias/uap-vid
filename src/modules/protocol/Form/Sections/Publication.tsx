'use client'
import SectionTitle from '@protocol/elements/form/SectionTitle'
import Select from '@protocol/elements/form/Select'
import Textarea from '@protocol/elements/form/Textarea'
import { motion } from 'framer-motion'

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
                    path={path + 'result'}
                    options={results}
                    label="Resultado de la investigación"
                />
                <Textarea path={path + 'plan'} label="Plan" />
            </>
        </motion.div>
    )
}
