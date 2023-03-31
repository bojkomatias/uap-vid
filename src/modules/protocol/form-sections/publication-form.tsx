'use client'
import SectionTitle from '@protocol/elements/form/SectionTitle'
import Select from '@protocol/elements/form/custom-select'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
const Textarea = dynamic(() => import('@protocol/elements/form/custom-textarea'))

export function PublicationForm() {
    const path = 'sections.publication.'

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
        >
            <SectionTitle title="Publicación científica" />
            <span />
            <>
                <Select
                    path={path + 'result'}
                    options={results}
                    label="Producción científica esperada"
                />
                <Textarea
                    path={path + 'title'}
                    label="Titulo del libro o revista"
                />
            </>
        </motion.div>
    )
}

const results = ['Artículo científico', 'Capítulo de libro', 'Libro']
