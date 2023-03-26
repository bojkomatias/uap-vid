'use client'
import { TextareaProps } from '@protocol/elements/form/Textarea'
import SectionTitle from '@protocol/elements/form/SectionTitle'
import Select from '@protocol/elements/form/Select'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
const Textarea = dynamic<TextareaProps>(
    () => import('@protocol/elements/form/Textarea')
)

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
