'use client'
import { useProtocolContext } from 'utils/createContext'
import { motion } from 'framer-motion'
import SectionTitle from '@protocol/elements/form-section-title'
import List from '@protocol/elements/inputs/input-list'

export function BibliographyForm() {
    const form = useProtocolContext()
    const path = 'sections.bibliography.'

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
        >
            <SectionTitle title="Bibliografía" />
            <span />
            <>
                <List
                    path={path + 'chart'}
                    label="cuadro bibliográfico"
                    toMap={form.values.sections.bibliography.chart}
                    insertedItemFormat={{ author: '', title: '', year: 0 }}
                    headers={[
                        {
                            x: 'author',
                            label: 'autor',
                        },
                        { x: 'title', label: 'titulo', class: 'flex-grow' },
                        { x: 'year', label: 'año', number: true },
                    ]}
                />
            </>
        </motion.div>
    )
}
