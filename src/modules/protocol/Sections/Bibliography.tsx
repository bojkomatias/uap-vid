'use client'
import { PropsWithChildren } from 'react'
import { useProtocolContext } from 'config/createContext'

import { motion } from 'framer-motion'
import Table from '@protocol/elements/Table'

export default function Bibliography({
    id,
}: PropsWithChildren<{ id: string }>) {
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
            </div>
            <div>
                <Table
                    path={path}
                    x="chart"
                    label="cuadro bibliográfico"
                    toMap={form.values.sections[Number(id)].data.chart}
                    insertedItemFormat={{ author: '', title: '', year: '' }}
                    headers={[
                        {
                            x: 'author',
                            label: 'autor',
                        },
                        { x: 'title', label: 'titulo' },
                        { x: 'year', label: 'año' },
                    ]}
                />
            </div>
        </motion.div>
    )
}
