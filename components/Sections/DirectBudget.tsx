import { PropsWithChildren } from 'react'
import { QuestionMark } from 'tabler-icons-react'
import { useProtocolContext } from '../../config/createContext'
import { motion } from 'framer-motion'

import Table from '../Atomic/Table'

export default function DirectBudget({
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
                <div className="group relative hover:w-2/3">
                    <QuestionMark className="pointer-events-none ml-2 h-4 w-4 cursor-pointer text-primary transition-all duration-300 group-hover:scale-[1.4]" />

                    <div className="prose prose-sm prose-zinc absolute top-5 left-5 z-10 hidden bg-base-200 p-3 shadow-lg transition-all duration-200 group-hover:block prose-p:pl-6">
                        Debe detallar todos los insumos y sus costos. Aquellos
                        insumos que fueren adquiridos a través del presupuesto
                        asignado por la UAP, una vez concluido el proyecto,
                        deberán ser entregados en la VID para que esta defina el
                        destino que se les dará.
                        <p>
                            Recuerde que, al solicitar reintegros por gastos
                            directos de investigación, se aprobarán solo
                            aquellos que figuren en el presupuesto que presente
                            en este protocolo, por lo que se solicita que
                            detalle de manera exhaustiva los rubros que
                            considere pertinentes, por ejemplo: insumos de
                            laboratorio, libros, fotocopias, materiales de
                            impresión, correo postal, artículos de librería,
                            papelería, viajes, test, traducciones, publicación,
                            etc.
                        </p>{' '}
                        <p>
                            Para tener derecho al reembolso de cualquier otro
                            gasto que no esté contemplado dentro del presupuesto
                            original, deberá presentar la solicitud al
                            secretario de investigación de la unidad académica
                            para que este gestione la autorización de la
                            Vicerrectoría de Investigación y Desarrollo. Si el
                            investigador efectuara el gasto sin contar con dicha
                            autorización, no podrá exigir su reembolso.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-5 max-w-[1120px]">
                <Table
                    path={path}
                    x="expenses"
                    label="gastos"
                    toMap={form.values.sections[Number(id)].data.expenses}
                    insertedItemFormat={{
                        type: '',
                        detail: '',
                        amount: '',
                        year: '',
                    }}
                    headers={[
                        {
                            x: 'type',
                            label: 'tipo',
                            options: [
                                'Insumos de laboratorio',
                                'Libros',
                                'Fotocopias, materiales de impresión, papelería',
                                'Viajes',
                            ],
                        },
                        { x: 'detail', label: 'detalle' },
                        { x: 'amount', label: 'monto' },
                        {
                            x: 'year',
                            label: 'año',
                            options: [
                                '2022',
                                '2023',
                                '2024',
                                '2025',
                                '2026',
                                '2027',
                            ],
                        },
                    ]}
                />
            </div>
        </motion.div>
    )
}
