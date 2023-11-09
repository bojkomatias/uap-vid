'use client'
import { motion } from 'framer-motion'
import SectionTitle from '@protocol/elements/form-section-title'
import { useProtocolContext } from '@utils/createContext'
import NumberInput from '@protocol/elements/inputs/number-input'
import { Plus, Trash } from 'tabler-icons-react'
import { Button } from '@elements/button'
import Input from '@protocol/elements/inputs/input'

export function BibliographyForm() {
    const form = useProtocolContext()

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
        >
            <SectionTitle title="Bibliografía" />
            <span />

            <div>
                <div className="label text-center">cuadro bibliográfico</div>
                <div className="space-y-3 rounded-xl border px-4 pb-2 pt-6">
                    {form.values.sections.bibliography.chart.map((_, index) => (
                        <div
                            key={index}
                            id={`row-${index}`}
                            className="flex w-full items-start justify-around gap-2"
                        >
                            <div className="w-60">
                                <Input
                                    path={`sections.bibliography.chart.${index}.author`}
                                    label={'autor'}
                                />
                            </div>
                            <div className="flex-grow">
                                <Input
                                    path={`sections.bibliography.chart.${index}.title`}
                                    label={'Titulo'}
                                />
                            </div>
                            <div className="w-24">
                                <NumberInput
                                    path={`sections.bibliography.chart.${index}.year`}
                                    label={'Año'}
                                />
                            </div>
                            <Trash
                                onClick={() =>
                                    form.removeListItem(
                                        `sections.bibliography.chart`,
                                        index
                                    )
                                }
                                className={`mt-[2.2rem] h-4 flex-shrink cursor-pointer self-start text-primary hover:text-gray-400 active:scale-[0.90] ${
                                    index == 0
                                        ? 'pointer-events-none invisible'
                                        : ''
                                }`}
                            />
                        </div>
                    ))}

                    <Button
                        onClick={() => {
                            form.insertListItem(`sections.bibliography.chart`, {
                                author: '',
                                title: '',
                                year: 0,
                            })

                            setTimeout(() => {
                                document
                                    .getElementById(
                                        `row-${form.values.sections.identification.team.length}`
                                    )
                                    ?.getElementsByTagName('input')[0]
                                    .focus()
                            }, 10)
                        }}
                        intent="outline"
                        className="mx-auto w-full max-w-xs"
                    >
                        <p> Añadir otra fila </p>
                        <Plus className="h-4 text-gray-500" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
